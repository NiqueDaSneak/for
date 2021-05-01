import React, { useContext, useEffect, useCallback, useState } from 'react';
import {
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
import { OpportunitiesContext } from '../../state';
import OpportunityQuestions from '../../components/OpportunityQuestions';
import { getOpportunity, Opportunity } from '../../state/opportunities.context';
import { getThought } from '../../state/digital-thoughts.context';

const OpportunityScreen = ({ route }) => {
  const colorScheme = useColorScheme();
  const { showActionSheetWithOptions } = useActionSheet();
  const { opportunityId } = route.params;
  const [oState, oDispatch] = useContext(OpportunitiesContext);
  const [opportunity, setOpportunity] = useState<Opportunity>();
  const [thoughts, setThoughts] = useState([]);

  const updateOpportunity = useCallback(() => {
    getOpportunity(opportunityId).then((opportunity: Opportunity) => {
      setOpportunity(opportunity);
    });
  }, [getOpportunity, setOpportunity]);

  useEffect(() => {
    updateOpportunity();
  }, [updateOpportunity]);

  const getThoughts = useCallback(() => {
    opportunity?.thoughts.forEach((thoughtId) => {
      getThought(thoughtId).then((thought) => {
        setThoughts((arr) => [...arr, thought.data()]);
      });
    });
  }, [opportunity?.thoughts, getThought, setThoughts]);

  useEffect(() => {
    getThoughts();
  }, [getThoughts]);

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
        data={thoughts}
        renderItem={({ item: thought }) => <TextCard text={thought?.text} />}
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
          <OpportunityQuestions opportunityId={opportunity?.id} />
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
                  opportunityId: opportunity?.id,
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
