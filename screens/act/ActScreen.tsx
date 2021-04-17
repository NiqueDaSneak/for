import React, { useContext, useState } from 'react';
import {
  FlatList,
  PlatformColor,
  StyleSheet,
  useColorScheme,
  View as ContainerView,
  Image,
  Pressable,
} from 'react-native';
import { View, Text } from '../../components/Themed';
import { useFonts } from '../../hooks/useFonts';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { OpportunitiesContext } from '../../state';
import type { Opportunity } from '../../state/opportunities.context';

const ActScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { fontTypes } = useFonts();
  const [controlIndex, setControlIndex] = useState(0);

  const [oState, oDispatch] = useContext(OpportunitiesContext);
  const { opportunities }: { opportunities: Opportunity[] } = oState;
  const styles = StyleSheet.create({
    pageContainer: {
      height: '100%',
      width: '100%',
      flexDirection: 'column-reverse',
      paddingBottom: '10%',
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
      minHeight: '100%',
      alignItems: 'center',
      paddingTop: '4%',
      backgroundColor: PlatformColor('systemGray6'),
    },
    starContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    }
  });
  return (
    <View
      lightColor={PlatformColor('systemGray6')}
      darkColor={PlatformColor('systemGray6')}
      style={styles.pageContainer}
    >
      <SegmentedControl
        style={styles.segmentedControl}
        backgroundColor={PlatformColor('systemGray6')}
        values={['Opportunities', 'Goals']}
        selectedIndex={controlIndex}
        onChange={(event) => {
          setControlIndex(event.nativeEvent.selectedSegmentIndex);
        }}
      />
      {controlIndex === 0 && (
        <FlatList
          data={opportunities}
          keyExtractor={(item: Opportunity) => item.title}
          contentContainerStyle={styles.oppContentContainer}
          renderItem={({ item }: {item: Opportunity}) => (
            <Pressable
              key={item.title}
              onPress={() =>
                navigation.navigate('OpportunityScreen', {
                  title: item.title,
                })
              }
              style={styles.oppContainer}
            >
              <ContainerView
                style={styles.starContainer}
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
                <Text>{item.title}</Text>
              </ContainerView>
            </Pressable>
          )}
        />
      )}
    </View>
  );
};

export default ActScreen;
