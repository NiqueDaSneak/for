import { FontStyle } from '@react-native-segmented-control/segmented-control';

export const useFonts = () => {
  const fontTypes: { heading: FontStyle; subHeading: FontStyle } = {
    heading: {
      fontSize: 30,
      fontWeight: 'bold',
    },
    subHeading: {
      fontSize: 20,
      fontWeight: 'bold',
    },
  };
  const fontSizes = {
    xsmall: 10,
    small: 15,
    medium: 20,
    large: 30,
    xlarge: 50,
  };
  return { fontTypes, fontSizes };
};
