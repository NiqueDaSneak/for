import React, { useContext, useEffect, useState } from 'react';
import { Text, View } from '../../components/Themed';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import {
  PlatformColor,
  SectionList,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import PressableTextCard from '../../components/PressableTextCard';
import { QuestionsContext } from '../../state/questions.context';

const QuestionsListScreen = ({ navigation, route }) => {
  const { sectionTitle } = route.params;
  const colorScheme = useColorScheme();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [qState, qDispatch] = useContext(QuestionsContext);
  const { baseQuestions, answeredQuestions } = qState;

  useEffect(() => {
    navigation.setOptions({ title: `${sectionTitle} Questions` });
  }, []);

  const styles = StyleSheet.create({
    pageContainer: {
      height: '100%',
      width: '100%',
      paddingTop: '10%',
    },
    segmentedControl: {
      width: '90%',
      marginLeft: '5%',
      marginBottom: '5%',
    },
    sectionHeader: {
      backgroundColor:
        colorScheme === 'dark' ? PlatformColor('systemGray6') : '#f5f5f5',
      fontWeight: 'bold',
      paddingLeft: '5%',
      marginBottom: '4%',
      paddingBottom: '4%',
    },
  });

  return (
    <View
      lightColor="#f5f5f5"
      darkColor={PlatformColor('systemGray6')}
      style={styles.pageContainer}
    >
      <SegmentedControl
        style={styles.segmentedControl}
        backgroundColor={PlatformColor('systemGray6')}
        values={['All Questions', 'Answered']}
        selectedIndex={selectedIndex}
        onChange={(event) => {
          setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
        }}
      />
      {selectedIndex === 0 ? (
        <SectionList
          keyExtractor={(item, index) => item + index}
          sections={baseQuestions}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <PressableTextCard
              text={item.text}
              onPress={() =>
                navigation.navigate('AnswerQuestionScreen', {
                  questionData: item,
                  answeredFrom: sectionTitle,
                })
              }
            />
          )}
        />
      ) : (
        <FlatList
          data={answeredQuestions.filter(
            (question) => question.answeredFrom === sectionTitle
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PressableTextCard
              text={item.text}
              onPress={() =>
                navigation.navigate('AnswerQuestionScreen', {
                  questionData: item,
                })
              }
            />
          )}
        />
      )}
    </View>
  );
};

export default QuestionsListScreen;
