import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

import i18n from '@/lib/i18n';
import { queryClient } from '@/lib/query/query-client';
import { store } from '@/store';

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </QueryClientProvider>
    </Provider>
  );
};
