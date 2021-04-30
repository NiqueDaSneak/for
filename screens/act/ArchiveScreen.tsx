import React from 'react';
import { StyleSheet, PlatformColor } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import OpportunityCard from '../../components/TextCards/OpportunityCard';
import { View } from '../../components/Themed';
import { Opportunity } from '../../state/opportunities.context';

const ArchiveScreen = ({ route }) => {
  const { opportunities } = route.params;

  const styles = StyleSheet.create({
    pageContainer: {
      height: '100%',
      width: '100%',
    },
    oppContentContainer: {
      width: '100%',
      minHeight: '100%',
      alignItems: 'center',
      paddingTop: '4%',
      backgroundColor: PlatformColor('systemGray6'),
    },
  });

  return (
    <View
      lightColor={PlatformColor('systemGray6')}
      darkColor={PlatformColor('systemGray6')}
      style={styles.pageContainer}
    >
      <FlatList
        data={opportunities}
        keyExtractor={(item: Opportunity) => item.title}
        contentContainerStyle={styles.oppContentContainer}
        renderItem={({ item }: { item: Opportunity }) => (
          <OpportunityCard opportunity={item} disabled />
        )}
      />
    </View>
  );
};

export default ArchiveScreen;
