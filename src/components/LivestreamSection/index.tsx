import { Image, Platform, TouchableOpacity, View, Text } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { StreamRepository } from '@amityco/ts-sdk-react-native';
import { useStyles } from './styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAuth from '../../../src/hooks/useAuth';
import { RootStackParamList } from '../../../src/routes/RouteParamList';
import { SvgXml } from 'react-native-svg';
import { playBtn } from '../../../src/svg/svg-xml-list';
import { exclamationIcon } from '../../../src/svg/svg-xml-list';
import Video from 'react-native-video';

interface ILivestreamSection {
  streamId: Amity.Stream['streamId'];
}

const LivestreamSection: React.FC<ILivestreamSection> = ({ streamId }) => {
  const styles = useStyles();
  const { apiRegion } = useAuth();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, 'VideoPlayer'>
    >();

  const videoPlayerRef = React.useRef<Video>(null);

  const [livestream, setLivestream] = useState<Amity.Stream>();
  const [livestreamUrl, setLivestreamUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const onPlayVideo = () => {
    if (Platform.OS === 'ios') {
      setIsPlaying(true);
      setTimeout(() => {
        if (videoPlayerRef.current) {
          videoPlayerRef.current.presentFullscreenPlayer();
        }
      }, 100);
    } else {
      navigation.navigate('VideoPlayer', {
        source: livestreamUrl,
      });
    }
  };

  const onClosePlayer = () => {
    setIsPlaying(false);
  };

  const getLivestreamThumbnail = useCallback(() => {
    return livestream.thumbnailFileId
      ? {
          uri: `https://api.${apiRegion}.amity.co/api/v3/files/${livestream.thumbnailFileId}/download`,
        }
      : require('../../../assets/images/default-livestream-thumbnail.png');
  }, [livestream, apiRegion]);

  useEffect(() => {
    const getLivestream = () => {
      return StreamRepository.getStreamById(
        streamId,
        ({ data, loading, error }) => {
          if (error) console.error('Error fetching livestream', error);
          if (!loading && data) {
            setLivestream({ ...data });

            if (
              data.recordings &&
              data.recordings.length > 0 &&
              data.recordings[0]?.mp4?.url
            ) {
              setLivestreamUrl(data.recordings[0].mp4.url);
            }
          }
        }
      );
    };

    const unsubscribe = getLivestream();

    return () => {
      unsubscribe();
    };
  }, [streamId]);

  if (livestream) {
    return (
      <View>
        {!livestream.isLive && livestream.status === 'idle' && (
          <View key={livestream.streamId} style={styles.streamEndedContainer}>
            <SvgXml xml={exclamationIcon('#FFFFFF')} width="28" height="28" />
            <Text style={styles.streamNotAvailableDescription}>
              {'This stream is currently \nunavailable'}
            </Text>
          </View>
        )}

        {!livestream.isLive && livestream.status === 'ended' && (
          <View key={livestream.streamId} style={styles.streamEndedContainer}>
            <Text style={styles.streamNotAvailableTitle}>
              This livestream has ended.
            </Text>
            <Text style={styles.streamNotAvailableDescription}>
              {'Playback will be available for you \nto watch shortly.'}
            </Text>
          </View>
        )}

        {!livestream.isLive && livestream.status === 'recorded' && (
          <View key={livestream.streamId} style={styles.streamLiveContainer}>
            <Image
              source={getLivestreamThumbnail()}
              style={styles.streamImageCover}
            />
            <View style={styles.streamStatus}>
              <Text style={styles.streamStatusText}>RECORDED</Text>
            </View>
            <TouchableOpacity
              style={styles.streamPlayButton}
              onPress={onPlayVideo}
            >
              <SvgXml xml={playBtn} width="50" height="50" />
            </TouchableOpacity>
          </View>
        )}

        {livestream.isLive && (
          <View>
            <Text>Live</Text>
          </View>
        )}

        {isPlaying && livestreamUrl && (
          <Video
            source={{ uri: livestreamUrl }}
            onFullscreenPlayerDidDismiss={onClosePlayer}
            ref={videoPlayerRef}
            fullscreen={true}
          />
        )}
      </View>
    );
  }

  return null;
};

export default React.memo(LivestreamSection);
