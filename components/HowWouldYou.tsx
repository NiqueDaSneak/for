import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  PlatformColor,
  StyleSheet,
  TextInput,
  useColorScheme,
} from 'react-native';
import { db } from '../firebase';
import { useFonts } from '../hooks/useFonts';
import { Question } from '../state/opportunities.context';
import { View, Text } from './Themed';

const HowWouldYou = ({ question }: { question: Question }) => {
  const { fontTypes, fontSizes } = useFonts();
  const colorScheme = useColorScheme();

  const [text, setText] = useState(question.input);
  const [saveInput, setSaveInput] = useState(false);

  useEffect(() => {
    if (saveInput) {
      try {
        db.collection('Questions').doc(question.id).update({ input: text });
      } catch (error) {
        console.log('err: ', error);
      } finally {
        setSaveInput(false);
      }
    }
  }, [saveInput, text]);

  const styles = StyleSheet.create({
    container: {
      paddingTop: '4%',
      width: '100%',
      paddingBottom: '10%',
    },
    input: {
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
    text: { marginLeft: '4%' },
  });

  return (
    <View
      lightColor="#f5f5f5"
      darkColor={PlatformColor('systemGray6')}
      style={styles.container}
    >
      <Text style={[fontTypes.subHeading, styles.text]}>
        How would you go about making this change?
      </Text>
      <TextInput
        multiline
        onChangeText={(text) => setText(text)}
        value={text}
        style={styles.input}
      />
      <Button title="Save Response" onPress={() => setSaveInput(true)} />
    </View>
  );
};

export default HowWouldYou;
