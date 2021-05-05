import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  PlatformColor,
  StyleSheet,
  useColorScheme,
  Image,
  View as ContainerView,
} from 'react-native';
import { Text, View } from '../../components/Themed';
import {
  AlignCategoriesContext,
  AuthContext,
  DigitalThoughtsContext,
} from '../../state/';
import ToggleTextCard from '../../components/TextCards/ToggleTextCard';
import CategoryFooter from '../../components/CategoryFooter';
import { useFonts } from '../../hooks/useFonts';
import { db } from '../../firebase';
import useFirestoreQuery from '../../hooks/useFirestoreQuery';

export default function AlignScreen() {
  const [dtState, dtDispatch] = useContext(DigitalThoughtsContext);
  const { newResponses } = dtState;
  const colorScheme = useColorScheme();

  const [isCategorizeActive, setIsCategorizeActive] = useState(false);
  const [acState] = useContext(AlignCategoriesContext);
  const [authState] = useContext(AuthContext);

  const { activeCategory } = acState.stage;

  const { fontTypes } = useFonts();

  const ref = db
    .collection('Thoughts')
    .where('userId', '==', authState.activeUser.id);
  const { data: thoughtsData } = useFirestoreQuery(ref);

  const styles = StyleSheet.create({
    createThoughtButtonContainer: {
      height: '12%',
      width: '100%',
      backgroundColor:
        colorScheme === 'dark'
          ? PlatformColor('systemGray4')
          : PlatformColor('systemGray4'),
    },
    createThought: {
      borderRadius: 10,
      padding: '6%',
      backgroundColor:
        colorScheme === 'dark' ? PlatformColor('systemGray5') : '#f8fbf8',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
      width: '44%',
      marginLeft: '30%',
      marginTop: '5%',
      marginBottom: '5%',
    },
    mainContainer: {
      height: '100%',
      width: '100%',
      backgroundColor:
        colorScheme === 'dark' ? PlatformColor('systemGray6') : '#f8fbf8',
    },
    responsesContentContainer: {
      marginTop: '10%',
      paddingBottom: '10%',
    },
    container: {
      height: '100%',
      width: '100%',
      justifyContent: 'center',
    },
    answerMore: {
      textAlign: 'center',
      width: '80%',
      marginLeft: '10%',
    },
  });

  useEffect(() => {
    if (newResponses) {
      dtDispatch({ type: 'NEW_SEEN' });
    }
  }, []);

  return (
    <View
      lightColor="#f5f5f5"
      darkColor={PlatformColor('systemGray6')}
      style={styles.mainContainer}
    >
      {thoughtsData?.docs.length === 0 ? (
        <ContainerView style={styles.container}>
          <Image
            resizeMode="contain"
            resizeMethod="resize"
            style={{
              resizeMode: 'contain',
              height: 300,
              width: '90%',
              marginLeft: '5%',
            }}
            source={require('../../assets/images/align-no-responses.png')}
          />
          <Text style={[fontTypes.subHeading, styles.answerMore]}>
            Answer more questions on the Tune In tab to populate this screen.
          </Text>
        </ContainerView>
      ) : (
        <>
          <FlatList
            data={thoughtsData?.docs.filter(
              (thought) => !thought.data().categorized
            )}
            contentContainerStyle={styles.responsesContentContainer}
            renderItem={({ item, index }) => {
              return (
                <ToggleTextCard
                  activeCategory={activeCategory}
                  isCategorizeActive={isCategorizeActive}
                  thought={{ id: item.id, ...item.data() }}
                />
              );
            }}
            keyExtractor={(item) => `${item.data().text}`}
          />
          <CategoryFooter
            isCategorizeActive={(val) => setIsCategorizeActive(val)}
          />
        </>
      )}
    </View>
  );
}
