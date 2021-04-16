import React, { useState } from 'react';
import {
  Keyboard,
  PlatformColor,
  Pressable,
  useColorScheme,
  View as ContainerView,
  StyleSheet,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useFonts } from '../hooks/useFonts';
import { Question } from '../state/opportunities.context';
import { Text } from './Themed';

const ToDoList = ({ questionData }: { questionData: Question }) => {
  const colorScheme = useColorScheme();
  const [reasonInput, setReasonInput] = useState('');
  const { fontTypes, fontSizes } = useFonts();

  const [reasons, setReasons] = useState([]);

  const styles = StyleSheet.create({
    container: {
      paddingTop: '4%',
      marginBottom: '4%',
    },
    textStyle: { marginLeft: '4%' },
    inputContainer: {
      width: '90%',
      marginLeft: '5%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: '4%',
    },
    input: {
      borderRadius: 10,
      fontSize: fontSizes.medium,
      borderColor:
        colorScheme === 'dark'
          ? PlatformColor('systemGray')
          : PlatformColor('systemGray'),
      borderWidth: 1,
      paddingLeft: '2%',
      width: '80%',
      padding: '2%',
      color:
        colorScheme === 'dark'
          ? PlatformColor('systemGray')
          : PlatformColor('systemGray'),
    },
    button: {
      backgroundColor:
        reasons.length === 3 || reasonInput.length <= 5
          ? PlatformColor('systemRed')
          : '#378C21',
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
    },
    reason: {
      alignItems: 'center',
      paddingTop: '4%',
    },
    reasonText: {
      fontSize: 16,
      width: '80%',
      marginBottom: '4%',
    },
  });
  return (
    <ContainerView style={styles.container}>
      {questionData.questionType === 'BEST_TO_DO' && (
        <Text style={[fontTypes.subHeading, styles.textStyle]}>
          The three best reasons to do it:
        </Text>
      )}
      {questionData.questionType === 'BEST_NOT_TO_DO' && (
        <Text style={[fontTypes.subHeading, styles.textStyle]}>
          The three best reasons NOT to do it:
        </Text>
      )}
      <ContainerView style={styles.inputContainer}>
        <TextInput
          editable={reasons.length < 3}
          onChangeText={(text) => setReasonInput(text)}
          value={reasonInput}
          style={styles.input}
        />
        <Pressable
          disabled={reasons.length === 3 || reasonInput.length <= 5}
          onPress={() => {
            Keyboard.dismiss();
            setReasonInput('');
            setReasons([...reasons, reasonInput]);
          }}
          style={styles.button}
        >
          <Text style={fontTypes.heading}>+</Text>
        </Pressable>
      </ContainerView>
      {reasons.length > 0 && (
        <ContainerView style={styles.reason}>
          {reasons.map((reason) => (
            <Text style={styles.reasonText}>{`-${reason}`}</Text>
          ))}
        </ContainerView>
      )}
    </ContainerView>
  );
};

export default ToDoList;
