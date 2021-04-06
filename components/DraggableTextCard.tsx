import React from 'react'
import { PlatformColor, Pressable, useColorScheme } from "react-native"
import { DraxView } from 'react-native-drax'
import { Text, View } from "./Themed"

const DraggableTextCard = ({ text }) => {
  const colorScheme = useColorScheme()
  return (
    <DraxView
      style={{
        borderRadius: 10,
        padding: '6%',
        backgroundColor: colorScheme === 'dark' ? PlatformColor('systemGray5') : '#f8fbf8',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        width: '80%',
        marginLeft: '10%',
        marginBottom: '10%'
      }}
      onDragStart={() => {
        console.log('start drag');
      }}
      onDragEnd={() => {
        console.log('end drag');
  
      }}
      payload={text}>
      <Text>{text}</Text>
</DraxView>
  )
}

export default DraggableTextCard