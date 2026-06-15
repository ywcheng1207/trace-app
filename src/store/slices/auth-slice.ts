import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthUser } from '@/features/auth/api/schemas';

type AuthStatus = 'restoring' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: AuthStatus;
  user: AuthUser | null;
};

const initialState: AuthState = {
  status: 'restoring',
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<AuthUser | null>) => {
      state.status = 'authenticated';
      state.user = action.payload;
    },
    setUnauthenticated: (state) => {
      state.status = 'unauthenticated';
      state.user = null;
    },
  },
});

export const { setAuthenticated, setUnauthenticated } = authSlice.actions;
export const authReducer = authSlice.reducer;
