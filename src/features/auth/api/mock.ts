import { LoginRequest, RegisterRequest, Session } from '@/features/auth/api/schemas';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const buildSession = (email: string, displayName: string): Session => ({
  token: `mock-token-${Date.now()}`,
  user: { id: 'u_mock_1', email, displayName, avatar: null },
});

// TODO: 換成 apiFetch('/api/auth/login', { method: 'POST', body, schema: sessionSchema })
export const mockLogin = async (payload: LoginRequest): Promise<Session> => {
  await delay(600);
  return buildSession(payload.email, 'Demo User');
};

// TODO: 換成 apiFetch('/api/auth/register', { method: 'POST', body, schema: sessionSchema })
export const mockRegister = async (payload: RegisterRequest): Promise<Session> => {
  await delay(600);
  return buildSession(payload.email, payload.displayName);
};

// TODO: 換成 apiFetch('/api/auth/reset-password/request', { method: 'POST', body, schema })
export const mockRequestReset = async (): Promise<void> => {
  await delay(600);
};

// TODO: 換成 apiFetch('/api/auth/reset-password/confirm', { method: 'POST', body, schema })
export const mockResetPassword = async (): Promise<void> => {
  await delay(600);
};
