import React, { useContext } from 'react';
import { View, Image, Text, PlatformColor, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useKeyboard } from '../hooks/useKeyboard';
import { ModalContext } from '../state';
import PhoneLogin from '../components/PhoneLogin';

interface Props {
  colorScheme: string;
}
const Authentication = ({ colorScheme }: Props) => {
  const { keyboardHeight, keyboardOpen } = useKeyboard();
  const [modalState, modalDispatch] = useContext(ModalContext);

  const styles = StyleSheet.create({
    pageContainer: {
      height: '100%',
      width: '100%',
      backgroundColor: PlatformColor('systemGray6'),
      alignItems: 'center',
    },
    safeArea: {
      marginTop: '60%',
      height: 210,
      justifyContent: 'space-evenly',
    },
    logoGreen: {
      resizeMode: 'contain',
      height: 100,
      width: 100,
    },
    headline: {
      fontSize: 16,
      color: PlatformColor('systemGray'),
      fontStyle: 'italic',
    },
    button: {
      position: 'absolute',
      bottom: keyboardHeight + 30,
      left: 'auto',
    },
  });
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.pageContainer}>
        <Image
          resizeMode="contain"
          resizeMethod="resize"
          style={styles.logoGreen}
          source={require('../assets/images/logo-green.png')}
        />
        <Text style={styles.headline}>What are you here for?</Text>
      </View>
      <View style={styles.button}>
        <PhoneLogin
          colorScheme={colorScheme}
          onPress={() => {
            modalDispatch({
              type: 'OPEN',
              modalType: 'GET_PHONE',
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Authentication;
