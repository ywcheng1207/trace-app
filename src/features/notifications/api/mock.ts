import { SystemNotification } from '@/features/notifications/api/schemas';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

let store: SystemNotification[] = [
  {
    id: 'n_seed_1',
    kind: 'success',
    title: 'AI 動作分析完成',
    body: '你的「槓鈴深蹲」影片分析已完成，點擊查看建議。',
    read: false,
    createdAt: minutesAgo(8),
    actionPath: '/exercises',
  },
  {
    id: 'n_seed_2',
    kind: 'info',
    title: '本週訓練摘要',
    body: '你本週完成 4 次訓練，訓練量較上週成長 12%。',
    read: false,
    createdAt: minutesAgo(120),
    actionPath: '/statistics',
  },
  {
    id: 'n_seed_3',
    kind: 'warning',
    title: '尚未記錄今日身體數值',
    body: '別忘了記錄體重與圍度，維持追蹤的連續性。',
    read: true,
    createdAt: minutesAgo(1500),
    actionPath: '/schedule',
  },
];

// 模擬輪詢期間「新到」的系統通知：到期後才釋出，讓未讀數在使用中跳動。
const pendingInjections: { releaseAt: number; notification: SystemNotification }[] = [
  {
    releaseAt: Date.now() + 18_000,
    notification: {
      id: 'n_inject_1',
      kind: 'success',
      title: 'AI 訓練建議已就緒',
      body: '根據你最近的訓練資料，教練給了 3 點調整建議。',
      read: false,
      createdAt: '',
      actionPath: '/exercises',
    },
  },
];

const clone = (list: SystemNotification[]): SystemNotification[] => list.map((item) => ({ ...item }));

const releaseDue = () => {
  const now = Date.now();
  for (let index = pendingInjections.length - 1; index >= 0; index -= 1) {
    if (pendingInjections[index].releaseAt <= now) {
      const { notification } = pendingInjections.splice(index, 1)[0];
      store = [{ ...notification, createdAt: new Date().toISOString() }, ...store];
    }
  }
};

// TODO: 換成 apiFetch('/api/notifications', { schema: z.array(systemNotificationSchema) })
export const mockGetNotifications = async (): Promise<SystemNotification[]> => {
  await delay(250);
  releaseDue();
  return clone(store);
};

// TODO: 換成 apiFetch('/api/notifications/[id]/read', { method: 'PATCH' })
export const mockMarkNotificationRead = async (id: string): Promise<void> => {
  await delay(150);
  store = store.map((item) => (item.id === id ? { ...item, read: true } : item));
};

// TODO: 換成 apiFetch('/api/notifications/read-all', { method: 'PATCH' })
export const mockMarkAllNotificationsRead = async (): Promise<void> => {
  await delay(150);
  store = store.map((item) => ({ ...item, read: true }));
};
