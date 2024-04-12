import React, { useLayoutEffect, useState } from 'react';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useFile } from '../../hook/useFile';
import { ImageSizeState } from '../../enum/imageSizeState';
import CameraScreen from '../../screen/Camera/CameraScreen';
import { useRequestPermission } from '../../hook/useCamera';

interface IStoryCamera extends Amity.Community {
  communityAvatar: string;
}

const AmityCreateStoryPage = ({ navigation, route }) => {
  const { targetId, targetType } = route.params;
  useRequestPermission();

  const { getImage } = useFile();
  const [isLoading, setIsLoading] = useState(false);
  const [communityData, setCommunityData] = useState<IStoryCamera>(null);
  useLayoutEffect(() => {
    if (targetType !== 'community' || !targetId) return;
    setIsLoading(true);
    CommunityRepository.getCommunity(
      targetId,
      async ({ error, data, loading }) => {
        if (error) return setIsLoading(false);
        if (!loading) {
          const avatarImage = await getImage({
            fileId: data.avatarFileId,
            imageSize: ImageSizeState.small,
          });
          setCommunityData({ ...data, communityAvatar: avatarImage });
          setIsLoading(false);
        }
      }
    );
  }, [getImage, targetId, targetType]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={isLoading} size="large" color="white" />
      </View>
    );
  }
  if (communityData)
    return (
      <CameraScreen
        navigation={navigation}
        communityId={targetId}
        communityName={communityData?.displayName ?? ''}
        communityAvatar={communityData?.communityAvatar ?? ''}
      />
    );
  return null;
};

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: '#000',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AmityCreateStoryPage;
