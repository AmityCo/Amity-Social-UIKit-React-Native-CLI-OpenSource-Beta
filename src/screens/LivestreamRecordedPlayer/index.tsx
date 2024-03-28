import React, { useRef } from 'react';
import { Alert, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../routes/RouteParamList';
import Video from 'react-native-video';
import { useStyles } from './styles';

const LivestreamRecordedPlayer = () => {
  const route =
    useRoute<RouteProp<RootStackParamList, 'LivestreamRecordedPlayer'>>();
  const { source } = route.params;
  const videoRef = useRef(null);
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Video
        fullscreen
        ref={videoRef}
        source={{ uri: source }}
        style={styles.player}
        resizeMode="contain"
        controls={true}
        bufferConfig={{
          minBufferMs: 1500,
          maxBufferMs: 1500,
          bufferForPlaybackMs: 1500,
          bufferForPlaybackAfterRebufferMs: 1500,
        }}
        onError={() => {
          Alert.alert('Error while playing video');
        }}
        onVideoError={() => {
          Alert.alert('Error while playing video');
        }}
      />
    </View>
  );
};

export default LivestreamRecordedPlayer;
