import React, { useContext, useState } from 'react';
import {
  FlatList,
  PlatformColor,
  Pressable,
  StyleSheet,
  useColorScheme,
  ScrollView,
} from 'react-native';

import { Text, View } from '../../components/Themed';
import { AlignCategoriesContext, DigitalThoughtsContext } from '../../state/';
import DraggableTextCard from '../../components/DraggableTextCard';
import {
  DraxList,
  DraxProvider,
  DraxScrollView,
  DraxView,
} from 'react-native-drax';
import { useKeyboard } from '../../hooks/useKeyboard';
import CategoryFooter from '../../components/CategoryFooter';

export default function AlignScreen() {
  const [dtState, dtDispatch] = useContext(DigitalThoughtsContext);
  const { responses } = dtState;
  const colorScheme = useColorScheme();

  const { keyboardHeight } = useKeyboard();

  const styles = StyleSheet.create({
    pageContainer: {
      height: '15%',
      width: '100%',
      backgroundColor:
        colorScheme === 'dark'
          ? PlatformColor('systemGray4')
          : PlatformColor('systemGray4'),
    },
    createThought: {
      borderRadius: 10,
      padding: '6%',
      backgroundColor:
        colorScheme === 'dark' ? PlatformColor('systemGray5') : '#f8fbf8',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
      width: '44%',
      marginLeft: '30%',
      marginTop: '5%',
      marginBottom: '5%',
    },
    mainContainer: {
      height: '70%',
      width: '100%',
    },
    responsesContentContainer: {
      marginTop: '10%',
    },
  });

  return (
    <DraxProvider>
      <View style={styles.pageContainer}>
        <Pressable
          onPress={() => console.log('create thought')}
          style={styles.createThought}
        >
          <Text>+ Create Thought</Text>
        </Pressable>
      </View>
      <View
        lightColor="#f5f5f5"
        darkColor={PlatformColor('systemGray6')}
        style={styles.mainContainer}
      >
        <DraxList
          data={responses}
          contentContainerStyle={styles.responsesContentContainer}
          renderItemContent={({ item }, { viewState, hover }) => {
            return <DraggableTextCard text={item} />;
          }}
          keyExtractor={(item, index) => `${item}`}
        />
      </View>
      <CategoryFooter />
    </DraxProvider>
  );
}
