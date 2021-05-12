import { BlurView } from 'expo-blur';
import React from 'react';
import { ActivityIndicator, Modal } from 'react-native';
import { Text } from '../Themed';

const LoadingModal = ({ visible }) => {
  return (
    <Modal animationType="fade" visible={visible} transparent>
      <BlurView
        style={{
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        intensity={100}
      >
        <Text style={{marginBottom: '10%'}}>Answer Processing...</Text>
        <ActivityIndicator size='large' color='#378C21' />
      </BlurView>
    </Modal>
  );
};

export default LoadingModal;
