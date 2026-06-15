import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { ScreenContainer } from '@/components/ui/screen-container';

type FeaturePlaceholderProps = {
  title: string;
};

export const FeaturePlaceholder = ({ title }: FeaturePlaceholderProps) => {
  const { t } = useTranslation('common');

  return (
    <ScreenContainer>
      <PageHeader title={title} />
      <EmptyState title={t('comingSoon')} description={t('comingSoonDesc')} />
    </ScreenContainer>
  );
};
