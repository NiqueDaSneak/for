import React, { useContext, useState } from 'react';
import {
  FlatList,
  PlatformColor,
  StyleSheet,
  useColorScheme,
  View as ContainerView,
  Image,
  Pressable,
  Button,
} from 'react-native';
import { View, Text } from '../../components/Themed';
import { useFonts } from '../../hooks/useFonts';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { ModalContext, OpportunitiesContext } from '../../state';
import type { Opportunity } from '../../state/opportunities.context';
import DateTimePicker from '@react-native-community/datetimepicker';
import OpportunityCard from '../../components/TextCards/OpportunityCard';
import PressableTextCard from '../../components/PressableTextCard';

const ActScreen = ({ navigation }) => {
  // const [date, setDate] = useState(new Date(1598051730000));

  const colorScheme = useColorScheme();
  const { fontTypes } = useFonts();
  const [controlIndex, setControlIndex] = useState(0);

  const [mState, mDispatch] = useContext(ModalContext);

  const [oState, oDispatch] = useContext(OpportunitiesContext);
  const { opportunities }: { opportunities: Opportunity[] } = oState;

  const opportunitiesToShow = opportunities?.filter((opp) => !opp?.archived);

  const styles = StyleSheet.create({
    pageContainer: {
      height: '100%',
      width: '100%',
      flexDirection: 'column-reverse',
      paddingBottom: '8%',
    },
    segmentedControl: {
      width: '90%',
      marginLeft: '5%',
    },
    oppContainer: {
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
    },
    oppContentContainer: {
      width: '100%',
      minHeight: '100%',
      alignItems: 'center',
      paddingTop: '4%',
      backgroundColor: PlatformColor('systemGray6'),
    },
    starContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    introText: {
      paddingTop: '10%',
      width: '80%',
      marginBottom: '8%',
    },
    goalExplainContainer: {
      paddingTop: '10%',
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    oppTabContainer: {
      width: '50%',
      marginLeft: '25%',
      paddingBottom: '8%',
      paddingTop: '4%',
    },
    pressTextCard: {
      backgroundColor:
        colorScheme === 'dark'
          ? PlatformColor('systemGray2')
          : PlatformColor('systemGray6'),
    },
  });
  return (
    <View
      lightColor={PlatformColor('systemGray5')}
      darkColor={PlatformColor('systemGray5')}
      style={styles.pageContainer}
    >
      <SegmentedControl
        style={styles.segmentedControl}
        backgroundColor={
          colorScheme === 'dark'
            ? PlatformColor('systemGray5')
            : PlatformColor('systemGray5')
        }
        values={['Opportunities', 'Goals']}
        selectedIndex={controlIndex}
        onChange={(event) => {
          setControlIndex(event.nativeEvent.selectedSegmentIndex);
        }}
      />
      {controlIndex === 0 && (
        <>
          <ContainerView style={styles.oppTabContainer}>
            <PressableTextCard
              style={styles.pressTextCard}
              onPress={() => navigation.navigate('ArchiveScreen')}
              text="Archive: 5/10"
            />
          </ContainerView>
          <FlatList
            data={opportunitiesToShow}
            keyExtractor={(item: Opportunity) => item.title}
            contentContainerStyle={styles.oppContentContainer}
            renderItem={({ item }: { item: Opportunity }) => (
              <OpportunityCard opportunity={item} edit />
            )}
          />
        </>
      )}
      {controlIndex === 1 && (
        <ContainerView style={styles.goalExplainContainer}>
          <Image
            resizeMode="contain"
            resizeMethod="resize"
            style={{
              resizeMode: 'contain',
              height: 190,
              width: '100%',
            }}
            source={require('../../assets/images/goal-explain.png')}
          />
          <Text style={styles.introText}>
            Creating goals is as easy as pressing this button.
          </Text>
          <Button
            title="Goal Setters Press Here"
            onPress={() =>
              mDispatch({ type: 'OPEN', modalType: 'CREATE_GOAL' })
            }
          />
        </ContainerView>
      )}
    </View>
  );
};

export default ActScreen;
