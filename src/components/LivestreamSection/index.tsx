import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StreamRepository } from '@amityco/ts-sdk-react-native';
import { Text } from 'react-native-paper';
import { useStyles } from './styles';

interface ILivestreamSection {
  streamId: Amity.Stream['streamId'];
}

const LivestreamSection: React.FC<ILivestreamSection> = ({ streamId }) => {
  const styles = useStyles();

  const [livestream, setLivestream] = useState<Amity.Stream>();

  useEffect(() => {
    const getLivestream = () => {
      return StreamRepository.getStreamById(
        streamId,
        ({ data, loading, error }) => {
          if (error) console.error('Error fetching livestream', error);
          if (!loading && data) setLivestream({ ...data });
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
        {!livestream.isLive && livestream.status === 'ended' && (
          <View key={livestream.streamId} style={styles.streamEndedContainer}>
            <Text style={styles.streamEndedTitle}>
              This livestream has ended.
            </Text>
            <Text style={styles.streamEndedDescription}>
              {'Playback will be available for you \nto watch shortly.'}
            </Text>
          </View>
        )}

        {!livestream.isLive && livestream.status === 'recorded' && (
          <View>
            <Text>Recorded Livestream</Text>
          </View>
        )}

        {livestream.isLive && (
          <View>
            <Text>Live</Text>
          </View>
        )}
      </View>
    );
  }

  return null;
};

export default React.memo(LivestreamSection);
