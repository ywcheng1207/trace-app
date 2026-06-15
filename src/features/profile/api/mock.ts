import { AppLocale, Profile, ProfileEditValues } from '@/features/profile/api/schemas';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

let current: Profile = {
  id: 'u_mock_1',
  email: 'demo@trace.app',
  displayName: 'Demo User',
  avatar: null,
  gender: 'OTHER',
  heightCm: 175,
  language: 'zh-Hant',
  // 四肢圍度欄位預設隱藏，使用者可於設定開啟
  hiddenMetrics: [
    'leftThigh',
    'rightThigh',
    'leftCalf',
    'rightCalf',
    'leftUpperArm',
    'rightUpperArm',
    'leftForearm',
    'rightForearm',
  ],
};

const clone = (profile: Profile): Profile => ({
  ...profile,
  hiddenMetrics: [...profile.hiddenMetrics],
});

// TODO: 換成 apiFetch('/api/users/profile', { schema: profileSchema })
export const mockGetProfile = async (): Promise<Profile> => {
  await delay(400);
  return clone(current);
};

// TODO: 換成 apiFetch('/api/users/profile', { method: 'PUT', body, schema: profileSchema })
export const mockUpdateProfile = async (values: ProfileEditValues): Promise<Profile> => {
  await delay(350);
  current = { ...current, ...values };
  return clone(current);
};

// TODO: 換成 apiFetch('/api/users/profile', { method: 'PATCH', body: { language }, schema })
export const mockUpdateLanguage = async (language: AppLocale): Promise<void> => {
  await delay(200);
  current = { ...current, language };
};

// TODO: 換成 apiFetch('/api/users/profile', { method: 'PATCH', body: { hiddenMetrics }, schema })
export const mockSetHiddenMetrics = async (hiddenMetrics: string[]): Promise<void> => {
  await delay(200);
  current = { ...current, hiddenMetrics };
};
