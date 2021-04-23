import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  PlatformColor,
  Pressable,
  StyleSheet,
  useColorScheme,
  Animated,
} from 'react-native';
import { AlignCategoriesContext } from '../state';
import { Text, View } from './Themed';
import * as Haptics from 'expo-haptics';
import { DraxView } from 'react-native-drax';
import type { Thought } from '../state/align-categories.context';
import { Easing } from 'react-native-reanimated';

const TextCard = ({ text }: { text: string }) => {
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    cardContainer: {
      minWidth: 210,
      borderRadius: 10,
      padding: '6%',
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
      maxWidth: '70%',
      marginBottom: '6%',
      minHeight: 66,
    },
  });

  return (
    <View style={[styles.cardContainer]}>
      <Text>{text}</Text>
    </View>
  );
};

export const DraggableTextCard = ({
  text,
  receivingStyle,
  payload,
  onDragStart,
  onReceiveDragDrop,
}) => {
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    cardContainer: {
      borderRadius: 10,
      padding: '6%',
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
  });

  return (
    <DraxView
      receivingStyle={receivingStyle}
      payload={payload}
      onDragStart={onDragStart}
      onReceiveDragDrop={onReceiveDragDrop}
      style={styles.cardContainer}
    >
      <Text>{text}</Text>
    </DraxView>
  );
};

export const ToggleTextCard = ({
  thought,
  isCategorizeActive,
  activeCategory,
}: {
  thought: Thought;
  isCategorizeActive: boolean;
  activeCategory: string;
}) => {
  const colorScheme = useColorScheme();

  const [isChecked, setIsChecked] = useState(false);

  const [acState, acDispatch] = useContext(AlignCategoriesContext);
  const styles = StyleSheet.create({
    container: {
      marginBottom: '10%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: '12%',
      paddingRight: '12%',
      justifyContent: isCategorizeActive ? 'space-between' : 'center',
    },
    cardContainer: {
      borderRadius: 10,
      padding: '6%',
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
    },
  });

  const getIcon = () => {
    return isChecked
      ? require('../assets/images/checked.png')
      : require('../assets/images/unchecked.png');
  };

  const scaleRef = new Animated.Value(0);

  useEffect(() => {
    if (isCategorizeActive) {
      Animated.timing(scaleRef, {
        delay: Math.floor(Math.random() * 200),
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }
  }, [isCategorizeActive]);

  return (
    <View
      lightColor="#f8fbf8"
      darkColor={String(PlatformColor('systemGray6'))}
      style={styles.container}
    >
      {isCategorizeActive && (
        <Pressable
          onPress={() => {
            if (isChecked) {
              console.log('unstage: ', acState.stage)
              acDispatch({
                type: 'UNSTAGE_ITEM',
                payload: {
                  toBeUnstaged: thought,
                },
              });
              console.log('unstaged??? ', acState.stage)

            } else {
              acState.stage.thoughts === 0
                ? acDispatch({
                    type: 'NEW_STAGE',
                    payload: {
                      toBeStaged: thought,
                      category: activeCategory,
                    },
                  })
                : acDispatch({
                    type: 'STAGE_ITEM',
                    payload: {
                      toBeStaged: thought,
                    },
                  });
            }
            setIsChecked(!isChecked);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Animated.Image
            resizeMode="contain"
            resizeMethod="resize"
            style={{
              width: 40,
              height: 40,
              transform: [{ scale: scaleRef }],
            }}
            source={getIcon()}
          />
        </Pressable>
      )}
      <TextCard text={thought.text} />
    </View>
  );
};

export default TextCard;
