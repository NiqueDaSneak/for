import React from 'react';
import {
  PlatformColor,
  Pressable,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Text } from './Themed';

const PressableTextCard = ({ disabled, onPress, text, style = {} }) => {
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    container: {
      borderRadius: 10,
      padding: '6%',
      backgroundColor:
        colorScheme === 'dark' ? PlatformColor('systemGray5') : '#f8fbf8',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
      width: '90%',
      marginLeft: '5%',
      marginBottom: '5%',
      ...style,
    },
  });
  return (
    <Pressable
      disabled={disabled}
      onPress={() => onPress()}
      style={styles.container}
    >
      <Text>{text}</Text>
    </Pressable>
  );
};

export default PressableTextCard;
