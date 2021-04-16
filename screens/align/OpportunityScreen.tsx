import React, { useContext } from 'react';
import {
  Image,
  PlatformColor,
  Pressable,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import TextCard from '../../components/TextCard';
import { View, Text } from '../../components/Themed';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { OpportunitiesContext } from '../../state';
import OpportunityQuestions from '../../components/OpportunityQuestions';
import { useKeyboard } from '../../hooks/useKeyboard';
import { Opportunity } from '../../state/opportunities.context';

const OpportunityScreen = ({ route }) => {
  const colorScheme = useColorScheme();
  const { showActionSheetWithOptions } = useActionSheet();
  const { title } = route.params;
  const [oState, oDispatch] = useContext(OpportunitiesContext);
  const opportunity = oState.opportunities.filter(
    (opp: Opportunity) => opp.title === title
  )[0];

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
      backgroundColor:
        colorScheme === 'dark' ? PlatformColor('systemGray6') : '#f8fbf8',
    },
    oppContainer: {
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
  });

  return (
    <View
      lightColor="#f5f5f5"
      darkColor={String(PlatformColor('systemGray6'))}
      style={styles.container}
    >
      <FlatList
        keyExtractor={(item) => item.text}
        data={opportunity?.thoughts}
        renderItem={({ item: thought }) => <TextCard text={thought.text} />}
        contentContainerStyle={styles.oppContainer}
      />
      {opportunity?.questions?.length === 0 ? (
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
          darkColor={String(PlatformColor('systemGray6'))}
          style={styles.oppQuestionsContainer}
        >
          <OpportunityQuestions questions={opportunity?.questions} />
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
          const actions = ['DELETE', 'BEST', 'NOT_BEST', 'COUNTER', 'HOW'];

          const destructiveButtonIndex = 0;
          const cancelButtonIndex = 5;

          showActionSheetWithOptions(
            {
              options,
              cancelButtonIndex,
              destructiveButtonIndex,
            },
            (buttonIndex) => {
              oDispatch({
                type: 'ADD_QUESTION',
                payload: {
                  questionType: actions[buttonIndex],
                  opportunityTitle: opportunity?.title,
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
