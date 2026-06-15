import { Profile } from '@/features/profile/api/schemas';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// TODO: 換成 apiFetch('/api/users/profile', { schema: profileSchema })
export const mockGetProfile = async (): Promise<Profile> => {
  await delay(400);
  return {
    id: 'u_mock_1',
    email: 'demo@trace.app',
    displayName: 'Demo User',
    avatar: null,
    gender: 'OTHER',
    heightCm: 175,
    language: 'zh-Hant',
  };
};
