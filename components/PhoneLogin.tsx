import React from 'react';
import useColorScheme from '../hooks/useColorScheme';
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  PlatformColor,
  GestureResponderEvent,
} from 'react-native';

const styles = StyleSheet.create({
  loginIcon: {
    resizeMode: 'contain',
    height: 15,
    width: 15,
  },
  loginButtonContainer: {
    width: 220,
    height: 45,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: '10%',
  },
});

interface Props {
  onPress: GestureResponderEvent;
  colorScheme: string;
}
const PhoneLogin = ({ onPress, colorScheme }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.loginButtonContainer,
          {
            backgroundColor: PlatformColor('systemGray4'),
          },
        ]}
      >
        <Image
          resizeMode="contain"
          resizeMethod="resize"
          style={styles.loginIcon}
          source={
            colorScheme === 'dark'
              ? require('../assets/images/phone-light.png')
              : require('../assets/images/phone-dark.png')
          }
        />
        <Text style={{ color: PlatformColor('systemGray') }}>
          Sign in with phone number
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PhoneLogin;