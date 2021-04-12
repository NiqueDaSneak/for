import React, { useContext, useEffect } from 'react';
import { PlatformColor, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Text, View } from '../../components/Themed';
import { AlignCategoriesContext } from '../../state';

const CategoryScreen = ({ navigation, route }) => {
  const { routeTitle } = route.params;
  const [acState, acDispatch] = useContext(AlignCategoriesContext);
  const { categories } = acState;

  const currentCategory = categories.filter(
    (category) => category.title === routeTitle
  )[0];

  useEffect(() => {
    navigation.setOptions({ title: `${routeTitle}` });
  }, []);

  const styles = StyleSheet.create({
    pageContainer: {
      height: '100%',
    },
  });
  return (
    <View
      lightColor="#f5f5f5"
      darkColor={PlatformColor('systemGray6').toString()}
      style={styles.pageContainer}
    >
      <FlatList
        data={currentCategory.thoughts}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
    </View>
  );
};

export default CategoryScreen;
