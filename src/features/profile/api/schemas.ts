import { z } from 'zod';

export const genderSchema = z.enum(['MALE', 'FEMALE', 'OTHER']);
export type Gender = z.infer<typeof genderSchema>;
export const GENDERS = genderSchema.options;

export const localeSchema = z.enum(['en', 'zh-Hant', 'zh-Hans']);
export type AppLocale = z.infer<typeof localeSchema>;
export const APP_LOCALES = localeSchema.options;

// Parses the decrypted GET /api/users/profile response.
// Backend returns snake_case fields nested under `user`.
export const profileResponseSchema = z
  .object({
    ok: z.boolean(),
    code: z.number(),
    message: z.string(),
    user: z.object({
      email: z.string(),
      display_name: z.string(),
      birth_date: z.string().nullable(),
      gender: genderSchema.nullable(),
      height: z.number().nullable(),
      activity_level: z.string().nullable(),
      timezone: z.string().nullable(),
      avatar: z.number().nullable(),
      hidden_metrics: z.array(z.string()),
    }),
  })
  .transform((data) => ({
    email: data.user.email,
    displayName: data.user.display_name,
    birthDate: data.user.birth_date,
    gender: data.user.gender,
    heightCm: data.user.height,
    activityLevel: data.user.activity_level,
    timezone: data.user.timezone,
    avatar: data.user.avatar,
    hiddenMetrics: data.user.hidden_metrics,
  }));

export type Profile = z.infer<typeof profileResponseSchema>;

export const profileEditSchema = z.object({
  displayName: z.string().min(1).max(50),
  avatar: z.string().nullable(),
  gender: genderSchema.nullable(),
  heightCm: z.number().nullable(),
  birthDate: z.string().nullable(),
  timezone: z.string().nullable(),
});
export type ProfileEditValues = z.infer<typeof profileEditSchema>;
