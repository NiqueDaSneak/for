import React, { useRef, useState } from 'react';
import { BlurView } from 'expo-blur';
import {
  Image,
  Modal,
  StyleSheet,
  View as ContainerView,
  Button,
  PlatformColor,
  Pressable,
  Keyboard,
} from 'react-native';
import { Text } from '../Themed';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useFonts } from '../../hooks/useFonts';
import { useActionSheet } from '@expo/react-native-action-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native-gesture-handler';
import { useKeyboard } from '../../hooks/useKeyboard';

const GoalCreationModal = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const [controlIndex, setControlIndex] = useState(0);
  const { fontTypes } = useFonts();
  const [remindText, setRemindText] = useState('Morning');
  const [date, setDate] = useState(new Date());

  // unsure for typescript
  const inputRef = useRef();
  const { keyboardOpen } = useKeyboard();

  const styles = StyleSheet.create({
    segmentedControl: {
      width: '100%',
    },
    blur: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentContainer: {
      width: '100%',
      height: '70%',
      paddingLeft: '8%',
      paddingRight: '8%',
      justifyContent: 'space-evenly',
    },
    inputAndButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    input: {
      width: '60%',
      color: PlatformColor('systemGray'),
    },
    text: {
      marginBottom: '4%',
    },
    reminderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    deadlineContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 200,
    },
    deadlineText: {
      marginRight: '50%',
    },
    dateTimePicker: {
      width: 125,
      height: 35,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginLeft: '20%',
      marginRight: '20%',
    },
  });

  const reminderHandler = () => {
    const options = ['Morning', 'Noon', 'Midafternoon', 'Night', 'Cancel'];

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
  };

  return (
    <Modal animationType="fade" visible={visible} transparent>
      <BlurView style={styles.blur} intensity={100}>
        <ContainerView style={styles.contentContainer}>
          <ContainerView style={styles.inputAndButton}>
            <TextInput
              ref={inputRef}
              multiline
              style={[fontTypes.heading, styles.input]}
              value={'This is the title 🤷🏿‍♂️ of the goal in a statement.'}
            />
            <Pressable
              onPress={() => {
                keyboardOpen ? Keyboard.dismiss() : inputRef.current.focus();
              }}
            >
              <Image
                resizeMode="contain"
                resizeMethod="resize"
                style={{
                  resizeMode: 'contain',
                  height: 32,
                  width: 32,
                }}
                source={
                  keyboardOpen
                    ? require('../../assets/images/checked.png')
                    : require('../../assets/images/edit-dark.png')
                }
              />
            </Pressable>
          </ContainerView>
          <ContainerView>
            <Text style={[fontTypes.subHeading, styles.text]}>
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
          <ContainerView style={styles.reminderContainer}>
            <Text style={fontTypes.subHeading}>When To Remind:</Text>
            <Button title={remindText} onPress={reminderHandler} />
          </ContainerView>
          <ContainerView style={styles.deadlineContainer}>
            <Text style={[fontTypes.subHeading, styles.deadlineText]}>
              Deadline:
            </Text>
            <DateTimePicker
              style={styles.dateTimePicker}
              value={date}
              mode="date"
              display="calendar"
              onChange={(event, selectedDate) => setDate(selectedDate)}
            />
          </ContainerView>
          <ContainerView style={styles.buttonContainer}>
            <Button title="Save" />
            <Button color="red" title="Cancel" onPress={close} />
          </ContainerView>
        </ContainerView>
      </BlurView>
    </Modal>
  );
};

export default GoalCreationModal;
