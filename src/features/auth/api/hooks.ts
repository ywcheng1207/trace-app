import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

import {
  mockChangePassword,
  mockLogin,
  mockRegister,
  mockRequestReset,
  mockResetPassword,
} from '@/features/auth/api/mock';
import {
  ForgotPasswordRequest,
  LoginRequest,
  PasswordChangeRequest,
  RegisterRequest,
  ResetPasswordRequest,
  Session,
} from '@/features/auth/api/schemas';
import { clearAccessToken, getAccessToken, setAccessToken } from '@/lib/auth/token-storage';
import { queryClient } from '@/lib/query/query-client';
import { useAppDispatch } from '@/store/hooks';
import { setAuthenticated, setUnauthenticated } from '@/store/slices/auth-slice';

const persistSession = async (session: Session, dispatch: ReturnType<typeof useAppDispatch>) => {
  await setAccessToken(session.token);
  dispatch(setAuthenticated(session.user));
};

export const useAuthBootstrap = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let active = true;
    const restore = async () => {
      const token = await getAccessToken();
      if (!active) return;
      dispatch(token ? setAuthenticated(null) : setUnauthenticated());
    };
    void restore();
    return () => {
      active = false;
    };
  }, [dispatch]);
};

export const useLogin = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (payload: LoginRequest) => mockLogin(payload),
    onSuccess: (session) => persistSession(session, dispatch),
  });
};

export const useRegister = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (payload: RegisterRequest) => mockRegister(payload),
    onSuccess: (session) => persistSession(session, dispatch),
  });
};

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (_payload: ForgotPasswordRequest) => mockRequestReset(),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (_payload: ResetPasswordRequest) => mockResetPassword(),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (_payload: PasswordChangeRequest) => mockChangePassword(),
  });
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  return async () => {
    await clearAccessToken();
    queryClient.clear();
    dispatch(setUnauthenticated());
  };
};
