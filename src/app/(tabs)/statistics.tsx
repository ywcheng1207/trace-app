import { useTranslation } from 'react-i18next';

import { FeaturePlaceholder } from '@/components/feature-placeholder';

const StatisticsScreen = () => {
  const { t } = useTranslation('nav');
  return <FeaturePlaceholder title={t('statistics')} />;
};

export default StatisticsScreen;
