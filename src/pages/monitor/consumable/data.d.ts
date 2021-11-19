
import { PartListDataType } from '@/pages/device/Part/data.d'
import { ConsumableListDataType } from '@/pages/device/Consumable/data.d'
// 设备档案管理查询搜索的
export type PageDataType = {
  current: number;
  pageSize: number;
}
export type PortfolioConsumableSearchType = {
  portfolioNo?: string;//档案编号
  model?: string;//设备型号
  type?: string;//设备类型
  brand?: string;//设备品牌
  name?: string;
  companyName?: string;//单位名称
  deviceName?: string;//设备名称
  consumableModel?: string;//耗材型号
  consumableName?: string;//耗材名称
  consumableType?: string;//耗材类型
  expirationEntTime?: string;//到期时间2
  expirationStartTime?: any;//到期时间1
} & PageDataType

// 设备列表详情
export type PortfolioConsumableListDataType = {
  brandName: string;//品牌名称
  companyName: string;//公司名称
  consumableId: number;//耗材id
  consumableModelName: string;//耗材型号名称
  consumableName: string;//耗材名称
  consumableNo: string;//耗材编号
  consumableTypeName: string;//耗材类型名称
  deviceName: string;//设备名称
  expirationTime: string;//到期时间
  id: number;//档案耗材id
  modelName: string;//型号
  portfolioId: number;//档案id
  portfolioNo: number;//档案编号
  replacementCycle: string;//更换周期
  replacementTime: string;//实际更换时间
  typeName: string;//设备类型名称
}


/**
 * 快捷创建工单的参数
 */
export type QuickCreateWorkOrderDataType = {
  orderType: string,
  portfolioId: number,
  workDescription: string
}