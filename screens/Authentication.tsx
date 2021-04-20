import React, { useContext } from 'react';
import {
  Image,
  Text,
  PlatformColor,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useKeyboard } from '../hooks/useKeyboard';
import { ModalContext } from '../state';
import PhoneLogin from '../components/PhoneLogin';
import { View } from '../components/Themed';

// interface Props {
//   colorScheme: string;
// }
const Authentication = () => {
  const { keyboardHeight, keyboardOpen } = useKeyboard();
  const [modalState, modalDispatch] = useContext(ModalContext);
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    pageContainer: {
      height: '100%',
      width: '100%',
      // backgroundColor: PlatformColor('systemGray6'),
      alignItems: 'center',
      paddingTop: '60%',
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
      marginTop: '20%',
    },
  });
  return (
    <SafeAreaView>
      <View
        lightColor="#f5f5f5"
        darkColor={PlatformColor('systemGray6')}
        style={styles.pageContainer}
      >
        <Image
          resizeMode="contain"
          resizeMethod="resize"
          style={styles.logoGreen}
          source={require('../assets/images/logo-green.png')}
        />
        <Text style={styles.headline}>What are you here for?</Text>
        <View
          lightColor="#f5f5f5"
          darkColor={PlatformColor('systemGray6')}
          style={styles.button}
        >
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
      </View>
    </SafeAreaView>
  );
};

export default Authentication;
