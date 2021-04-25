import React, { useContext, useEffect } from 'react';
import {
  PlatformColor,
  StyleSheet,
  useColorScheme,
  Image,
  Pressable,
  View as ContainerView,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from '../../components/Themed';
import {
  AlignCategoriesContext,
  ModalContext,
  OpportunitiesContext,
} from '../../state';
import DraggableTextCard from '../../components/TextCards/DraggableTextCard';
import { Category, Thought } from '../../state/align-categories.context';
import { Opportunity } from '../../state/opportunities.context';
import { DraxProvider } from 'react-native-drax';
import OpportunityCard from '../../components/TextCards/OpportunityCard';
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
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <DraxProvider>
        {currentCategory.thoughts.map((thought: Thought) => (
          <React.Fragment key={thought.text}>
            {!thought.withOpportunity && (
              <DraggableTextCard
                text={thought.text}
                receivingStyle={{
                  backgroundColor: PlatformColor('systemGray'),
                }}
                payload={thought}
                onDragStart={() => console.log('drag start')}
                onReceiveDragDrop={(event) => {
                  oDispatch({
                    type: 'CREATING',
                    payload: {
                      thoughts: [event.dragged.payload, thought],
                      category: currentCategory.title,
                    },
                  });
                }}
              />
            )}
          </React.Fragment>
        ))}
      </DraxProvider>
      {opportunities
        ?.filter(
          (opportunity: Opportunity) =>
            opportunity?.categoryTitle === currentCategory.title
        )
        .map((opportunity: Opportunity) => (
          <OpportunityCard key={opportunity.title} opportunity={opportunity} />
        ))}
    </ScrollView>
  );
};

export default CategoryScreen;
