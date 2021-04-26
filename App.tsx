import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ModalConductor from './components/modals/ModalConductor';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import AlignCategoriesProvider from './state/align-categories.context';
import { AuthContextProvider } from './state/auth.context';
import { DigitalThoughtsProvider } from './state/digital-thoughts.context';
import { ModalContextProvider } from './state/modal.context';
import { OpportunitiesProvider } from './state/opportunities.context';
import { QuestionsProvider } from './state/questions.context';
import {
  ActionSheetProvider,
  connectActionSheet,
} from '@expo/react-native-action-sheet';

const App = () => {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ModalContextProvider>
          <AuthContextProvider>
            <DigitalThoughtsProvider>
              <AlignCategoriesProvider>
                <QuestionsProvider>
                  <OpportunitiesProvider>
                    <ActionSheetProvider>
                      <>
                        <Navigation colorScheme={colorScheme} />
                        <ModalConductor colorScheme={colorScheme} />
                      </>
                    </ActionSheetProvider>
                  </OpportunitiesProvider>
                </QuestionsProvider>
              </AlignCategoriesProvider>
            </DigitalThoughtsProvider>
          </AuthContextProvider>
        </ModalContextProvider>
        <StatusBar />
      </SafeAreaProvider>
    );
  }
};
const ConnectedApp = connectActionSheet(App);

export default ConnectedApp;
