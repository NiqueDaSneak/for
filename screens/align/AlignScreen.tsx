import React, { useContext, useEffect, useState } from 'react';
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
import { ToggleTextCard } from '../../components/TextCard';
import { useKeyboard } from '../../hooks/useKeyboard';
import CategoryFooter from '../../components/CategoryFooter';

export default function AlignScreen() {
  const [dtState, dtDispatch] = useContext(DigitalThoughtsContext);
  const { responses, newResponses } = dtState;
  const colorScheme = useColorScheme();

  const { keyboardHeight } = useKeyboard();

  const [isCategorizeActive, setIsCategorizeActive] = useState(false);
  const [acState, acDispatch] = useContext(AlignCategoriesContext);
  const { activeCategory } = acState.stage;

  const styles = StyleSheet.create({
    createThoughtButtonContainer: {
      height: '12%',
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
      height: '76%',
      width: '100%',
      backgroundColor:
        colorScheme === 'dark' ? PlatformColor('systemGray6') : '#f8fbf8',
    },
    responsesContentContainer: {
      marginTop: '10%',
      paddingBottom: '10%',
    },
  });

  useEffect(() => {
    if (newResponses) {
      dtDispatch({ type: 'NEW_SEEN' });
    }
  }, []);

  return (
    <>
      <View
        lightColor="#f5f5f5"
        darkColor={PlatformColor('systemGray6').toString()}
        style={styles.mainContainer}
      >
        <FlatList
          data={responses}
          contentContainerStyle={styles.responsesContentContainer}
          renderItem={({ item, index }) => {
            return (
              <ToggleTextCard
                activeCategory={activeCategory}
                isCategorizeActive={isCategorizeActive}
                text={item}
              />
            );
          }}
          keyExtractor={(item, index) => `${item}`}
        />
      </View>
      <CategoryFooter
        isCategorizeActive={(val) => setIsCategorizeActive(val)}
      />
    </>
  );
}
