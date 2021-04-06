import React, {useContext, useState} from 'react';
import { FlatList, PlatformColor, Pressable, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { DraxList, DraxProvider, DraxScrollView, DraxView } from 'react-native-drax';
import { AlignCategoriesContext } from '../state'
import { Text, View } from '../components/Themed';

const CategoryFooter = () => {
  const [acState, acDispatch]  = useContext(AlignCategoriesContext)
  const { categories } = acState

  return (
<ScrollView
horizontal
contentContainerStyle={{padding: '2%',
}}
style={{
  width: '100%',
  backgroundColor: PlatformColor('systemGray6'),
}}>
{/* BELOW ARE THE ALIGN-CATEGORIES, PRECREATED BUT CAN ADD CUSTOM */}
      {[{ title: '+' }, ...categories].map((category, index) => (
        <Pressable onPress={() =>
          index === 0 ? console.log(`create new category`) : console.log(`go to category ${category.title}`)
        }>
  <DraxView
    key={category.title}
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
  )
}

export default CategoryFooter