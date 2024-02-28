import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      backgroundColor: '#000000',
    },
    cameraContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    cameraInnerContainer: {
      padding: 16,
    },
    optionTopWrap: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
    },
    optionTopRightWrap: {
      flexDirection: 'row',
      gap: 10,
    },
    optionIcon: {
      borderRadius: 50,
    },
    postTarget: {
      marginTop: 36,
      flexDirection: 'row',
      alignItems: 'center',
      color: 'whites',
      gap: 6,
    },
    avatar: {
      width: 28,
      height: 28,
    },
    targetName: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '600',
      lineHeight: 20,
    },
    detailWrap: {
      marginTop: 28,
    },
    title: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
      height: 40,
      padding: 0,
    },
    description: {
      color: '#FFF',
      fontSize: 14,
      height: 40,
      padding: 0,
    },
    footer: {
      backgroundColor: '#000000',
      height: '10%',
    },
    footerButton: {
      backgroundColor: '#FFFFFF',
      borderColor: '#A5A9B5',
      borderRadius: 4,
      height: 40,
      width: '90%',
      marginHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    footerButtonText: {
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '600',
      color: '#292B32',
    },
  });

  return styles;
};
