import { useMutation, useQuery } from '@tanstack/react-query';

import {
  mockGetBodyMetric,
  mockGetDayNote,
  mockGetDayPlan,
  mockGetMonthSummaries,
  mockSaveBodyMetric,
  mockSaveDayNote,
  mockSaveDayPlan,
} from '@/features/schedule/api/mock';
import { BodyMetric, TrainingPlan } from '@/features/schedule/api/schemas';
import { queryClient } from '@/lib/query/query-client';
import { QUERY_KEYS } from '@/lib/query/query-keys';

const invalidateSchedule = () => {
  void queryClient.invalidateQueries({ queryKey: ['schedule'] });
};

export const useScheduleMonth = (year: number, month: number) => {
  // TODO: 換成 apiFetch('/api/schedule/events?year=&month=', { schema })
  return useQuery({
    queryKey: QUERY_KEYS.scheduleMonth(year, month),
    queryFn: () => mockGetMonthSummaries(year, month),
  });
};

export const useDayPlan = (date: string) => {
  // TODO: 換成 apiFetch('/api/training-plans?date=', { schema })
  return useQuery({ queryKey: QUERY_KEYS.dayPlan(date), queryFn: () => mockGetDayPlan(date) });
};

export const useBodyMetric = (date: string) => {
  // TODO: 換成 apiFetch('/api/body-metrics?date=', { schema })
  return useQuery({ queryKey: QUERY_KEYS.bodyMetric(date), queryFn: () => mockGetBodyMetric(date) });
};

export const useDayNote = (date: string) => {
  // TODO: 換成 apiFetch('/api/training-notes?date=', { schema })
  return useQuery({ queryKey: QUERY_KEYS.dayNote(date), queryFn: () => mockGetDayNote(date) });
};

export const useSaveDayPlan = () => {
  return useMutation({
    mutationFn: (plan: TrainingPlan) => mockSaveDayPlan(plan),
    onSuccess: invalidateSchedule,
  });
};

export const useSaveBodyMetric = () => {
  return useMutation({
    mutationFn: (metric: BodyMetric) => mockSaveBodyMetric(metric),
    onSuccess: invalidateSchedule,
  });
};

export const useSaveDayNote = () => {
  return useMutation({
    mutationFn: (input: { date: string; note: string }) => mockSaveDayNote(input.date, input.note),
    onSuccess: invalidateSchedule,
  });
};
