import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
export type LoginRequest = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    displayName: z.string().min(1),
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'passwords_not_match',
  });
export type RegisterRequest = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email(),
});
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'passwords_not_match',
  });
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;

export const authUserSchema = z.object({
  id: z.string(),
  email: z.email(),
  displayName: z.string(),
  avatar: z.string().nullable(),
});
export type AuthUser = z.infer<typeof authUserSchema>;

export const sessionSchema = z.object({
  token: z.string(),
  user: authUserSchema,
});
export type Session = z.infer<typeof sessionSchema>;

export const passwordChangeSchema = z
  .object({
    oldPassword: z.string().min(1),
    newPassword: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'passwords_not_match',
  });
export type PasswordChangeRequest = z.infer<typeof passwordChangeSchema>;
