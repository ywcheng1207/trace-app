import { ExerciseVideo } from '@/features/exercises/api/schemas';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Seed videos keyed loosely to the seeded exercises. Local mock only; real data
// will come from the backend (// TODO: apiFetch).
const SEED_VIDEOS: ExerciseVideo[] = [
  {
    id: 'vid_seed_1',
    exerciseId: 'ex_seed_1',
    url: 'https://videos.trace.app/demo/bench-press-2026-06-10.mp4',
    posterUrl: null,
    date: '2026-06-10',
    title: '85kg x 5 工作組',
    hasAiAnalysis: true,
    aiResult: {
      analyzedAt: '2026-06-10T09:12:00.000Z',
      summary: '下放軌跡穩定，鎖定點略微聳肩；建議收緊肩胛、放慢離心至 2 秒。',
      metrics: [
        { label: '姿勢評分', value: '82 / 100' },
        { label: '節奏穩定性', value: '良好' },
        { label: '左右對稱', value: '輕微右偏' },
      ],
    },
  },
  {
    id: 'vid_seed_2',
    exerciseId: 'ex_seed_1',
    url: 'https://videos.trace.app/demo/bench-press-2026-06-03.mp4',
    posterUrl: null,
    date: '2026-06-03',
    title: '80kg x 6',
    hasAiAnalysis: false,
    aiResult: null,
  },
  {
    id: 'vid_seed_3',
    exerciseId: 'ex_seed_1',
    url: 'https://videos.trace.app/demo/bench-press-2026-05-20.mp4',
    posterUrl: null,
    date: '2026-05-20',
    title: null,
    hasAiAnalysis: true,
    aiResult: {
      analyzedAt: '2026-05-20T18:40:00.000Z',
      summary: '起槓位置偏高，桿路前移；建議起始對齊肩線、保持手腕中立。',
      metrics: [
        { label: '姿勢評分', value: '76 / 100' },
        { label: '桿路偏移', value: '中等' },
      ],
    },
  },
];

// TODO: 換成 apiFetch(`/api/exercises/${exerciseId}/videos?start=...&end=...`, { schema })
export const mockListExerciseVideos = async (
  exerciseId: string,
  start: string,
  end: string,
): Promise<ExerciseVideo[]> => {
  await delay(300);
  return SEED_VIDEOS.filter(
    (video) => video.exerciseId === exerciseId && video.date >= start && video.date <= end,
  ).sort((a, b) => (a.date < b.date ? 1 : -1));
};
