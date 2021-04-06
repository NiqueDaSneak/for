import React, { useContext, useState } from 'react';
import {
  FlatList,
  PlatformColor,
  Pressable,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Alert,
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

const CategoryFooter = () => {
  const [acState, acDispatch] = useContext(AlignCategoriesContext);
  const { categories } = acState;

  const navigation = useNavigation();
  return (
    <ScrollView
      horizontal
      contentContainerStyle={{ padding: '2%' }}
      style={{
        width: '100%',
        backgroundColor: PlatformColor('systemGray6'),
      }}
    >
      {/* BELOW ARE THE ALIGN-CATEGORIES, PRECREATED BUT CAN ADD CUSTOM */}
      {[{ title: '+' }, ...categories].map((category, index) => (
        <Pressable
          key={category.title}
          onPress={() => {
            const getCategoryName = () => {
              return Alert.prompt(
                'Give your new category a name:',
                'Here is some secondary text.',
                [
                  { text: 'Cancel', style: 'destructive' },
                  {
                    text: 'Save',
                    onPress: (text) => console.log(`save category ${text}`),
                  },
                ]
              );
            };

            const navigateToCategory = () => {
              navigation.navigate('CategoryScreen', {
                routeTitle: category.title,
              });
              return console.log(`go to category ${category.title}`);
            };
            index === 0 ? getCategoryName() : navigateToCategory();
          }}
        >
          <DraxView
            style={{
              width: 130,
              padding: 10,
              height: 100,
              marginRight: 10,
              backgroundColor: PlatformColor('systemGray4'),
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            }}
            onReceiveDragEnter={({ dragged: { payload } }) => {
              console.log(`hello ${payload}`);
            }}
            onReceiveDragExit={({ dragged: { payload } }) => {
              console.log(`goodbye ${payload}`);
            }}
            onReceiveDragDrop={({ dragged: { payload } }) => {
              console.log(`received ${payload}`);
              console.log('end drag');
              // add text object to category??

              //  setScrollStatus(true)
            }}
          >
            <Text>{category.title}</Text>
          </DraxView>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default CategoryFooter;
