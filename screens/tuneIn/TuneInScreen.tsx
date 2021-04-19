import * as React from 'react';
import {
  StyleSheet,
  FlatList,
  Image,
  PlatformColor,
  useColorScheme,
  Pressable,
} from 'react-native';

import { Text, View } from '../../components/Themed';
import { useFonts } from '../../hooks/useFonts';

export default function TabOneScreen({ navigation }) {
  const colorScheme = useColorScheme();
  const { fontTypes } = useFonts();

  const styles = StyleSheet.create({
    card: {
      borderRadius: 10,
      padding: 12,
      width: '46%',
      height: 250,
      marginBottom: 10,
      backgroundColor:
        colorScheme === 'dark'
          ? PlatformColor('systemGray5')
          : PlatformColor('systemGray'),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    cardImage: {
      resizeMode: 'contain',
      height: '100%',
      width: '100%',
    },
    pageContainer: {
      height: '100%',
      width: '100%',
    },
    columnStyle: {
      justifyContent: 'space-around',
    },
    contentContainer: {
      paddingTop: '10%',
      justifyContent: 'space-between',
    },
    title: {
      width: '100%',
      fontWeight: 'normal',
    },
  });

  return (
    <View
      lightColor="#f5f5f5"
      darkColor={PlatformColor('systemGray6')}
      style={styles.pageContainer}
    >
      <FlatList
        keyExtractor={({ item, index }) => index}
        numColumns={2}
        columnWrapperStyle={styles.columnStyle}
        contentContainerStyle={styles.contentContainer}
        data={[
          {
            title: 'Health & Wellness',
            image: require('../../assets/images/h-w-img.png'),
          },
          {
            title: 'Relationships',
            image: require('../../assets/images/relationships.png'),
          },
          {
            title: 'Finances',
            image: require('../../assets/images/financial.png'),
          },
        ]}
        renderItem={({ item }) => (
          <Pressable
            key={item.title}
            style={styles.card}
            onPress={() =>
              navigation.navigate('QuestionListScreen', {
                sectionTitle: item.title,
              })
            }
          >
            <Text style={[fontTypes.subHeading, styles.title]}>
              {item.title}
            </Text>
            <Image
              resizeMode="contain"
              resizeMethod="resize"
              style={styles.cardImage}
              source={item.image}
            />
          </Pressable>
        )}
      />
    </View>
  );
}
