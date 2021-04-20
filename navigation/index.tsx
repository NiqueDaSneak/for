import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { ColorSchemeName } from 'react-native';
import Authentication from '../screens/Authentication';

import NotFoundScreen from '../screens/NotFoundScreen';
import { AuthContext } from '../state';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: string }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator colorScheme={colorScheme} />
    </NavigationContainer>
  );
}

const Stack = createStackNavigator();

function RootNavigator({ colorScheme }: { colorScheme: string }) {
  const [authState, authDispatch] = useContext(AuthContext);
  const { isAuthenticated } = authState;
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Root" component={BottomTabNavigator} />
            <Stack.Screen
              name="NotFound"
              component={NotFoundScreen}
              options={{ title: 'Oops!' }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={Authentication} />
        )}
      </Stack.Navigator>
    </>
  );
}
