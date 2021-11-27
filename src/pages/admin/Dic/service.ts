import type { DicDataType } from './data';
import API from '@/services/API.d';
import httpServer from '@/utils/httpServer';

//字典的查询列表
export const queryDicListByType = async (type: string) => {
  return await httpServer.get(API.DIC_LIST_BY_TYPE + '/' + type);
};
export const saveDic = async (params: DicDataType) => {
  return await httpServer.post(API.DIC_SAVE, { data: params });
};
export const updateDicStatus = async (id: number) => {
  return await httpServer.post(API.DIC_UPDATE_STATUS, { data: { id } });
};
export const queryDicListByParentId = async (id: number) => {
  return await httpServer.get(API.DIC_LIST_BY_PARENT_ID + '/' + id);
};
export const deleteDic = async (id: number) => {
  return await httpServer.post(API.DIC_DELETE_BY_ID, { data: { id } });
};
