import React from 'react'
import { PlatformColor, Pressable, useColorScheme } from "react-native"
import { Text } from "./Themed"

const PressableTextCard = ({ onPress, text }) => {
  const colorScheme = useColorScheme()
  return (
<Pressable
onPress={() => onPress()}
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
  width: '90%', 
  marginLeft: '5%', 
  marginBottom: '5%'
}}>
<Text>{text}</Text>
</Pressable>
  )
}

export default PressableTextCard