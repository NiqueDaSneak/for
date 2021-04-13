import React, { useContext, useEffect } from 'react';
import { PlatformColor, StyleSheet, useColorScheme, Image } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Text, View } from '../../components/Themed';
import { AlignCategoriesContext, OpportunitiesContext } from '../../state';
import {
  DraxList,
  DraxProvider,
  DraxScrollView,
  DraxView,
} from 'react-native-drax';
import TextCard, { DraggableTextCard } from '../../components/TextCard';

const CategoryScreen = ({ navigation, route }) => {
  const colorScheme = useColorScheme();
  const { routeTitle } = route.params;
  const [acState, acDispatch] = useContext(AlignCategoriesContext);
  const [oState, oDispatch] = useContext(OpportunitiesContext);

  const {opportunities} = oState
  const { categories } = acState;

  const currentCategory = categories.filter(
    (category) => category.title === routeTitle
  )[0];

  useEffect(() => {
    navigation.setOptions({ title: `${routeTitle}` });
  }, []);

  const styles = StyleSheet.create({
    pageContainer: {
      // minHeight: '100%',
      // backgroundColor: 'red'
    },
  });
  return (
    <DraxProvider>
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          backgroundColor:
            colorScheme === 'dark' ? PlatformColor('systemGray6') : '#f5f5f5',
          minHeight: '100%',
          marginTop: '10%',
        }}
      >
        {currentCategory.thoughts.map(
          (thought) => (
            <DraggableTextCard
              key={thought}
              text={thought}
              receivingStyle={{ backgroundColor: PlatformColor('systemGray') }}
              payload={thought}
              onDragStart={() => console.log('drag start')}
              onReceiveDragDrop={(event) => {
                oDispatch({type: 'CREATING', payload: [event.dragged.payload, thought]})
              }}
            />
          )
        )}
        {opportunities.map(opportunity => (
          <DraxView style={{
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
            flexDirection: 'row',
            alignItems: 'center'
          }} receivingStyle={{ backgroundColor: 'purple' }}>
                    <Image 
          resizeMode="contain"
          resizeMethod="resize"
          style={{
            resizeMode: 'contain',
            height: 32,
            width: 32,
            marginRight: '10%'
          }}
          source={require('../../assets/images/star.png')}
        />
            <Text>{opportunity.title}</Text>
          </DraxView>
        ))}
      </ScrollView>
    </DraxProvider>
  );
};

export default CategoryScreen;
