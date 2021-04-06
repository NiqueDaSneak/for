import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

interface KeyboardValues {
  keyboardHeight: number;
  keyboardOpen: boolean;
}

export const useKeyboard = (): KeyboardValues => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  function onKeyboardWillShow(e) {
    setKeyboardHeight(e.endCoordinates.height);
  }

  function onKeyboardWillHide() {
    setKeyboardHeight(0);
  }

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', onKeyboardWillShow);
    Keyboard.addListener('keyboardWillHide', onKeyboardWillHide);
    return () => {
      Keyboard.removeListener('keyboardWillShow', onKeyboardWillShow);
      Keyboard.removeListener('keyboardWillHide', onKeyboardWillHide);
    };
  }, []);

  useEffect(() => {
    if (keyboardHeight > 0) {
      setKeyboardOpen(true);
    } else {
      setKeyboardOpen(false);
    }
  });
  return { keyboardHeight, keyboardOpen };
};
