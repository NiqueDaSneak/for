import React, { useContext, useState, useEffect } from 'react';
import {
  FlatList,
  PlatformColor,
  Pressable,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Alert,
  Switch,
  Image,
} from 'react-native';
import {
  DraxList,
  DraxProvider,
  DraxScrollView,
  DraxView,
} from 'react-native-drax';
import { AlignCategoriesContext } from '../state';
import { Text, View } from '../components/Themed';
import { useNavigation } from '@react-navigation/core';
import { useFonts } from '../hooks/useFonts';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

const CategoryFooter = ({ isCategorizeActive, setActiveCategory }) => {
  const [acState, acDispatch] = useContext(AlignCategoriesContext);

  const { categories } = acState;

  const navigation = useNavigation();

  const { fontTypes } = useFonts();

  const [controlIndex, setControlIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const colorScheme = useColorScheme();
  useEffect(() => {
    setActiveCategory(categories[selectedIndex]);
  }, [selectedIndex]);

  const styles = StyleSheet.create({
    confirmText: {
      fontSize: 30,
      marginRight: 10,
    },
    activeText: {
      color: colorScheme === 'dark' ? 'white' : PlatformColor('systemGray6'),
    },
    activeCategory: {
      backgroundColor: PlatformColor('systemGreen'),
    },
    container: {
      height: '24%',
    },
    scrollView: {
      width: '100%',
    },
    categoriesContainer: {
      width: 100,
      height: '80%',
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
      height: '40%',
    },
    categoryComponents: {
      height: '60%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContentContainer: {
      alignItems: 'center',
      marginLeft: 10,
      paddingRight: 10,
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
          backgroundColor={PlatformColor('systemGray6')}
          values={['View Only', 'Categorize']}
          selectedIndex={controlIndex}
          onChange={(event) => {
            console.log('selectedIndex: ', controlIndex);
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
                { text: 'Cancel', style: 'destructive' },
                {
                  text: 'Save',
                  onPress: (text) => acDispatch({ type: 'NEW_CATEGORY', text }),
                },
              ]
            );
          }}
        >
          <View style={styles.categoriesContainer}>
            <Text style={styles.text}>+</Text>
          </View>
        </Pressable>
        <ScrollView
          horizontal
          contentContainerStyle={styles.scrollContentContainer}
          style={styles.scrollView}
        >
          {categories.map((category, index) => (
            <React.Fragment key={index}>
              {controlIndex === 0 && (
                <Pressable
                  onPress={() => {
                    return navigation.navigate('CategoryScreen', {
                      routeTitle: category.title,
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
                  onPress={() => {
                    setSelectedIndex(index);
                  }}
                >
                  {selectedIndex === index ? (
                    <View
                      style={[
                        styles.categoriesContainer,
                        selectedIndex === index ? styles.activeCategory : null,
                      ]}
                    >
                      <Text
                        style={[
                          styles.text,
                          styles.activeText,
                          acState.stage.thoughts.length > 0
                            ? styles.confirmText
                            : null,
                        ]}
                      >
                        {acState.stage.thoughts.length === 0
                          ? category.title
                          : `+${acState.stage.thoughts.length}`}
                      </Text>
                      {acState.stage.thoughts.length > 0 && (
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
                    </View>
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
