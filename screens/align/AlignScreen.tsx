import React, {useContext, useState} from 'react';
import { FlatList, PlatformColor, Pressable, StyleSheet, useColorScheme, ScrollView } from 'react-native';

import { Text, View } from '../../components/Themed';
import { AlignCategoriesContext, DigitalThoughtsContext } from '../../state/';
import DraggableTextCard from '../../components/DraggableTextCard'
import { DraxList, DraxProvider, DraxScrollView, DraxView } from 'react-native-drax';
import { useKeyboard } from '../../hooks/useKeyboard';
import CategoryFooter from '../../components/CategoryFooter';

export default function AlignScreen() {
  const [dtState, dtDispatch] = useContext(DigitalThoughtsContext)
  const { responses } = dtState
  const colorScheme = useColorScheme()
  
  const { keyboardHeight } = useKeyboard()
  
  return (
    <DraxProvider>
      <View style={{
        height: '15%',
        width: '100%',
        backgroundColor: colorScheme === 'dark' ? PlatformColor('systemGray4') : PlatformColor('systemGray4'),
      }}>
          <Pressable
        onPress={() => console.log('create thought')}
        style={{
          borderRadius: 10, 
          padding: '6%', 
          backgroundColor: colorScheme === 'dark' ? PlatformColor('systemGray5') : '#f8fbf8',
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.20,
          shadowRadius: 1.41,
          elevation: 2,
          width: '44%', 
          marginLeft: '30%',
          marginTop: '5%',
          marginBottom: '5%'
        }}>
        <Text>+ Create Thought</Text>
      </Pressable>

      </View>
      <View
        lightColor='#f5f5f5'
        darkColor={PlatformColor('systemGray6')}
        style={{
        height: '70%',
        width: '100%',
      }}>
        <DraxList
          data={responses}
          contentContainerStyle={{marginTop: '10%'}}
          renderItemContent={({ item }, { viewState, hover }) => {
            return(
              <DraggableTextCard
                text={item}
              />
            )
          }
        }
          keyExtractor={(item, index) => `${item}`}
        /> 
      </View>
      <CategoryFooter />
    </DraxProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
