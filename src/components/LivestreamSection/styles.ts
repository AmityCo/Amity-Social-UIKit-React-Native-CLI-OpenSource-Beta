import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const styles = StyleSheet.create({
    container: {
      paddingVertical: 10,
    },
    streamLiveContainer: {
      height: 266,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 10,
      backgroundColor: '#000000',
      gap: 8,
      margin: -16,
    },
    streamEndedContainer: {
      height: 266,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 10,
      backgroundColor: '#000000',
      gap: 8,
      margin: -16,
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
  });
  return styles;
};
