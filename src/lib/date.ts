import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

export const DATE_KEY_FORMAT = 'yyyy-MM-dd';

export const toDateKey = (date: Date): string => format(date, DATE_KEY_FORMAT);

export type CalendarDay = {
  date: Date;
  key: string;
  inMonth: boolean;
  isToday: boolean;
};

export const buildMonthGrid = (month: Date): CalendarDay[] => {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end }).map((date) => ({
    date,
    key: toDateKey(date),
    inMonth: isSameMonth(date, month),
    isToday: isToday(date),
  }));
};
