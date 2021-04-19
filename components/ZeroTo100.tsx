import React, { useState } from 'react';
import Slider from '@react-native-community/slider';
import { Text } from './Themed';
import {
  PlatformColor,
  StyleSheet,
  useColorScheme,
  View as ContainerView,
} from 'react-native';
import { useFonts } from '../hooks/useFonts';
import { TextInput } from 'react-native-gesture-handler';

const ZeroTo100 = () => {
  const [val, setVal] = useState(0);
  const colorScheme = useColorScheme();
  const { fontTypes, fontSizes } = useFonts();
  const [text, setText] = useState('');

  const styles = StyleSheet.create({
    container: {
      marginLeft: '5%',
      width: '90%',
    },
    sliderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    slider: {
      height: 40,
      width: '90%',
    },
    textInput: {
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
    },
  });
  return (
    <ContainerView style={styles.container}>
      <Text style={fontTypes.subHeading}>
        On a scale from 0 - 100, how important is making this change?
      </Text>
      <ContainerView style={styles.sliderContainer}>
        <Slider
          onValueChange={(val) => setVal(val)}
          step={1}
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          minimumTrackTintColor={
            colorScheme === 'dark'
              ? String(PlatformColor('systemGray3'))
              : String(PlatformColor('systemGray'))
          }
          maximumTrackTintColor={
            colorScheme === 'dark'
              ? String(PlatformColor('systemGray'))
              : String(PlatformColor('systemGray3'))
          }
        />
        <Text style={fontTypes.subHeading}>{val}</Text>
      </ContainerView>
      {val > 0 && (
        <>
          <Text style={[fontTypes.subHeading, { marginLeft: '4%' }]}>
            Why are you at this number and not zero?
          </Text>
          <TextInput
            multiline
            onChangeText={(text) => setText(text)}
            value={text}
            style={styles.textInput}
          />
        </>
      )}
    </ContainerView>
  );
};

export default ZeroTo100;
