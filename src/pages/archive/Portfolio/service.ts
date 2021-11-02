import type { PortfolioSearchType, PortfolioSaveDataType } from './data.d';
import API from '@/services/API.d'
import httpServer from '@/utils/httpServer'
import type { ConsumableAddDataType, ConsumableEditDataType, PartEditDataType, PartAddDataType } from './data.d'

export const queryProtfolioList = async (params: PortfolioSearchType) => {
  return await httpServer.get(API.PORTFOLIO_LIST, {
    params: {
      pageSize: params.pageSize,
      pageNo: params.current,
      no: params.no,
      model: params.model,
      type: params.type,
      brand: params.brand,
      companyName: params.companyName,
      deviceName: params.deviceName,
      qrCodde: params.qrCodde
    }
  });
}
export const saveProtfolio = async (params: PortfolioSaveDataType) => {
  return httpServer.post(API.PORTFOLIO_SAVE, { data: params });
}

export const deleteProtfolio = async (id: React.Key) => {
  return httpServer.post(`${API.PORTFOLIO_DELETE}/${id}`)
}

export const infoProtfolio = async (id: React.Key) => {
  return httpServer.get(`${API.PORTFOLIO_INFO}/${id}`)
}
//档案耗材新增
export const addConsumableProtfolio = async (params: ConsumableAddDataType[]) => {
  return httpServer.post(API.PORTFOLIO_ADD_CONSUMABLE, { data: params });
}
//档案耗材列表
export const queryProtfolioConsumableList = async (id: React.Key) => {
  return httpServer.get(`${API.PORTFOLIO_LIST_CONSUMABLE}/${id}`)
}
//档案耗材编辑
export const updateProtfolioConsumable = async (params: ConsumableEditDataType) => {
  return httpServer.post(API.PORTFOLIO_UPDATE_CONSUMABLE, { data: params });
}
//档案耗材删除
export const deleteProtfolioConsumable = async (id: React.Key) => {
  return httpServer.post(`${API.PORTFOLIO_DELETE_CONSUMABLE}/${id}`)
}
//档案备件新增
export const addProtfolioPart = async (params: PartAddDataType[]) => {
  return httpServer.post(API.PORTFOLIO_ADD_PART, { data: params });
}
//档案备件列表
export const queryProtfolioPartList = async (id: React.Key) => {
  return httpServer.get(`${API.PORTFOLIO_LIST_PART}/${id}`)
}
//档案备件编辑
export const updateProtfolioPart = async (params: PartEditDataType) => {
  return httpServer.post(API.PORTFOLIO_UPDATE_PART, { data: params });
}
//档案备件删除
export const deleteProtfolioPart = async (id: React.Key) => {
  return httpServer.post(`${API.PORTFOLIO_DELETE_PART}/${id}`)
}