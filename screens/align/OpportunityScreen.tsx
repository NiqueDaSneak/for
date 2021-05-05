import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  PlatformColor,
  Pressable,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import TextCard from '../../components/TextCards/TextCard';
import { View, Text } from '../../components/Themed';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { AuthContext, OpportunitiesContext } from '../../state';
import OpportunityQuestions from '../../components/OpportunityQuestions';
import { Question } from '../../state/opportunities.context';
import firebase, { db } from '../../firebase';
import useFirestoreQuery from '../../hooks/useFirestoreQuery';

const OpportunityScreen = ({ route }) => {
  const colorScheme = useColorScheme();
  const { showActionSheetWithOptions } = useActionSheet();
  const [authState] = useContext(AuthContext);
  const [, oDispatch] = useContext(OpportunitiesContext);

  const { opportunityId, thoughtIds } = route.params;

  const [currentQuestions, setCurrentQuestions] = useState([]);

  const thoughtsRef =
    thoughtIds.length > 0
      ? db
          .collection('Thoughts')
          .where(firebase.firestore.FieldPath.documentId(), 'in', thoughtIds)
      : db
          .collection('Thoughts')
          .where(firebase.firestore.FieldPath.documentId(), 'in', ['sample']);

  const { data: thoughtsData } = useFirestoreQuery(thoughtsRef);

  const questionsRef = db
    .collection('Questions')
    .where('userId', '==', authState.activeUser.id);
  const {
    isLoading: loadingQuestions,
    data: questionsData,
  } = useFirestoreQuery(questionsRef);

  useEffect(() => {
    if (!loadingQuestions && questionsData) {
      setCurrentQuestions(
        questionsData?.docs
          .filter((q) => q.data().opportunityId === opportunityId)
          .map((q) => {
            return {
              id: q.id,
              ...q.data(),
            };
          })
      );
    }
  }, [questionsData, loadingQuestions, setCurrentQuestions]);

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
      backgroundColor:
        colorScheme === 'dark' ? PlatformColor('systemGray6') : '#f8fbf8',
    },
    thoughtsContainer: {
      width: '100%',
      alignItems: 'center',
      paddingTop: '4%',
      backgroundColor: PlatformColor('systemGray4'),
    },
    opportunity: {
      paddingTop: '10%',
      height: '70%',
      width: '100%',
      alignItems: 'center',
    },
    introText: {
      paddingTop: '10%',
      width: '80%',
    },
    oppQuestionsContainer: {
      height: '70%',
      width: '100%',
    },
    actionButton: {
      backgroundColor: '#378C21',
      width: 80,
      height: 80,
      position: 'absolute',
      right: '4%',
      bottom: '4%',
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    flatList: { height: '30%' },
  });

  return (
    <View
      lightColor="#f5f5f5"
      darkColor={PlatformColor('systemGray6')}
      style={styles.container}
    >
      <FlatList
        style={styles.flatList}
        keyExtractor={(item) => item.data().text}
        data={thoughtsData?.docs}
        renderItem={({ item: thought }) => (
          <TextCard text={thought?.data().text} />
        )}
        contentContainerStyle={styles.thoughtsContainer}
      />
      {currentQuestions.length === 0 ? (
        <View style={styles.opportunity}>
          <Image
            resizeMode="contain"
            resizeMethod="resize"
            style={{
              resizeMode: 'contain',
              height: 190,
              width: '100%',
            }}
            source={require('../../assets/images/opportunity-explain.png')}
          />

          <Text style={styles.introText}>
            Tap the button below to add question modules to your opportunity.
            Question modules allow you to refine this opportunity into something
            to reflect on or a goal.
          </Text>
        </View>
      ) : (
        <View
          lightColor="#f5f5f5"
          darkColor={PlatformColor('systemGray6')}
          style={styles.oppQuestionsContainer}
        >
          <OpportunityQuestions
            opportunityId={opportunityId}
            questions={currentQuestions.map((question: Question) => {
              return {
                id: question.id,
                ...question,
              };
            })}
          />
        </View>
      )}
      <Pressable
        onPress={() => {
          const options = [
            'Delete Opportunity',
            'Three best reasons to do',
            'Three best reasons to NOT do',
            '0-100',
            'How would you go about...',
            'Cancel',
          ];
          const actions = [
            'DELETE',
            'BEST',
            'NOT_BEST',
            'COUNTER',
            'HOW_WOULD',
          ];

          const destructiveButtonIndex = 0;
          const cancelButtonIndex = 5;

          showActionSheetWithOptions(
            {
              options,
              cancelButtonIndex,
              destructiveButtonIndex,
            },
            (buttonIndex) => {
              currentQuestions.filter(
                (q: Question) => q.questionType === actions[buttonIndex]
              ).length > 0
                ? Alert.alert('You have already selected this question.')
                : oDispatch({
                    type: 'ADD_QUESTION',
                    payload: {
                      questionType: actions[buttonIndex],
                      opportunityId: opportunityId,
                    },
                  });
            }
          );
        }}
        style={styles.actionButton}
      >
        <Image
          resizeMode="contain"
          resizeMethod="resize"
          style={{
            resizeMode: 'contain',
            height: 40,
            width: 40,
          }}
          source={
            colorScheme === 'dark'
              ? require('../../assets/images/check-list-dark.png')
              : require('../../assets/images/check-list-light.png')
          }
        />
      </Pressable>
    </View>
  );
};

export default OpportunityScreen;
