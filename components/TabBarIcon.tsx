import * as React from 'react';
import { Image } from 'react-native';
import TuneInIconDark from '../assets/images/tunein-icon-dark.png';
import TuneInIconLight from '../assets/images/tunein-icon-light.png';
import AlignIconDark from '../assets/images/align-icon-dark.png';
import AlignIconLight from '../assets/images/align-icon-light.png';
import AlignIconDarkAlert from '../assets/images/align-icon-dark-alert.png';
import AlignIconLightAlert from '../assets/images/align-icon-light-alert.png';
import ActIconDark from '../assets/images/act-icon-dark.png';
import ActIconLight from '../assets/images/act-icon-light.png';

const TabBarIcon = (props: {
  name: string;
  colorScheme: string;
  focused: boolean;
  alerted?: boolean | false;
}) => {
  const { name, colorScheme, focused, alerted = false } = props;

  interface footerIcons {
    [key: string]: any;
    tuneIn: {
      focused: string;
      normal: string;
    };
    align: {
      focused: string;
      normal: any;
    };
    act: {
      focused: string;
      normal: string;
    };
  }

  const hasAlert = () => {
    if (alerted) {
      return colorScheme === 'dark' ? AlignIconDarkAlert : AlignIconLightAlert;
    } else {
      return colorScheme === 'dark' ? AlignIconDark : AlignIconLight;
    }
  };

  const footerIcons = {
    tuneIn: {
      focused: colorScheme === 'dark' ? TuneInIconLight : TuneInIconDark,
      normal: colorScheme === 'dark' ? TuneInIconDark : TuneInIconLight,
    },
    align: {
      focused: colorScheme === 'dark' ? AlignIconLight : AlignIconDark,
      normal: hasAlert(),
    },
    act: {
      focused: colorScheme === 'dark' ? ActIconLight : ActIconDark,
      normal: colorScheme === 'dark' ? ActIconDark : ActIconLight,
    },
  };
  return (
    <Image
      resizeMode="contain"
      resizeMethod="resize"
      style={{
        resizeMode: 'contain',
        width: 35,
      }}
      source={focused ? footerIcons[name].focused : footerIcons[name].normal}
    />
  );
};

export default TabBarIcon;
