import { useMutation, useQuery } from '@tanstack/react-query';

import {
  mockCreateTemplate,
  mockDeleteTemplate,
  mockListTemplates,
} from '@/features/training-templates/api/mock';
import { CreateTemplateInput } from '@/features/training-templates/api/schemas';
import { queryClient } from '@/lib/query/query-client';
import { QUERY_KEYS } from '@/lib/query/query-keys';

const invalidateTemplates = () => {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trainingTemplates() });
};

export const useTrainingTemplates = () => {
  // TODO: 換成 apiFetch('/api/training-templates', { schema })
  return useQuery({
    queryKey: QUERY_KEYS.trainingTemplates(),
    queryFn: () => mockListTemplates(),
    staleTime: 1000 * 60,
  });
};

export const useCreateTemplate = () => {
  return useMutation({
    mutationFn: (input: CreateTemplateInput) => mockCreateTemplate(input),
    onSuccess: invalidateTemplates,
  });
};

export const useDeleteTemplate = () => {
  return useMutation({
    mutationFn: (id: string) => mockDeleteTemplate(id),
    onSuccess: invalidateTemplates,
  });
};
