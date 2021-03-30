import React, {useContext} from 'react'
import {
  View,
  Image, 
  Text,
  PlatformColor
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  useKeyboard 
} from '../hooks/useKeyboard'
import {
  ModalContext,
} from '../state'
import PhoneLogin from '../components/PhoneLogin'

interface Props {
  colorScheme: string
}
const Authentication = ({ colorScheme }: Props) => {
  const {keyboardHeight, keyboardOpen} = useKeyboard()
  const [modalState, modalDispatch] = useContext(ModalContext)
  return (
    <SafeAreaView style={{
      height: '100%',
      width: '100%',
      backgroundColor: PlatformColor('systemGray6'),
      alignItems: 'center',

    }}>
      <View style={{
        marginTop: '60%',
        height: 210,
        justifyContent: 'space-evenly',
      }}>
        <Image 
          resizeMode="contain"
          resizeMethod="resize"
          style={{
            resizeMode: 'contain',
            height: 100,
            width: 100,
          }}
          source={require('../assets/images/logo-green.png')}
        />
        <Text style={{
          fontSize: 16,
          color: PlatformColor('systemGray'),
          fontStyle: 'italic'
        }}>What are you here for?</Text>
      </View>
      <View style={{
        position: 'absolute',
        bottom: keyboardHeight + 30,
        left: 'auto'
      }}>
        <PhoneLogin colorScheme={colorScheme} onPress={() => {
          modalDispatch({
            type: 'OPEN',
            modalType: 'GET_PHONE' 
          })
        }}
        />
      </View>
    </SafeAreaView>
  )
}

export default Authentication