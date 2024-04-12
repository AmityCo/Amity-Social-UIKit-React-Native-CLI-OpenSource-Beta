import React from 'react';
import CameraScreen from '../../screen/Camera/CameraScreen';
import { useRequestPermission } from '../../hook/useCamera';

const AmityCreateStoryPage = ({ navigation, route }) => {
  const { targetId, targetType } = route.params;
  useRequestPermission();

  if (targetType !== 'community' || !targetId) return null;
  return <CameraScreen navigation={navigation} communityId={targetId} />;
};

export default AmityCreateStoryPage;
