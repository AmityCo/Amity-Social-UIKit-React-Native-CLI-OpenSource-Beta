import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Text, TextInput, Image, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { closeIcon, editThumbnailIcon, syncIcon } from '../../svg/svg-xml-list';
import { useStyles } from './styles';
import { StreamRepository, PostRepository } from '@amityco/ts-sdk-react-native';
import { LiveStreamView } from '@api.video/react-native-livestream';

const CreateLivestream = ({ navigation, route }) => {
  const { targetId, targetType, targetName } = route.params;

  const styles = useStyles();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [newStream, setNewStream] = useState<Amity.Stream | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState<number>(0);

  const ref = useRef(null);

  const renderOptionIcon = (icon: string, onClick: () => void) => {
    return (
      <TouchableOpacity style={styles.optionIcon} onPress={onClick}>
        <View style={styles.optionIconInner}>
          <SvgXml xml={icon} width={18} height={18} />
        </View>
      </TouchableOpacity>
    );
  };

  const onGoLive = useCallback(async () => {
    const { data } = await StreamRepository.createStream({
      title,
      description,
    });

    if (data) {
      setNewStream(data);
      setIsLive(true);
    }
  }, [title, description]);

  const onStreamConnectionSuccess = () => {
    console.log('connection success');
    const intervalId = setInterval(() => {
      setTime((prev) => prev + 1000);
    }, 1000);
    setTimer(intervalId);
  };

  const onStopStream = useCallback(async () => {
    if (newStream) {
      await StreamRepository.disposeStream(newStream.streamId);
      setIsLive(false);
      setNewStream(null);
      clearInterval(timer);
    }
  }, [newStream, timer]);

  const calculateTime = () => {
    const minutes = Math.floor(time / 60000);
    const seconds = ((time % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < '10' ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    const createStreamPost = async (streamId: Amity.Stream['streamId']) => {
      await PostRepository.createPost({
        targetId,
        targetType,
        dataType: 'liveStream',
        data: {
          streamId,
        },
      });
    };
    if (newStream) {
      try {
        const streamId = newStream.streamId;
        const [url, query] = newStream.streamerUrl.url.split(`/${streamId}`);

        ref?.current.startStreaming(streamId + query, url);

        createStreamPost(streamId);
      } catch (e) {
        console.log('error', e);
      }
    }
  }, [targetId, targetType, newStream]);

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <LiveStreamView
          style={styles.livestreamView}
          ref={ref}
          camera="back"
          enablePinchedZoom={true}
          video={{
            fps: 30,
            resolution: '720p',
            bitrate: 2 * 1024 * 1024, // # 2 Mbps
            gopDuration: 1, // 1 second
          }}
          audio={{
            bitrate: 128000,
            sampleRate: 44100,
            isStereo: true,
          }}
          isMuted={false}
          onConnectionSuccess={onStreamConnectionSuccess}
          onConnectionFailed={(e) => {
            console.log('connection failed', e);
          }}
          onDisconnect={() => {
            console.log('disconnected');
          }}
        />

        {!isLive ? (
          <View style={styles.idleWrap}>
            <View style={styles.idleWraplInner}>
              <View style={styles.optionTopWrap}>
                {renderOptionIcon(closeIcon('white'), () =>
                  navigation.goBack()
                )}
                <View style={styles.optionTopRightWrap}>
                  {renderOptionIcon(syncIcon('white'), () => {})}
                  {renderOptionIcon(editThumbnailIcon('white'), () => {})}
                </View>
              </View>
              <View style={styles.postTarget}>
                <Image
                  source={require('./../../../assets/icon/Placeholder.png')}
                  style={styles.avatar}
                />
                <Text style={styles.targetName}>{targetName}</Text>
              </View>
              <View style={styles.seperator} />
              <View style={styles.detailWrap}>
                <TextInput
                  style={styles.title}
                  placeholder="Title"
                  placeholderTextColor={'rgba(255, 255, 255, 0.2)'}
                  onChangeText={(text) => setTitle(text)}
                  value={title}
                />
                <TextInput
                  style={styles.description}
                  placeholder="Tap to add post description..."
                  placeholderTextColor={'rgba(255, 255, 255, 0.2)'}
                  onChangeText={(text) => setDescription(text)}
                  value={description}
                />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.streamingWrap}>
            <Text
              style={styles.streamingTimer}
            >{`LIVE ${calculateTime()}`}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        {!isLive ? (
          <View style={styles.streamingFooter}>
            {renderOptionIcon(syncIcon('white'), () => {})}
            <TouchableOpacity
              style={styles.finishButton}
              onPress={onStopStream}
            >
              <Text style={styles.finishButtonText}>Finish</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.goLiveButton} onPress={onGoLive}>
            <Text style={styles.goLiveButtonText}>Go Live</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CreateLivestream;
