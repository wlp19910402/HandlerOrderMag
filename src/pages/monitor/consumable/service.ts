import type { PortfolioConsumableSearchType } from './data.d';
import API from '@/services/API.d'
import httpServer from '@/utils/httpServer'
// import type { ConsumableAddDataType, ConsumableEditDataType, PartEditDataType, PartAddDataType } from './data.d'

export const queryProtfolioList = async (params: PortfolioConsumableSearchType) => {
  return await httpServer.get(API.MONITOR_CONSUMABLE_LIST, {
    params: {
      pageSize: params.pageSize,
      pageNo: params.current,
      portfolioNo: params.portfolioNo,
      model: params.model,
      type: params.type,
      brand: params.brand,
      companyName: params.companyName,
      name: params.name,
      consumableModel: params.consumableModel,
      consumableName: params.consumableName,
      consumableType: params.consumableType,
      expirationEntTime: params.expirationStartTime ? params.expirationStartTime[ 1 ] : undefined,
      expirationStartTime: params.expirationStartTime ? params.expirationStartTime[ 0 ] : undefined
    }
  });
}
export const quickCreateWorkOrder = async (id: any) => {
  return await httpServer.post(API.WORK_ORDER_QUICK_CREATE, {
    data: {
      orderType: 'wx',
      workDescription: '更换耗材',
      portfolioId: id
    }
  });
}