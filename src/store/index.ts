import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import { authReducer } from '@/store/slices/auth-slice';
import { uiReducer } from '@/store/slices/ui-slice';

const uiPersistConfig = {
  key: 'ui',
  storage: AsyncStorage,
  whitelist: ['themeMode'],
};

const persistedUiReducer = persistReducer(uiPersistConfig, uiReducer);

export const store = configureStore({
  reducer: {
    ui: persistedUiReducer as unknown as typeof uiReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
