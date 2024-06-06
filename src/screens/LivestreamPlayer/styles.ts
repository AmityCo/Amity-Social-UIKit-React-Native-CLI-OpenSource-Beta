import { StatusBar, StyleSheet } from 'react-native';

export const useStyles = () => {
  const styles = StyleSheet.create({
    container: {
      position: 'relative',
      flex: 1,
    },
    topSectionWrap: {
      position: 'absolute',
      top: StatusBar.currentHeight + 30,
      paddingHorizontal: 16,
    },
    status: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: '#FF305A',
      borderRadius: 5,
      zIndex: 1,
    },
    statusText: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    controlView: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      // zIndex: 1,
    },
    controller: {
      position: 'absolute',
      bottom: 60,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    controllerButton: {
      borderColor: '#FFFFFF',
      width: 60,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    streamEndedWrap: {
      height: '100%',
      justifyContent: 'center',
    },
    closeButton: {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      top: StatusBar.currentHeight + 30,
      right: 16,
      width: 30,
      height: 30,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      borderRadius: 72,
    },
  });

  return styles;
};
