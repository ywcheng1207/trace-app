import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ThemeMode = 'light' | 'dark' | 'system';
type NotificationType = 'success' | 'error' | 'info';

type Notification = {
  type: NotificationType;
  message: string;
};

type UiState = {
  themeMode: ThemeMode;
  notification: Notification | null;
};

const initialState: UiState = {
  themeMode: 'system',
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
    showNotification: (state, action: PayloadAction<Notification>) => {
      state.notification = action.payload;
    },
    dismissNotification: (state) => {
      state.notification = null;
    },
  },
});

export const { setThemeMode, showNotification, dismissNotification } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
