import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#000000',
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
    },
    player: {
      width: '100%',
      height: 266,
    },
  });

  return styles;
};
