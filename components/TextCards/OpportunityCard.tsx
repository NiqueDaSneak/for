import { useNavigation } from '@react-navigation/core';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  PlatformColor,
  Pressable,
  useColorScheme,
  View as ContainerView,
  Image,
  StyleSheet,
} from 'react-native';
import {
  OpportunitiesContext,
  Opportunity,
} from '../../state/opportunities.context';
import { Text } from '../Themed';
import { useActionSheet } from '@expo/react-native-action-sheet';

const OpportunityCard = ({
  opportunity,
  edit = false,
}: {
  opportunity: Opportunity;
  edit: boolean;
}) => {
  const navigation = useNavigation();

  const colorScheme = useColorScheme();

  const { showActionSheetWithOptions } = useActionSheet();
  const [oState, oDispatch] = useContext(OpportunitiesContext);
  const styles = StyleSheet.create({
    pressable: {
      borderRadius: 10,
      padding: '4%',
      backgroundColor:
        colorScheme === 'dark'
          ? PlatformColor('systemGray5')
          : PlatformColor('systemGray5'),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
      width: '70%',
      marginBottom: '6%',
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    image: {
      resizeMode: 'contain',
      height: '100%',
      width: '10%',
    },
    text: {
      width: '80%',
      height: '100%',
    },
  });

  const editOptionsHandler = () => {
    const options = ['Archive', 'Convert to goal', 'Cancel'];
    const action = [
      () => {
        oDispatch({ type: 'ARCHIVE', payload: { id: opportunity.id } });
        console.log('archive');
      },
      () => {
        console.log('convert');
      },
      () => {
        console.log('cancel');
      },
    ];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        title: 'What do you want to do with this opportunity?',
        message:
          'Go to the category this opportunity was created in to delete.',
      },
      (buttonIndex) => {
        action[buttonIndex]();
      }
    );
  };

  return (
    <Pressable
      key={opportunity?.title}
      onPress={() => {
        edit
          ? editOptionsHandler()
          : navigation.navigate('OpportunityScreen', {
              opportunityId: opportunity.id,
            });
      }}
      style={styles.pressable}
    >
      <ContainerView style={styles.container}>
        <Image
          resizeMode="contain"
          resizeMethod="resize"
          style={styles.image}
          source={require('../../assets/images/star.png')}
        />
        <Text style={styles.text}>{opportunity?.title}</Text>
      </ContainerView>
    </Pressable>
  );
};

export default OpportunityCard;
