import { z } from 'zod';

export const profileSchema = z.object({
  id: z.string(),
  email: z.email(),
  displayName: z.string(),
  avatar: z.string().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).nullable(),
  heightCm: z.number().nullable(),
  language: z.enum(['en', 'zh-Hant', 'zh-Hans']),
});
export type Profile = z.infer<typeof profileSchema>;
