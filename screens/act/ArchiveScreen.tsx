import React from 'react';
import { StyleSheet, PlatformColor } from 'react-native';
import { View } from '../../components/Themed';

const ArchiveScreen = () => {
  const styles = StyleSheet.create({
    pageContainer: {
      height: '100%',
      width: '100%',
      flexDirection: 'column-reverse',
      backgroundColor: 'purple'
    },
  });
  return (
    <View
      lightColor={PlatformColor('systemGray6')}
      darkColor={PlatformColor('systemGray6')}
      style={styles.pageContainer}
    ></View>
  );
};

export default ArchiveScreen