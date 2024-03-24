import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const styles = StyleSheet.create({
    streamEndedContainer: {
      marginVertical: 10,
      gap: 8,
      marginHorizontal: -16,
      backgroundColor: '#000000',
      height: 266,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    streamNotAvailableTitle: {
      color: '#FFFFFF',
      fontSize: 17,
      lineHeight: 22,
      fontWeight: '600',
    },
    streamNotAvailableDescription: {
      color: '#FFFFFF',
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '400',
      textAlign: 'center',
    },
  });
  return styles;
};
