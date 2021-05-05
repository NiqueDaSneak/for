import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import {
  PlatformColor,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useKeyboard } from '../hooks/useKeyboard';
import {  Question } from '../state/opportunities.context';
import { Text } from './Themed';
import ToDoList from './ToDoList';
import HowWouldYou from './HowWouldYou';
import ZeroTo100 from './ZeroTo100';

const OpportunityQuestions = ({
  questions,
}: {
  opportunityId: string;
  questions: Question[];
}) => {
  const { keyboardHeight } = useKeyboard();

  const styles = StyleSheet.create({
    container: {
      paddingTop: '10%',
      height: '70%',
      width: '100%',
      alignItems: 'center',
    },
    instructions: {
      paddingTop: '10%',
      width: '80%',
    },
    scrollContainer: {
      width: '100%',
      paddingTop: '10%',
      paddingBottom: keyboardHeight > 0 ? '100%' : '30%',
      minHeight: '100%',
    },
  });
  return (
    <>
      {questions.length === 0 ? (
        <View style={styles.container}>
          <Image
            resizeMode="contain"
            resizeMethod="resize"
            style={{
              resizeMode: 'contain',
              height: 190,
              width: '100%',
            }}
            source={require('../assets/images/opportunity-explain.png')}
          />

          <Text style={styles.instructions}>
            Tap the button below to add question modules to your opportunity.
            Question modules allow you to refine this opportunity into something
            to reflect on or a goal.
          </Text>
        </View>
      ) : (
        <View lightColor="#f5f5f5" darkColor={PlatformColor('systemGray6')}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {questions
              .filter((q: Question) => q.questionType === 'BEST')
              .map((question: Question) => (
                <ToDoList key={question.id} question={question} />
              ))}

            {questions
              .filter((q: Question) => q.questionType === 'NOT_BEST')
              .map((question: Question) => (
                <ToDoList key={question.id} question={question} />
              ))}

            {questions
              .filter((q: Question) => q.questionType === 'COUNTER')
              .map((question) => (
                <ZeroTo100 key={question.id} question={question} />
              ))}

            {questions
              ?.filter((q: Question) => q.questionType === 'HOW_WOULD')
              .map((question) => (
                <HowWouldYou key={question.id} question={question} />
              ))}
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default OpportunityQuestions;
