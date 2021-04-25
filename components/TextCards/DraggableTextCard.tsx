import React from 'react';
import { PlatformColor, StyleSheet, useColorScheme } from 'react-native';
import { Text } from '../Themed';
import { DraxView } from 'react-native-drax';

const DraggableTextCard = ({
  text,
  receivingStyle,
  payload,
  onDragStart,
  onReceiveDragDrop,
}) => {
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    cardContainer: {
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
      width: '70%',
      marginBottom: '6%',
    },
  });

  return (
    <DraxView
      receivingStyle={receivingStyle}
      payload={payload}
      onDragStart={onDragStart}
      onReceiveDragDrop={onReceiveDragDrop}
      style={styles.cardContainer}
    >
      <Text>{text}</Text>
    </DraxView>
  );
};

export default DraggableTextCard;
