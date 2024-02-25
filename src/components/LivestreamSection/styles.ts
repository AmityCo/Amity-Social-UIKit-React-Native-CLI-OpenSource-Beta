import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const streamContainer = {
    height: 221,
    marginVertical: 10,
    gap: 8,
    marginHorizontal: -16,
  };
  const styles = StyleSheet.create({
    container: {
      paddingVertical: 10,
    },
    streamContainer,
    streamLiveContainer: {
      ...streamContainer,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    streamEndedContainer: {
      ...streamContainer,
      height: 266,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    streamEndedTitle: {
      color: '#FFFFFF',
      fontSize: 17,
      lineHeight: 22,
      fontWeight: '600',
    },
    streamEndedDescription: {
      color: '#FFFFFF',
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '400',
      textAlign: 'center',
    },
    streamImageCover: {
      width: '100%',
      height: '100%',
    },
    streamStatus: {
      position: 'absolute',
      top: 16,
      left: 16,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: 5,
      zIndex: 1,
    },
    streamStatusText: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    streamPlayButton: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -50 }, { translateY: -50 }],
      paddingHorizontal: 26,
      paddingVertical: 20,
    },
  });
  return styles;
};
