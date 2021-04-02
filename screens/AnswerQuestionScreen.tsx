import React, { useEffect, useState, useRef } from 'react'
import { Button, PlatformColor, Pressable, TextInput, useColorScheme } from 'react-native'
import { Text, View } from '../components/Themed'
import { useFonts } from '../hooks/useFonts'
import { useKeyboard } from '../hooks/useKeyboard'

const AnswerQuestionScreen = ({ navigation, route }) => {
  const {fontTypes} = useFonts()
  const colorScheme = useColorScheme()

  const { questionText } = route.params
  
  const [questionResponse, setQuestionResponse] = useState('Respond Here...')
  const { keyboardHeight } = useKeyboard()
  const inputRef = useRef(null)
  useEffect(() => {
    inputRef.current.focus()
    navigation.setOptions({
      title: `Answer the question`,
      headerRight: () => (
        // <Pressable>
        //   <Text >+</Text>

        // </Pressable>
        <Button style={{marginRight: '4%', }} title='Save' />
      )
    })
  }, [])
  return (
    <View
    lightColor='#f5f5f5'
    darkColor={PlatformColor('systemGray6')}
      style={{
      height: '100%'
    }}>
      <View style={{
        paddingTop: '4%',
        paddingBottom: '4%',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={[fontTypes.heading, {fontWeight: 'normal', width: '90%'}]}>{questionText}</Text>
      </View>
      {/* NEED TO SET UP KEYBOARD FOR THE BELOW */}
      <TextInput
        ref={inputRef}
        style={{
        width: '100%', 
        // height: '100%', 
          // position: 'absolute',
          // bottom: keyboardHeight,
        // backgroundColor: 'purple', 
        color: colorScheme === 'dark' ? PlatformColor('systemGray') : PlatformColor('systemGray6'),
        paddingLeft: '4%', 
        paddingBottom: '100%', 
        fontSize: 16
      }}
        multiline
        numberOfLines={4}
        onFocus={() => setQuestionResponse('')}
        onChangeText={text => setQuestionResponse(text)}
        value={questionResponse}
      />
    </View>
  )
}

export default AnswerQuestionScreen