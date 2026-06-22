/**
 * Note length limits, aligned with the web `trace` backend (lib/constants/limits.ts).
 * Lengths are measured as plain-text character count extracted from TipTap JSON.
 */

export const NoteLimits = {
  EXERCISE_NOTE: 3000,
  TRAINING_NOTE: 3000,
  TRAINING_NOTE_TITLE: 50,
  PLAN_EXERCISE_NOTE: 150,
} as const;
