import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  Button,
  PlatformColor,
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme,
} from 'react-native';
import { Text, View } from '../../components/Themed';
import { db } from '../../firebase';
import { useFonts } from '../../hooks/useFonts';
import { useKeyboard } from '../../hooks/useKeyboard';
import { AuthContext } from '../../state';
import { DigitalThoughtsContext, Thought } from '../../state/digital-thoughts.context';
import { QuestionsContext } from '../../state/questions.context';

const AnswerQuestionScreen = ({ navigation, route }) => {
  const { fontTypes } = useFonts();
  const colorScheme = useColorScheme();

  const { questionData, answeredFrom } = route.params;

  const [questionResponse, setQuestionResponse] = useState('');
  const { keyboardHeight } = useKeyboard();
  const inputRef = useRef(null);
  const [authState, authDispatch] = useContext(AuthContext);

  const [dtState, dtDispatch] = useContext(DigitalThoughtsContext);
  const [qState, qDispatch] = useContext(QuestionsContext);

  const handleSave = () => {
    const processedResponse = questionResponse.split('. ').filter(Boolean);
    let responsesAsObjects: Thought[] = []; 
    processedResponse.forEach((thought) => { 
      db.collection('Thoughts').add({
        text: thought,
        withOpportunity: false,
        categorized: false,
        userId: authState.activeUser.id
      })
    })
    // dtDispatch({ type: 'CONSUME_ANSWER', payload: { questionResponse } });

    let answeredQuestionData = {
      ...questionData,
      answeredFrom: answeredFrom,
    };
    qDispatch({ type: 'ANSWERED', answeredQuestionData });
    navigation.goBack();
    setQuestionResponse('');
  };

  useEffect(() => {
    inputRef.current.focus();
    navigation.setOptions({
      title: `Answer the question`,
      headerRight: () => (
        <Button
          disabled={questionResponse.length < 14}
          onPress={() => handleSave()}
          title="Save"
        />
      ),
    });
  }, [questionResponse]);

  const styles = StyleSheet.create({
    pageContainer: {
      height: '100%',
    },
    questionContainer: {
      paddingTop: '4%',
      paddingBottom: '4%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    questionText: {
      fontWeight: 'normal',
      width: '90%',
    },
    textInput: {
      width: '100%',
      color: PlatformColor('systemGray'),
      paddingTop: '4%',
      paddingLeft: '4%',
      paddingRight: '4%',
      paddingBottom: '120%',
      fontSize: 16,
    },
  });

  return (
    <View
      lightColor="#f5f5f5"
      darkColor={PlatformColor('systemGray6')}
      style={styles.pageContainer}
    >
      <View
        lightColor={PlatformColor('systemGray')}
        style={styles.questionContainer}
      >
        <Text style={[fontTypes.heading, styles.questionText]}>
          {questionData.text}
        </Text>
      </View>
      <TextInput
        ref={inputRef}
        style={styles.textInput}
        multiline
        numberOfLines={4}
        onChangeText={(text) => setQuestionResponse(text)}
        value={questionResponse}
      />
    </View>
  );
};

export default AnswerQuestionScreen;
