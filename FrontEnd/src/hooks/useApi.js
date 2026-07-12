import { useApiMode } from '../context/ApiContext';
import { restApi } from '../services/restApi';
import { graphqlApi } from '../services/graphqlApi';

export function useApi() {
  const { apiMode } = useApiMode();
  return apiMode === 'REST' ? restApi : graphqlApi;
}
