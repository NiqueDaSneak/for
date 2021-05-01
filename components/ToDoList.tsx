import React, { useCallback, useEffect, useState } from 'react';
import {
  Keyboard,
  PlatformColor,
  Pressable,
  useColorScheme,
  View as ContainerView,
  StyleSheet,
  Image,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useFonts } from '../hooks/useFonts';
import { Question, updateToDoList } from '../state/opportunities.context';
import { Text } from './Themed';

const ToDoList = ({ question }: { question: Question }) => {
  const colorScheme = useColorScheme();
  const [reasonInput, setReasonInput] = useState('');
  const { fontTypes, fontSizes } = useFonts();

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
        question?.reasons?.length === 3 || reasonInput.length <= 5
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
      {question?.questionType === 'BEST' && (
        <Text style={[fontTypes.subHeading, styles.textStyle]}>
          The three best reasons to do it:
        </Text>
      )}
      {question?.questionType === 'NOT_BEST' && (
        <Text style={[fontTypes.subHeading, styles.textStyle]}>
          The three best reasons NOT to do it:
        </Text>
      )}
      <ContainerView style={styles.inputContainer}>
        <TextInput
          editable={question?.reasons?.length < 3}
          onChangeText={(text) => setReasonInput(text)}
          value={reasonInput}
          style={styles.input}
        />
        <Pressable
          disabled={question?.reasons?.length === 3 || reasonInput.length <= 5}
          onPress={() => {
            Keyboard.dismiss();
            updateToDoList(question?.id, reasonInput);
            setReasonInput('');
          }}
          style={styles.button}
        >
          {question?.reasons?.length === 3 || reasonInput.length <= 5 ? (
            <Text style={fontTypes.heading}>+</Text>
          ) : (
            <Image
              resizeMode="contain"
              resizeMethod="resize"
              style={{
                width: 22,
                height: 22,
              }}
              source={require('../assets/images/white-check.png')}
            />
          )}
        </Pressable>
      </ContainerView>
      {question?.reasons?.length > 0 && (
        <ContainerView style={styles.reason}>
          {question?.reasons?.map((reason: string) => (
            <Text key={reason} style={styles.reasonText}>{`-${reason}`}</Text>
          ))}
        </ContainerView>
      )}
    </ContainerView>
  );
};

export default ToDoList;
