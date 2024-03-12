import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Text, TextInput, Image, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { closeIcon, editThumbnailIcon, syncIcon } from '../../svg/svg-xml-list';
import { useStyles } from './styles';
import { StreamRepository, PostRepository } from '@amityco/ts-sdk-react-native';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import useImagePicker from '../../../src/hooks/useImagePicker';

import { LiveStreamView } from '@api.video/react-native-livestream';
import { uploadImageFile } from '../../../src/providers/file-provider';

const CreateLivestream = ({ navigation, route }) => {
  const { targetId, targetType, targetName } = route.params;

  const styles = useStyles();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [newStream, setNewStream] = useState<Amity.Stream | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState<number>(0);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [fileId, setFileId] = useState<string | null>(null);

  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back'
  );

  const ref = useRef(null);
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const { imageUri, removeSelectedImage, openImageGallery } = useImagePicker({
    selectionLimit: 1,
    mediaType: 'photo',
    includeBase64: false,
  });

  const renderOptionIcon = (icon: string, onClick: () => void) => {
    return (
      <TouchableOpacity style={styles.optionIcon} onPress={onClick}>
        <View style={styles.optionIconInner}>
          <SvgXml xml={icon} width={18} height={18} />
        </View>
      </TouchableOpacity>
    );
  };

  const uploadFile = useCallback(async (uri: string) => {
    const file: Amity.File<any>[] = await uploadImageFile(uri);
    if (file) {
      setFileId(file[0].fileId);
    }
  }, []);

  const onGoLive = useCallback(async () => {
    setIsConnecting(true);
    setIsLive(true);

    if (imageUri) await uploadFile(imageUri);

    const { data } = await StreamRepository.createStream({
      title,
      description,
      thumbnailFileId: fileId,
    });

    if (data) {
      setNewStream(data);
    }
  }, [title, description, imageUri, fileId, uploadFile]);

  const onStreamConnectionSuccess = () => {
    setIsConnecting(false);
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
      setTitle('');
      setDescription('');
      setTime(0);
      clearInterval(timer);
    }
  }, [newStream, timer]);

  const onSwitchCamera = () => {
    if (cameraPosition === 'back') {
      setCameraPosition('front');
    } else {
      setCameraPosition('back');
    }
  };

  const calculateTime = () => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor(time / 60000);
    const seconds = ((time % 60000) / 1000).toFixed(0);

    const hoursString = `${hours < 10 ? '0' : ''}${hours}`;
    const minutesString = `${minutes < 10 ? '0' : ''}${minutes}`;
    const secondsString = `${Number(seconds) < 10 ? '0' : ''}${seconds}`;

    return `${
      hours > 0 ? hoursString + ':' : ''
    }${minutesString}:${secondsString}`;
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

  useEffect(() => {
    if (imageUri && actionSheetRef.current) actionSheetRef.current?.hide();
  }, [imageUri]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <LiveStreamView
            style={styles.livestreamView}
            ref={ref}
            camera={cameraPosition}
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
              isStereo: false,
            }}
            isMuted={false}
            onConnectionSuccess={onStreamConnectionSuccess}
            onConnectionFailed={(e) => {
              console.error('connection failed', e);
            }}
            onDisconnect={() => {
              console.log('disConnected');
            }}
          />

          {isLive ? (
            <View style={styles.streamingWrap}>
              <View style={styles.streamingTimerWrap}>
                <Text style={styles.streamingTimer}>
                  {isConnecting ? 'Connecting...' : `LIVE ${calculateTime()}`}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.idleWrap}>
              <View style={styles.idleWraplInner}>
                <View style={styles.optionTopWrap}>
                  {renderOptionIcon(closeIcon('white'), () =>
                    navigation.goBack()
                  )}
                  <View style={styles.optionTopRightWrap}>
                    {renderOptionIcon(syncIcon('white'), onSwitchCamera)}
                    <TouchableOpacity
                      style={styles.optionIcon}
                      onPress={() => {
                        if (imageUri && actionSheetRef.current)
                          actionSheetRef.current?.show();
                        else openImageGallery();
                      }}
                    >
                      {imageUri ? (
                        <Image
                          source={{ uri: imageUri }}
                          style={styles.thumbnailImage}
                        />
                      ) : (
                        <View style={styles.optionIconInner}>
                          <SvgXml
                            xml={editThumbnailIcon('#FFFFFF')}
                            width={18}
                            height={18}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
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
          )}
        </View>

        <View style={styles.footer}>
          {isLive ? (
            <View style={styles.streamingFooter}>
              {renderOptionIcon(syncIcon('white'), onSwitchCamera)}
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
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={styles.actionSheetContainer}
      >
        <TouchableOpacity
          style={styles.actionSheetButton}
          onPress={() => {
            openImageGallery();
          }}
        >
          <Text style={styles.actionSheetButtonNormalText}>
            Change cover image
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionSheetButton}
          onPress={() => {
            removeSelectedImage();
            actionSheetRef.current?.hide();
          }}
        >
          <Text style={styles.actionSheetButtonDeleteText}>
            Delete cover image
          </Text>
        </TouchableOpacity>
      </ActionSheet>
    </>
  );
};

export default CreateLivestream;
