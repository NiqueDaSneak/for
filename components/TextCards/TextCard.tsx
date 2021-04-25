import React from 'react';
import { PlatformColor, StyleSheet, useColorScheme } from 'react-native';
import { Text, View } from '../Themed';

const TextCard = ({ text }: { text: string }) => {
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    cardContainer: {
      minWidth: 210,
      borderRadius: 10,
      padding: '6%',
      backgroundColor:
        colorScheme === 'dark'
          ? PlatformColor('systemGray5')
          : PlatformColor('systemGray5'),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
      maxWidth: '70%',
      marginBottom: '6%',
      minHeight: 66,
    },
  });

  return (
    <View style={[styles.cardContainer]}>
      <Text>{text}</Text>
    </View>
  );
};

export default TextCard;
