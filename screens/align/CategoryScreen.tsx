import React, { useContext, useEffect } from 'react';
import {
  PlatformColor,
  StyleSheet,
  useColorScheme,
  Image,
  Pressable,
} from 'react-native';
import {  ScrollView } from 'react-native-gesture-handler';
import { Text } from '../../components/Themed';
import {
  AlignCategoriesContext,
  ModalContext,
  OpportunitiesContext,
} from '../../state';
import {
  DraxProvider,
  DraxView,
} from 'react-native-drax';
import { DraggableTextCard } from '../../components/TextCard';
import { Category, Thought } from '../../state/align-categories.context';
import { Opportunity } from '../../state/opportunities.context'
const CategoryScreen = ({ navigation, route }) => {
  const colorScheme = useColorScheme();
  const { routeTitle } = route.params;
  const [acState, acDispatch] = useContext(AlignCategoriesContext);
  const [oState, oDispatch] = useContext(OpportunitiesContext);
  const [mState, mDispatch] = useContext(ModalContext);

  const { opportunities } = oState;
  const { categories } = acState;

  const currentCategory = categories?.filter(
    (category: Category) => category.title === routeTitle
  )[0];
  useEffect(() => {
    navigation.setOptions({ title: `${routeTitle}` });
  }, []);

  const styles = StyleSheet.create({
    contentContainer: {
      alignItems: 'center',
      backgroundColor:
        colorScheme === 'dark' ? PlatformColor('systemGray6') : '#f5f5f5',
      minHeight: '100%',
      paddingTop: '10%',
    },
  });
  return (
    <DraxProvider>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {currentCategory.thoughts.map((thought: Thought) => (
          <>
            {!thought.withOpportunity && (
              <DraggableTextCard
                key={thought.text}
                text={thought.text}
                receivingStyle={{
                  backgroundColor: PlatformColor('systemGray'),
                }}
                payload={thought}
                onDragStart={() => console.log('drag start')}
                onReceiveDragDrop={(event) => {
                  oDispatch({
                    type: 'CREATING',
                    payload: { thoughts: [event.dragged.payload, thought] },
                  });
                }}
              />
            )}
          </>
        ))}
        {opportunities?.filter(
            (opportunity: Opportunity) =>
              opportunity?.categoryTitle === currentCategory.title
          )
          .map((opportunity: Opportunity) => (
            <Pressable
              key={opportunity?.title}
              onPress={() =>
                navigation.navigate('OpportunityScreen', {
                  title: opportunity.title,
                })
              }
              style={{
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
              }}
            >
              <DraxView
                style={{ flexDirection: 'row', alignItems: 'center' }}
                receivingStyle={{ backgroundColor: 'purple' }}
              >
                <Image
                  resizeMode="contain"
                  resizeMethod="resize"
                  style={{
                    resizeMode: 'contain',
                    height: 32,
                    width: 32,
                    marginRight: '10%',
                  }}
                  source={require('../../assets/images/star.png')}
                />
                <Text>{opportunity?.title}</Text>
              </DraxView>
            </Pressable>
          ))}
      </ScrollView>
    </DraxProvider>
  );
};

export default CategoryScreen;
