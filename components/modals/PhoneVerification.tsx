import React, { useState, useRef, useContext } from 'react';
import {
  Text,
  Button,
  TextInput,
  StyleSheet,
  View,
  Modal,
  PlatformColor,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useKeyboard } from '../../hooks/useKeyboard';
import { AuthContext, ModalContext } from '../../state';
import { useFonts } from '../../hooks/useFonts';

const PhoneVerification = ({
  visible,
  colorScheme,
  close,
}: {
  visible: boolean;
  colorScheme: string;
  close: () => void;
}) => {
  const { fontTypes, fontSizes } = useFonts();
  const { keyboardHeight } = useKeyboard();
  const phoneNumberInputRef = useRef();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [authState, authDispatch]: [Object, Function] = useContext(AuthContext);
  const [modalState, modalDispatch] = useContext(ModalContext);

  const verifyInputRef = useRef();
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyVisible, setVerifyVisible] = useState(false);

  const styles = StyleSheet.create({
    input: {
      borderRadius: 10,
      fontSize: fontSizes.medium,
      borderColor:
        colorScheme === 'dark'
          ? PlatformColor('systemGray6')
          : PlatformColor('systemGray'),
      borderWidth: 1,
      paddingLeft: '2%',
      marginBottom: '4%',
      width: '80%',
      textAlign: 'center',
      padding: '2%',
      color:
        colorScheme === 'dark'
          ? PlatformColor('systemGray6')
          : PlatformColor('systemGray'),
    },
    blurView: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
    inputContainer: {
      height: '40%',
      width: '100%',
      paddingBottom: '10%',
      display: verifyVisible ? 'none' : 'flex',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    copy1: {
      fontSize: fontSizes.large,
      color: colorScheme === 'dark' ? PlatformColor('systemGray6') : 'black',
    },
    copy2: {
      textAlign: 'center',
      fontSize: fontSizes.small,
      color:
        colorScheme === 'dark'
          ? PlatformColor('systemGray5')
          : PlatformColor('systemGray2'),
    },
    secondContainer: {
      height: '40%',
      width: '100%',
      paddingBottom: '10%',
      display: verifyVisible ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    copy3: {
      fontSize: fontSizes.large,
      color: colorScheme === 'dark' ? PlatformColor('systemGray6') : 'black',
    },
    copy4: {
      textAlign: 'center',
      fontSize: fontSizes.medium,
      color:
        colorScheme === 'dark'
          ? PlatformColor('systemGray5')
          : PlatformColor('systemGray2'),
    },
    buttonContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-evenly',
    },
  });
  return (
    <Modal
      transparent
      presentationStyle="overFullScreen"
      animationType="slide"
      visible={visible}
    >
      <BlurView intensity={100} style={styles.blurView}>
        <View style={styles.inputContainer}>
          <Text style={styles.copy1}>What is your number?</Text>
          <Text style={styles.copy2}>
            Your security is paramount. We make sure only you can access this
            sensitive personal information.
          </Text>
          <TextInput
            ref={phoneNumberInputRef}
            value={phoneNumber}
            returnKeyType="next"
            enablesReturnKeyAutomatically
            style={styles.input}
            placeholder="111-867-5309"
            keyboardType="phone-pad"
            autoCompleteType="tel"
            onChangeText={(text) => setPhoneNumber(text)}
          />
          <Button
            title="Send Code"
            onPress={() => {
              authDispatch({
                type: 'PHONE_VERIFICATION',
                phoneNumber,
              });
              setVerifyVisible(true);
              close();
            }}
          />
          <Button
            title="Cancel"
            color="red"
            onPress={() => {
              console.log('closing');
              close();
            }}
          />
        </View>
        <View style={styles.secondContainer}>
          <Text style={styles.copy3}>Verify your number?</Text>
          <Text style={styles.copy4}>
            Enter the code we just sent via text to {phoneNumber}
          </Text>
          <TextInput
            ref={verifyInputRef}
            value={verifyCode}
            returnKeyType="next"
            enablesReturnKeyAutomatically
            style={styles.input}
            placeholder=""
            keyboardType="phone-pad"
            autoCompleteType="tel"
            onChangeText={(text) => setVerifyCode(text)}
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Verify Code"
              onPress={() => {
                authDispatch({
                  type: 'VERIFY_PHONE',
                  verifyCode,
                });
                modalDispatch({ type: 'CLOSE' });
              }}
            />
            <Button
              title="Cancel"
              color="red"
              onPress={() => {
                modalDispatch({ type: 'CLOSE' });
              }}
            />
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default PhoneVerification;
