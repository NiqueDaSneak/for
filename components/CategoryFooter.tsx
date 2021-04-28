import React, { useContext, useState, useEffect } from 'react';
import {
  PlatformColor,
  Pressable,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Alert,
  Image,
  View as ContainerView,
  Animated,
} from 'react-native';
import { AlignCategoriesContext } from '../state';
import { Text, View } from '../components/Themed';
import { useNavigation } from '@react-navigation/core';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import * as Haptics from 'expo-haptics';
import { useFonts } from '../hooks/useFonts';
import { Category } from '../state/align-categories.context';

type Props = {
  isCategorizeActive: (val: boolean) => void;
};
const CategoryFooter = ({ isCategorizeActive }: Props) => {
  const [acState, acDispatch] = useContext(AlignCategoriesContext);

  const { categories } = acState;
  const navigation = useNavigation();

  const [controlIndex, setControlIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const colorScheme = useColorScheme();

  const { fontTypes } = useFonts();

  useEffect(() => {
    if (confirmed) {
      setTimeout(() => {
        setConfirmed(false);
      }, 900);
    }
  }, [confirmed]);

  useEffect(() => {
    acDispatch({
      type: 'SET_ACTIVE_CATEGORY',
      payload: {
        category: categories[selectedIndex]?.id,
      },
    });
  }, [selectedIndex]);

  const [animation] = useState(new Animated.Value(0));

  const colorsInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FF3B30', '#34C759'],
  });
  const animatedStyle = {
    backgroundColor: colorsInterpolation,
  };

  const styles = StyleSheet.create({
    confirmText: {
      fontSize: 30,
      marginRight: 10,
    },
    activeText: {
      color: colorScheme === 'dark' ? 'white' : PlatformColor('systemGray6'),
    },
    activeCategory: {
      backgroundColor:
        confirming && acState.stage.thoughts.length > 0
          ? PlatformColor('systemRed')
          : PlatformColor('systemGreen'),
    },
    container: {
      height: '24%',
    },
    scrollView: {
      width: '100%',
    },
    categoriesContainer: {
      width: 100,
      minHeight: 75,
      padding: 10,
      marginRight: 10,
      marginLeft: 10,
      backgroundColor: PlatformColor('systemGray4'),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      flexDirection: 'row',
    },
    text: {
      fontSize: 12,
    },
    segmentedControl: {
      width: '90%',
      marginLeft: '5%',
    },
    segmentedControlContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      height: '30%',
    },
    categoryComponents: {
      height: '70%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContentContainer: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginLeft: 10,
      paddingRight: 10,
    },
    containerButton: {
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      height: '100%',
    },
  });

  return (
    <View style={styles.container}>
      <View
        darkColor={PlatformColor('systemGray5')}
        lightColor={PlatformColor('systemGray6')}
        style={styles.segmentedControlContainer}
      >
        <SegmentedControl
          style={styles.segmentedControl}
          backgroundColor={PlatformColor('systemGray5')}
          values={['View Only', 'Categorize']}
          selectedIndex={controlIndex}
          onChange={(event) => {
            if (acState.stage.activeCategory === '') {
              acDispatch({
                type: 'SET_ACTIVE_CATEGORY',
                payload: {
                  category: categories[selectedIndex]?.title,
                },
              });
            }
            setControlIndex(event.nativeEvent.selectedSegmentIndex);
            isCategorizeActive(controlIndex === 0);
          }}
        />
      </View>
      <View
        darkColor={PlatformColor('systemGray5')}
        lightColor={PlatformColor('systemGray6')}
        style={styles.categoryComponents}
      >
        <Pressable
          onPress={() => {
            Alert.prompt(
              'Give your new category a name:',
              'Here is some secondary text.',
              [
                {
                  text: 'Cancel',
                  style: 'destructive',
                },
                {
                  text: 'Save',
                  onPress: (text) =>
                    acDispatch({
                      type: 'NEW_CATEGORY',
                      payload: {
                        text: text,
                      },
                    }),
                },
              ]
            );
          }}
        >
          <View style={styles.categoriesContainer}>
            <Text style={[styles.text, fontTypes.heading]}>+</Text>
          </View>
        </Pressable>
        <ScrollView
          horizontal
          contentContainerStyle={styles.scrollContentContainer}
          style={styles.scrollView}
        >
          {categories.map((category:Category, index: number) => (
            <React.Fragment key={index}>
              {controlIndex === 0 && (
                <Pressable
                  onPress={() => {
                    return navigation.navigate('CategoryScreen', {
                      categoryId: category.id,
                    });
                  }}
                >
                  <View style={styles.categoriesContainer}>
                    <Text style={styles.text}>{category.title}</Text>
                  </View>
                </Pressable>
              )}
              {controlIndex === 1 && (
                <Pressable
                  delayLongPress={900}
                  onLongPress={() => {
                    if (
                      selectedIndex === index &&
                      acState.stage.thoughts.length > 0
                    ) {
                      setConfirmed(true);
                      acDispatch({ type: 'SUBMIT_STAGE' });
                      setControlIndex(0)
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                      isCategorizeActive(false);
                    }
                  }}
                  onPressIn={() => {
                    if (selectedIndex === index) {
                      setConfirming(true);
                      Animated.timing(animation, {
                        toValue: 1,
                        duration: 900,
                        useNativeDriver: false,
                      }).start();
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }}
                  onPressOut={() => {
                    if (selectedIndex === index) {
                      setConfirming(false);
                      Animated.timing(animation, {
                        toValue: 0,
                        duration: 900,
                        useNativeDriver: false,
                      }).reset();
                    }
                  }}
                  onPress={() => {
                    if (
                      acState.stage.thoughts.length >= 0 &&
                      selectedIndex !== index
                    ) {
                      setSelectedIndex(index);
                    }
                  }}
                >
                  {selectedIndex === index ? (
                    <ContainerView style={styles.containerButton}>
                      <Animated.View
                        style={[
                          styles.categoriesContainer,
                          selectedIndex === index
                            ? styles.activeCategory
                            : null,
                          confirming && acState.stage.thoughts.length > 0
                            ? { ...animatedStyle }
                            : null,
                        ]}
                      >
                        {!confirmed && (
                          <Text
                            style={[
                              styles.text,
                              styles.activeText,
                              acState.stage.thoughts.length > 0
                                ? styles.confirmText
                                : null,
                              confirming ? { fontSize: 40 } : null,
                            ]}
                          >
                            {acState.stage.thoughts.length === 0 && !confirming
                              ? category.title
                              : `+${acState.stage.thoughts.length}`}
                          </Text>
                        )}
                        {confirmed && (
                          <Image
                            resizeMode="contain"
                            resizeMethod="resize"
                            style={{
                              width: 22,
                              height: 22,
                            }}
                            source={require('../assets/images/white-check.png')}
                          />
                        )}
                      </Animated.View>
                    </ContainerView>
                  ) : (
                    <View
                      style={[
                        styles.categoriesContainer,
                        selectedIndex === index ? styles.activeCategory : null,
                      ]}
                    >
                      <Text style={styles.text}>{category.title}</Text>
                    </View>
                  )}
                </Pressable>
              )}
            </React.Fragment>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default CategoryFooter;
