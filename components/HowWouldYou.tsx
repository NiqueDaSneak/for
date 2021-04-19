import React, { useState, useRef } from 'react';
import { PlatformColor, TextInput, useColorScheme } from 'react-native';
import { useFonts } from '../hooks/useFonts';
import { useKeyboard } from '../hooks/useKeyboard';
import { View, Text } from './Themed';
const HowWouldYou = () => {
  const { keyboardHeight } = useKeyboard();
  const { fontTypes, fontSizes } = useFonts();
  const [text, setText] = useState('');
  const colorScheme = useColorScheme();
  const ref = useRef({ isFocused: () => false });
  return (
    <View
      lightColor="#f5f5f5"
      darkColor={String(PlatformColor('systemGray6'))}
      style={{
        paddingTop: '4%',
        width: '100%',
        bottom:
          ref.current.isFocused() && keyboardHeight !== 0
            ? keyboardHeight - 90
            : null,
        paddingBottom: '10%',
      }}
    >
      <Text style={[fontTypes.subHeading, { marginLeft: '4%' }]}>
        How would you go about making this change?
      </Text>
      <TextInput
        ref={ref}
        multiline
        onChangeText={(text) => setText(text)}
        value={text}
        style={{
          marginTop: '4%',
          borderRadius: 10,
          fontSize: fontSizes.medium,
          borderColor:
            colorScheme === 'dark'
              ? PlatformColor('systemGray')
              : PlatformColor('systemGray'),
          borderWidth: 1,
          width: '90%',
          marginLeft: '5%',
          height: 180,
          padding: '2%',
          color:
            colorScheme === 'dark'
              ? PlatformColor('systemGray')
              : PlatformColor('systemGray'),
        }}
      />
    </View>
  );
};

export default HowWouldYou;
