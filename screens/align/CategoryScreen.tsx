import React, { useContext, useEffect } from 'react';
import {
  Image,
  PlatformColor,
  StyleSheet,
  useColorScheme,
  View as ContainerView,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { OpportunitiesContext } from '../../state';
import DraggableTextCard from '../../components/TextCards/DraggableTextCard';
import { Opportunity } from '../../state/opportunities.context';
import { DraxProvider } from 'react-native-drax';
import OpportunityCard from '../../components/TextCards/OpportunityCard';
import { Thought } from '../../state/digital-thoughts.context';
import useFirestoreDoc from '../../hooks/useFirestoreDoc';
import firebase, { db } from '../../firebase';
import useFirestoreQuery from '../../hooks/useFirestoreQuery';
import { Text } from '../../components/Themed';

const CategoryScreen = ({ navigation, route }) => {
  const colorScheme = useColorScheme();
  const { categoryId, thoughtIds } = route.params;
  const [, oDispatch] = useContext(OpportunitiesContext);

  const categoryRef = db.collection('Categories').doc(categoryId);
  const {
    isLoading: isLoadingCategory,
    data: currentCategory,
  } = useFirestoreDoc(categoryRef);

  const thoughtsRef =
    thoughtIds.length > 0
      ? db
          .collection('Thoughts')
          .where(firebase.firestore.FieldPath.documentId(), 'in', thoughtIds)
      : db
          .collection('Thoughts')
          .where(firebase.firestore.FieldPath.documentId(), 'in', ['sample']);

  const { data: thoughtsData } = useFirestoreQuery(thoughtsRef);

  const opportunityRef = db
    .collection('Opportunities')
    .where('categoryId', '==', categoryId);
  const { data: opportunityData } = useFirestoreQuery(opportunityRef);

  useEffect(() => {
    navigation.setOptions({ title: `${currentCategory?.data().title}` });
  }, [isLoadingCategory, currentCategory]);

  const styles = StyleSheet.create({
    contentContainer: {
      alignItems: 'center',
      backgroundColor:
        colorScheme === 'dark' ? PlatformColor('systemGray6') : '#f5f5f5',
      paddingTop: '10%',
      minHeight: '100%',
    },
    receivingStyle: {
      backgroundColor: PlatformColor('systemGray'),
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      {thoughtsData?.docs?.filter((thought) => thought?.data()).length > 0 ? (
        <DraxProvider>
          {thoughtsData?.docs?.map((thought: Thought) => (
            <React.Fragment key={thought?.data().text}>
              {!thought?.data().withOpportunity && (
                <DraggableTextCard
                  text={thought?.data().text}
                  receivingStyle={styles.receivingStyle}
                  payload={{ id: thought?.id, ...thought?.data() }}
                  onDragStart={() => console.log('drag start')}
                  onReceiveDragDrop={(event) => {
                    oDispatch({
                      type: 'CREATING',
                      payload: {
                        thoughts: [
                          event.dragged.payload,
                          { id: thought?.id, ...thought?.data() },
                        ],
                        categoryId: categoryId,
                      },
                    });
                  }}
                />
              )}
            </React.Fragment>
          ))}
          {opportunityData?.docs.map((opportunity: Opportunity) => (
            <React.Fragment key={opportunity?.data().title}>
              {!opportunity?.data().archived && (
                <OpportunityCard
                  opportunity={{ id: opportunity?.id, ...opportunity?.data() }}
                />
              )}
            </React.Fragment>
          ))}
        </DraxProvider>
      ) : (
        <ContainerView
          style={{
            width: '100%',
            height: '70%',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <Image
            resizeMode="contain"
            resizeMethod="resize"
            style={{
              resizeMode: 'contain',
              height: 270,
              width: '80%',
            }}
            source={require('../../assets/images/no-thoughts.png')}
          />
          <Text style={{ width: '80%', fontSize: 16 }}>
            Go to the previous screen and categorize some thoughts for this category.
          </Text>
        </ContainerView>
      )}
    </ScrollView>
  );
};

export default CategoryScreen;
