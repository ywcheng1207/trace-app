import { z } from 'zod';

export const genderSchema = z.enum(['MALE', 'FEMALE', 'OTHER']);
export type Gender = z.infer<typeof genderSchema>;
export const GENDERS = genderSchema.options;

export const localeSchema = z.enum(['en', 'zh-Hant', 'zh-Hans']);
export type AppLocale = z.infer<typeof localeSchema>;
export const APP_LOCALES = localeSchema.options;

export const profileSchema = z.object({
  id: z.string(),
  email: z.email(),
  displayName: z.string(),
  avatar: z.string().nullable(),
  gender: genderSchema.nullable(),
  heightCm: z.number().nullable(),
  birthDate: z.string().nullable(),
  timezone: z.string().nullable(),
  language: localeSchema,
  hiddenMetrics: z.array(z.string()),
});
export type Profile = z.infer<typeof profileSchema>;

export const profileEditSchema = z.object({
  displayName: z.string().min(1).max(50),
  avatar: z.string().nullable(),
  gender: genderSchema.nullable(),
  heightCm: z.number().nullable(),
  birthDate: z.string().nullable(),
  timezone: z.string().nullable(),
});
export type ProfileEditValues = z.infer<typeof profileEditSchema>;
