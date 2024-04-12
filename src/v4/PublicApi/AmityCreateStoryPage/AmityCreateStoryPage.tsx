import React, { FC, memo, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/RouteParamList';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import { ActivityIndicator, Text } from 'react-native';
import { ICreateStoryPage } from '../types';
import { useFile } from '../../hook/useFile';
import { ImageSizeState } from '../../enum/imageSizeState';

const AmityCreateStoryPage: FC<ICreateStoryPage> = ({
  targetId,
  targetType,
}) => {
  const { getImage } = useFile();
  const navigation =
    useNavigation() as NativeStackNavigationProp<RootStackParamList>;
  const [isLoading, setIsLoading] = useState(false);
  console.log('aa');
  useLayoutEffect(() => {
    console.log('Gg');
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

          navigation.navigate('Camera', {
            communityId: targetId,
            communityName: data?.displayName,
            communityAvatar: avatarImage,
          });
          setIsLoading(false);
        }
      }
    );
  }, [getImage, navigation, targetId, targetType]);

  if (isLoading) {
    return (
      <ActivityIndicator animating={isLoading} size="large" color="grey" />
    );
  }
  return <Text>GG</Text>;
};

export default memo(AmityCreateStoryPage);
