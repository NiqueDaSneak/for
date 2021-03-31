import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ModalConductor from './components/modals/ModalConductor';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { AuthContextProvider } from './state/auth.context';
import { ModalContextProvider } from './state/modal.context';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
          <ModalContextProvider>
            <AuthContextProvider>
              <Navigation colorScheme={colorScheme} />
              <ModalConductor colorScheme={colorScheme}  />
            </AuthContextProvider>
          </ModalContextProvider>
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
