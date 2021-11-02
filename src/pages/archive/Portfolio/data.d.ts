import { PageDataType } from '../data.d'
import { PartListDataType } from '@/pages/device/Part/data.d'
import { ConsumableListDataType } from '@/pages/device/Consumable/data.d'
// 设备档案管理查询搜索的
export type PortfolioSearchType = {
  no?: string;//档案编号
  model?: string;//设备型号
  type?: string;//设备类型
  brand?: string;//设备品牌
  companyName?: string;//单位名称
  deviceName?: string;//设备名称
  qrCodde?: string;//二维码编号
} & PageDataType
// 设备档案保存
export type PortfolioSaveDataType = {
  brand?: string;// 品牌
  companyId?: number;//单位id；
  companyName?: string;//单位名称；
  companyNo?: string;
  deviceId?: number;//设备id;
  deviceName?: string;//设备名称
  installLocation?: string;//安装位置
  installTime?: string;//安装时间
  qrCodde?: string;//二维码编号
  warrantyPeriod?: string;//保修周期
  deviceNo?: string;
  id?: number;// 主键
  model?: string;// 设备型号
  type?: string;// 设备类型
}
// 设备列表详情
export type PortfolioListDataType = {
  createTime: string;// 创建日期
  createUser: number;// 创建人
  updateTime: string;// 修改时间
  updateUser: number;// 修改人
  createUsername: string;
  updateUsername: string;
  brandName: string;
  modelName: string;
  typeName: string;// 设备类型
  imgUrls: string[];
  no: string;//档案编号
} & DeviceSaveDataType
export type RecordPartsDataType = {
  baseInfo: PartListDataType[]
  createTime: string;
  createUser: string;
  reateUsername: string;
  id: number;//档案备件id
  portfolioId: number;//档案id
  warrantyPeriod: string;//报修周期
}
export type RecordConsumableDataType = {
  baseInfo: ConsumableListDataType[]
  createTime: string;
  createUser: string;
  reateUsername: string;
  id: number;//档案耗材id
  consumableId: number;//耗材id
  expirationTime: string;
  portfolioId: number;
  replacementCycle: string;
  replacementTime: string;
}
export type PortfolioInfoDataType = {
  consumables: RecordConsumableDataType[],
  parts: RecordPartsDataType[]//档案耗材信息
} & PortfolioListDataType
//档案耗材添加
export type ConsumableAddDataType = {
  consumableId: number,//耗材id
  expirationTime: string,//到期时间
  num: number,//数量
  portfolioId: number,//档案id
  replacementCycle: string,// 更换周期
  replacementTime: string// 安装日期
}
//档案备件添加
export type PartAddDataType = {
  partId: number,//备件id
  num: number,//数量
  portfolioId: number,//档案id
  warrantyPeriod: string,//报修周期
}
//档案耗材编辑
export type ConsumableEditDataType = {
  expirationTime: string;//到期时间
  id: number;//档案耗材id
  replacementCycle: string;//更换周期
  replacementTime: string;//实际更换时间
}
//档案备件编辑
export type PartEditDataType = {
  id: number;//档案备件id
  warrantyPeriod: string;//更换周期
}
