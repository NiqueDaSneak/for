import React, { useEffect, useState } from 'react';
import Slider from '@react-native-community/slider';
import { Text } from './Themed';
import {
  Button,
  PlatformColor,
  StyleSheet,
  useColorScheme,
  View as ContainerView,
} from 'react-native';
import { useFonts } from '../hooks/useFonts';
import { TextInput } from 'react-native-gesture-handler';
import { Question } from '../state/opportunities.context';
import { db } from '../firebase';

const ZeroTo100 = ({ question }: { question: Question }) => {
  const colorScheme = useColorScheme();
  const { fontTypes, fontSizes } = useFonts();

  const [val, setVal] = useState(question.count);
  const [text, setText] = useState(question.input);
  const [saveVal, setSaveVal] = useState(false);
  const [saveInput, setSaveInput] = useState(false);

  useEffect(() => {
    if (saveInput) {
        try {
          db.collection('Questions').doc(question.id).update({ input: text });
        } catch (error) {
          console.log('err: ', error);
        } finally {
          setSaveVal(false);
        }

    }
  }, [saveInput, text]);

  useEffect(() => {
    if (saveVal) {
        try {
          db.collection('Questions').doc(question.id).update({ count: val });
        } catch (error) {
          console.log('err: ', error);
        } finally {
          setSaveVal(false);
        }

    }
  }, [saveVal]);

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
          value={val}
          onTouchEnd={(val) => {
            setSaveVal(true);
          }}
          onValueChange={(val) => {
            setVal(val);
          }}
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
          <Button title="Save Response" onPress={ () => setSaveInput(true)}/>
        </>
      )}
    </ContainerView>
  );
};

export default ZeroTo100;
