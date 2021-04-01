import * as React from 'react';
import { StyleSheet, FlatList, Image, PlatformColor, useColorScheme, Pressable } from 'react-native';

import { Text, View } from '../../components/Themed';
import { useFonts } from '../../hooks/useFonts';

export default function TabOneScreen({navigation}) {
  const colorScheme = useColorScheme();
  const { fontTypes } = useFonts()
  
  return (
    <View
      lightColor='#F0EAD6'
      darkColor={PlatformColor('systemGray6')}
      style={{
      height: '100%',
      width: '100%'
    }}>
      <FlatList
        keyExtractor={({item, index}) => index}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-around' }}
        contentContainerStyle={{
          paddingTop: '10%',
          justifyContent: 'space-between',
        }}
        data={[
          {
            title: 'Health & Wellness',
            image: require('../../assets/images/h-w-img.png')
          },
          {
            title: 'Relationships',
            image: require('../../assets/images/relationships.png')
          },
          {
            title: 'Financial',
            image: require('../../assets/images/financial.png')
          },
        ]}
        renderItem={({ item }) => (
          <Pressable
            key={item.title}
            style={[styles.card, {
              backgroundColor: colorScheme === 'dark' ? PlatformColor('systemGray5') : PlatformColor('systemGray'),
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.20,
              shadowRadius: 1.41,
              elevation: 2,
            }]}
            onPress={() => navigation.navigate('QuestionListScreen')}>
            <Text style={[fontTypes.subHeading, {width: '100%', fontWeight: 'normal'}]}>{item.title}</Text>
            <Image 
              resizeMode="contain"
              resizeMethod="resize"
              style={styles.cardImage}
              source={item.image}
            />
          </Pressable>
          )
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 12, 
    width: '46%', 
    height: 250, 
    marginBottom: 10
  },
  cardImage: {
    resizeMode: 'contain',
    height: '100%',
    width: '100%',
  }
})
