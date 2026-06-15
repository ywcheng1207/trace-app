import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { Toast } from '@/components/ui/toast';
import i18n from '@/lib/i18n';
import { queryClient } from '@/lib/query/query-client';
import { store } from '@/store';

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <I18nextProvider i18n={i18n}>
              {children}
              <Toast />
            </I18nextProvider>
          </QueryClientProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
