import React, {useEffect, useState} from 'react'
import { Text, View } from '../../components/Themed';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { PlatformColor, Pressable, SectionList, useColorScheme } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import PressableTextCard from '../../components/PressableTextCard'

const QuestionsListScreen = ({ navigation, route }) => {
  const {sectionTitle} = route.params
  const colorScheme = useColorScheme()
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    navigation.setOptions({title: `${sectionTitle} Questions`})
  }, [])
  
      const questionSectionData = [
    {
      title: 'Intentions for change:',
      data: [
        {
          text: 'What do you intend to do?'
        },
        {
          text: 'What do you think you might be able to do?'
        },
      ]
    },
    {
      title: 'Disadvantages of the status quo:',
      data: [
        {
          text: 'What concerns you about your current situation?'
        },
        {
          text: 'What do you think might happen if you do not change?'
        }
      ]
    },
    {
      title: 'Expressing optimism:',
      data: [
        {
          text: 'How confident are you that you can make this change?'
        },
        {
          text: 'What kind of support would be helpful in making this change?'
        },
        {
          text: 'What kind of support would be helpful in making this change?'
        }
      ]
    },
    {
      title: 'Advantages of change:',
      data: [
        {
          text: 'If you could wake up tomorrow and things changed by magic, how would things be better for you?'
        }
      ]
    },
    {
      title: 'Scaling:',
      data: [
        {
        text: 'What do you think might help become more confident in making a change?'
        }
      ]
    },
]
  return (
    <View
      lightColor='#f5f5f5'
      darkColor={PlatformColor('systemGray6')}
      style={{
      height: '100%',
      width: '100%',
      paddingTop: '10%'
    }}>
      <SegmentedControl
          style={{width: '90%', marginLeft: '5%', marginBottom: '5%'}}
          backgroundColor={PlatformColor('systemGray6')}
          values={['All Questions', 'Answered']}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex)
          }}
        />  
      <SectionList
        keyExtractor={(item, index) => item + index}
        sections={questionSectionData}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={{backgroundColor: colorScheme === 'dark' ? PlatformColor('systemGray6') : '#f5f5f5', fontWeight: 'bold', paddingLeft: '5%', marginBottom: '4%', paddingBottom: '4%'}}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <PressableTextCard text={item.text} onPress={() => navigation.navigate('AnswerQuestionScreen', { questionText: item.text })} />
        )}
      />
    </View>
  )
}

export default QuestionsListScreen