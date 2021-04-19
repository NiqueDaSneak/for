import React from 'react'
import { BlurView } from 'expo-blur'
import { Modal, 
  Image, 
  View, 
  Text, 
  Button,
  PlatformColor} from "react-native"
import { useFonts } from '../../hooks/useFonts'

const NewUserHelpModal = ({ visible, colorScheme, close }: { visible: boolean; colorScheme: string; close: Function }) => {
  const {fontTypes, fontSizes} = useFonts()

  const featuresList = [
    {
      text: 'Answering questions will allow you to tell your story, and Tune In with what your intuition is saying.',
      image: {
        dark: require('../../assets/images/tunein-icon-dark.png'),
        light: require('../../assets/images/tunein-icon-light.png')
    }},
    {
      text: 'Once we have some answers, we can figure out which of our digital thoughts Align, and categorize them accordingly',
      image: {
        dark: require('../../assets/images/align-icon-dark.png'),
        light: require('../../assets/images/align-icon-light.png')
    }},
    {
      text: 'Opportunities will arise when we see organization. Some opportunites are for contemplation, and some require us to Act.',
      image: {
        dark: require('../../assets/images/act-icon-dark.png'),
        light: require('../../assets/images/act-icon-light.png')
      }}]
  return (
    <Modal
      presentationStyle='overFullScreen'
      animationType='fade'
      transparent
      visible={visible}>
      <BlurView
        intensity={100}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          paddingTop: '20%',
          paddingBottom: '20%',
        }}>
        <Image 
          resizeMode="contain"
          resizeMethod="resize"
          style={{
            resizeMode: 'contain',
            height: 100,
            width: 100,
          }}
          source={require('../../assets/images/logo-green.png')}
        />
        <Text style={[fontTypes.heading, {color: colorScheme === 'dark' ? PlatformColor('systemGray') :  PlatformColor('systemGray')}]}>Welcome</Text>
        {featuresList.map(component => (
        <View key={component.text} style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center'
        }}>
        <Image 
          resizeMode="contain"
          resizeMethod="resize"
          style={{
            resizeMode: 'contain',
            height: 60,
            width: 60,
          }}
          source={colorScheme === 'dark' ? component?.image?.dark : component?.image?.light} />
            <Text style={{ width: '60%', color: PlatformColor('systemGray') }}>{component.text}</Text>
        </View>
        ))}
        <Button title="Let's Get After It" color={colorScheme === 'dark' ? 'lightgreen' : 'green'} />
        </BlurView>
    </Modal>
  )
}

export default NewUserHelpModal