import type { PartSearchType, PartSaveDataType } from './data.d';
import API from '@/services/API.d'
import httpServer from '@/utils/httpServer'

export const queryPartList = async (params: PartSearchType) => {
  return await httpServer.get(API.PART_LIST, {
    params: {
      pageSize: params.pageSize,
      pageNo: params.current,
      name: params.name,
      model: params.model,
      type: params.type
    }
  });
}
export const savePart = async (params: PartSaveDataType) => {
  return httpServer.post(API.PART_SAVE, { data: params });
}

export const deletePart = async (id: string) => {
  return httpServer.post(`${API.PART_DELETE}/${id}`)
}