import * as React from 'react';
import { StyleSheet, FlatList, Image, PlatformColor, useColorScheme } from 'react-native';

import { Text, View } from '../components/Themed';
import { useFonts } from '../hooks/useFonts';

export default function TabOneScreen() {
  const colorScheme = useColorScheme();
  const { fontTypes } = useFonts()
  
  return (
    <View style={{
      height: '100%'
    }}>
      <FlatList
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-around'}}
        contentContainerStyle={{
          paddingTop: '10%',
          justifyContent: 'space-between',
        }}
        data={[
          {
          title: 'Health & Wellness',
          image: require('../assets/images/h-w-img.png')
        },
        {
          title: 'Relationships',
          image: require('../assets/images/relationships.png')
          },
          {
            title: 'Financial',
            image: require('../assets/images/financial.png')
          },
        ]}
        renderItem={({item}) => (
          <View
            key={item.title}
            style={[styles.card, {backgroundColor: colorScheme === 'dark' ? PlatformColor('systemGray5') :  PlatformColor('systemGray')}]}>
            <Text style={[fontTypes.subHeading, {width: '100%', fontWeight: 'normal'}]}>{item.title}</Text>
            <Image 
              resizeMode="contain"
              resizeMethod="resize"
              style={styles.cardImage}
              source={item.image}
            />
          </View>
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
//   // container: {
//   //   flex: 1,
//   //   alignItems: 'center',
//   //   justifyContent: 'center',
//   // },
//   // title: {
//   //   fontSize: 20,
//   //   fontWeight: 'bold',
//   // },
//   // separator: {
//   //   marginVertical: 30,
//   //   height: 1,
//   //   width: '80%',
//   // },
})
