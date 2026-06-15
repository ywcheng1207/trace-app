import { Redirect } from 'expo-router';

import { useAppSelector } from '@/store/hooks';

export default function Index() {
  const status = useAppSelector((state) => state.auth.status);

  if (status === 'restoring') return null;

  return <Redirect href={status === 'authenticated' ? '/schedule' : '/login'} />;
}
