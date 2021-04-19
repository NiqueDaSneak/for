import React, { useState } from 'react';
import { BlurView } from 'expo-blur';
import {
  Image,
  Modal,
  StyleSheet,
  View as ContainerView,
  Button,
  PlatformColor,
} from 'react-native';
import { Text } from '../Themed';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useFonts } from '../../hooks/useFonts';
import { useActionSheet } from '@expo/react-native-action-sheet';
// import DatePicker from 'react-native-datepicker';

const GoalCreationModal = ({ visible }) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const [controlIndex, setControlIndex] = useState(0);
  const { fontTypes } = useFonts();
  const [remindText, setRemindText] = useState('Morning');
  const [date, setDate] = useState('09-10-2020');

  const styles = StyleSheet.create({
    segmentedControl: {
      width: '100%',
      // marginLeft: '5%',
    },
  });
  return (
    <Modal
      animationType="fade"
      visible={visible}
      // visible={true}
      transparent
    >
      <BlurView
        style={{
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        intensity={100}
      >
        <ContainerView
          style={{
            // backgroundColor: 'red',
            width: '100%',
            height: '48%',
            paddingLeft: '8%',
            paddingRight: '8%',

            justifyContent: 'space-evenly',
          }}
        >
          <ContainerView
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              // backgroundColor: 'green',
              // marginLeft: '8%',
              // marginRight: '8%',
            }}
          >
            {/* <Text style={fontTypes.heading}>🤷🏿‍♂️</Text> */}
            <Text style={[fontTypes.heading, { width: '60%' }]}>
              This is the title 🤷🏿‍♂️ of the goal in a statement.
            </Text>
            <Image
              resizeMode="contain"
              resizeMethod="resize"
              style={{
                resizeMode: 'contain',
                height: 32,
                width: 32,
                // marginRight: '10%',
              }}
              source={require('../../assets/images/edit-dark.png')}
            />
          </ContainerView>
          <ContainerView>
            <Text style={[fontTypes.subHeading, { marginBottom: '4%' }]}>
              Interval for Reminder:
            </Text>
            <SegmentedControl
              style={styles.segmentedControl}
              backgroundColor={PlatformColor('systemGray6')}
              values={['Routine', 'One Time']}
              selectedIndex={controlIndex}
              onChange={(event) => {
                setControlIndex(event.nativeEvent.selectedSegmentIndex);
              }}
            />
          </ContainerView>
          <ContainerView
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={fontTypes.subHeading}>When To Remind:</Text>
            <Button
              title={remindText}
              onPress={() => {
                const options = [
                  'Morning',
                  'Noon',
                  'Midafternoon',
                  'Night',
                  'Cancel',
                ];

                const destructiveButtonIndex = 4;
                const cancelButtonIndex = 4;

                showActionSheetWithOptions(
                  {
                    options,
                    cancelButtonIndex,
                    destructiveButtonIndex,
                  },
                  (buttonIndex) => {
                    setRemindText(options[buttonIndex]);
                  }
                );
              }}
            />
          </ContainerView>
          <ContainerView
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={fontTypes.subHeading}>Deadline</Text>
            {/* <DateTimePicker mode="time" /> */}

          </ContainerView>
          <ContainerView
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginLeft: '20%',
              marginRight: '20%',
            }}
          >
            <Button title="Save" />
            <Button color="red" title="Cancel" />
          </ContainerView>
        </ContainerView>
      </BlurView>
    </Modal>
  );
};

export default GoalCreationModal;
