import type { ConsumableSearchType, ConsumableSaveDataType } from './data.d';
import API from '@/services/API.d'
import httpServer from '@/utils/httpServer'

export const queryConsumableList = async (params: ConsumableSearchType) => {
  return await httpServer.get(API.COMSUMABLE_LIST, {
    params: {
      pageSize: params.pageSize,
      pageNo: params.current,
      name: params.name,
      model: params.model,
      type: params.type
    }
  });
}
export const saveConsumable = async (params: ConsumableSaveDataType) => {
  return httpServer.post(API.COMSUMABLE_SAVE, { data: params });
}

export const deleteConsumable = async (id: string) => {
  return httpServer.post(`${API.COMSUMABLE_DELETE}/${id}`)
}