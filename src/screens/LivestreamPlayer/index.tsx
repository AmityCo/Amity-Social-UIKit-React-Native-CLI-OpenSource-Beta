import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { NodePlayer } from 'react-native-nodemediaclient';
import { useStyles } from './styles';
import { playIcon, pauseIcon } from '../../../src/svg/svg-xml-list';
import { SvgXml } from 'react-native-svg';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../routes/RouteParamList';
import { StreamRepository } from '@amityco/ts-sdk-react-native';
import LivestreamEndedView from '../../components/LivestreamSection/LivestreamEndedView';

const LiveStreamPlayer = () => {
  const ref = useRef(null);
  const styles = useStyles();
  const route = useRoute<RouteProp<RootStackParamList, 'LivestreamPlayer'>>();

  const { streamId } = route.params;

  const [stream, setStream] = useState<Amity.Stream>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const naviation = useNavigation();

  const onStopPlayer = () => {
    ref.current.stop();
    setIsPlaying(false);
  };

  const onStartPlayer = () => {
    ref.current.start();
    setIsPlaying(true);
  };

  const onPressControlButton = () => {
    isPlaying ? onStopPlayer() : onStartPlayer();
  };

  useEffect(() => {
    const unsubscribe = StreamRepository.getStreamById(
      streamId,
      ({ data, loading }) => {
        if (!loading && data) setStream(data);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [streamId]);

  return (
    <View style={styles.container}>
      {stream && stream.status && stream.status === 'ended' ? (
        <LivestreamEndedView />
      ) : (
        <>
          <View style={styles.topSectionWrap}>
            <View style={styles.status}>
              <Text style={styles.statusText}>LIVE</Text>
            </View>
            <TouchableOpacity onPress={() => naviation.goBack()}>
              <Image
                source={require('./../../../assets/icon/ClosePlayer.png')}
              />
            </TouchableOpacity>
          </View>
          {stream && stream.watcherUrl && (
            <NodePlayer
              ref={ref}
              style={{ flex: 1 }}
              url={stream.watcherUrl.rtmp.url}
              autoplay={true}
              scaleMode={1}
              bufferTime={500}
            />
          )}
          <View style={styles.controller}>
            <TouchableOpacity
              onPress={onPressControlButton}
              style={styles.controllerButton}
            >
              <SvgXml
                xml={isPlaying ? pauseIcon() : playIcon()}
                width={24}
                height={60}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default LiveStreamPlayer;
