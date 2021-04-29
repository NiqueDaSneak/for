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
import { Opportunity } from '../../state/opportunities.context';
import { Text } from '../Themed';

const OpportunityCard = ({ opportunity }: { opportunity: Opportunity }) => {
  const navigation = useNavigation();

  const colorScheme = useColorScheme();

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

  return (
    <Pressable
      key={opportunity?.title}
      onPress={() =>
        navigation.navigate('OpportunityScreen', {
          opportunityId: opportunity.id,
        })
      }
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
