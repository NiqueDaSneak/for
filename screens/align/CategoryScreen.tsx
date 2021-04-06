import React, { useEffect } from 'react';
import { PlatformColor, StyleSheet } from 'react-native';
import { View } from '../../components/Themed';

const CategoryScreen = ({ navigation, route }) => {
  const { routeTitle } = route.params;

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
      darkColor={PlatformColor('systemGray6')}
      style={styles.pageContainer}
    ></View>
  );
};

export default CategoryScreen;
