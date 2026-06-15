import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

type ThemeMode = 'light' | 'dark' | 'system';
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  actionPath?: string;
};

export type NotificationInput = Omit<Notification, 'id'>;

const MAX_QUEUE = 6;

type UiState = {
  themeMode: ThemeMode;
  notifications: Notification[];
};

const initialState: UiState = {
  themeMode: 'system',
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
    showNotification: {
      reducer: (state, action: PayloadAction<Notification>) => {
        state.notifications.push(action.payload);
        if (state.notifications.length > MAX_QUEUE) {
          state.notifications = state.notifications.slice(-MAX_QUEUE);
        }
      },
      prepare: (input: NotificationInput) => ({ payload: { id: nanoid(), ...input } }),
    },
    dismissNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((item) => item.id !== action.payload);
    },
  },
});

export const { setThemeMode, showNotification, dismissNotification } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
