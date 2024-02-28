import React, { useState } from 'react';

import { Text, TextInput, Image, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { closeIcon, editThumbnailIcon, syncIcon } from '../../svg/svg-xml-list';
import { useStyles } from './styles';

import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { useTheme } from 'react-native-paper';

const CreateLivestream = ({ navigation, route }) => {
  const {
    targetId,
    targetType,
    targetName,
    postSetting,
    needApprovalOnPostCreation,
  } = route.params;

  const styles = useStyles();
  const theme = useTheme() as MyMD3Theme;

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [newStream, setNewStream] = useState<Amity.Stream | null>(null);

  const renderOptionIcon = (icon: string, onClick: () => void) => {
    return (
      <TouchableOpacity style={styles.optionIcon} onPress={onClick}>
        <SvgXml xml={icon} width={18} height={18} />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <View style={styles.cameraInnerContainer}>
          <View style={styles.optionTopWrap}>
            {renderOptionIcon(closeIcon('white'), () => {})}
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
          <View style={styles.detailWrap}>
            <TextInput
              style={styles.title}
              placeholder="Livestream title"
              placeholderTextColor={'#FFFFFF'}
              onChangeText={(text) => setTitle(text)}
            />
            <TextInput
              style={styles.description}
              placeholder="Tap to add post description..."
              placeholderTextColor={'#FFFFFF'}
              onChangeText={(text) => setDescription(text)}
            />
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>Go Live</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateLivestream;
