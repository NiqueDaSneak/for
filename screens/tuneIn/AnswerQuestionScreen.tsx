import React, { useEffect, useState, useRef, useContext } from 'react'
import { Button, PlatformColor, Pressable, TextInput, useColorScheme } from 'react-native'
import { Text, View } from '../../components/Themed'
import { useFonts } from '../../hooks/useFonts'
import { useKeyboard } from '../../hooks/useKeyboard'
import { DigitalThoughtsContext } from '../../state/digital-thoughts.context'

const AnswerQuestionScreen = ({ navigation, route }) => {
  const {fontTypes} = useFonts()
  const colorScheme = useColorScheme()

  const { questionText } = route.params
  
  const [questionResponse, setQuestionResponse] = useState('')
  const { keyboardHeight } = useKeyboard()
  const inputRef = useRef(null)

  const [dtState, dtDispatch] = useContext(DigitalThoughtsContext)

  const handleSave = () => {
    if (questionResponse.length > 14) {
      
    }
      dtDispatch({ type: 'CONSUME_ANSWER', questionResponse })
      navigation.navigate('Align')
  }

  useEffect(() => {
    inputRef.current.focus()
    navigation.setOptions({
      title: `Answer the question`,
      headerRight: () => (
        <Button
          disabled={questionResponse.length < 14}
          onPress={() => handleSave()}
          title='Save' />
      )
    })
  }, [questionResponse])

  return (
    <View
    lightColor='#f5f5f5'
    darkColor={PlatformColor('systemGray6')}
    style={{
      height: '100%'
    }}>
      <View
        lightColor={PlatformColor('systemGray')}
        style={{
        paddingTop: '4%',
        paddingBottom: '4%',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={[fontTypes.heading, {fontWeight: 'normal', width: '90%'}]}>{questionText}</Text>
      </View>
      <TextInput
        ref={inputRef}
        style={{
          width: '100%', 
          color: PlatformColor('systemGray'),
          paddingTop: '4%', 
          paddingLeft: '4%',
          paddingRight: '4%', 
          paddingBottom: '120%', 
          fontSize: 16
        }}
        multiline
        numberOfLines={4}
        onChangeText={text => setQuestionResponse(text)}
        value={questionResponse}
      />
    </View>
  )
}

export default AnswerQuestionScreen