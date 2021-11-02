import { PageDataType } from '../data.d'
// 设备管理查询搜索的
export type DeviceSearchType = {
  name?: string;
  no?: string;
  model?: string;
  type?: string;
  brand?: string;//品牌
} & PageDataType
// 设备保存
export type DeviceSaveDataType = {
  brand: string;// 品牌
  description: string;// 设备描述
  id?: number;// 主键
  imgUrls: string[];// 图片
  name: string;// 设备名称
  model: string;// 规格
  type: string;// 设备类型
  typeName: string;
  modelName: string;
  brandName: string;
}
// 设备详情
export type DeviceListDataType = {
  createTime: string;// 创建日期
  createUser: number;// 创建人
  updateTime: string;// 修改时间
  updateUser: number;// 修改人
  createUsername: string;
  updateUsername: string;
  brandName: string;
  modelName: string;
  no: string;
  deviceNo?: string;
  typeName: string;// 设备类型
} & DeviceSaveDataType