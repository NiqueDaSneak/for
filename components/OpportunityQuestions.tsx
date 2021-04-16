import React, { useState } from 'react';
import { View } from 'react-native';
import {
  PlatformColor,
  useColorScheme,
  View as ContainerView,
} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { useFonts } from '../hooks/useFonts';
import { useKeyboard } from '../hooks/useKeyboard';
import { Question } from '../state/opportunities.context';
import TextCard from './TextCard';
import { Text } from './Themed';
import ToDoList from './ToDoList';
import HowWouldYou from './HowWouldYou';
import ZeroTo100 from './ZeroTo100';

const OpportunityQuestions = ({ questions }: { questions: Question[] }) => {
  const colorScheme = useColorScheme();
  console.log('questions: ', questions);
  const [text, setText] = useState('');
  const { fontTypes, fontSizes } = useFonts();
  const { keyboardHeight } = useKeyboard();
  return (
    <ScrollView>
      {questions?.filter((q) => q.questionType === 'BEST_TO_DO')
        .map((question) => (
          <ToDoList questionData={question} />
        ))}

      {questions?.filter((q) => q.questionType === 'BEST_NOT_TO_DO')
        .map((question) => (
          <ToDoList questionData={question} />
        ))}

      {questions?.filter((q) => q.questionType === 'COUNTER')
        .map((question) => (
          <ZeroTo100/>
        ))}

      {questions?.filter((q) => q.questionType === 'HOW_WOULD')
        .map((question) => (
          <HowWouldYou />
        ))}
    </ScrollView>
  );
};

export default OpportunityQuestions;
