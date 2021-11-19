import { PageDataType } from '../data.d'

// 备件管理查询搜索的
export type PartSearchType = {
  model?: string;//耗材型号
  name?: string;//耗材名称
  type?: string;//备件类型
} & PageDataType
// 备件保存
export type PartSaveDataType = {
  description: string;
  id?: number;
  imgUrls: string[];// 图片
  model: string;
  name: string;// 名称
  type: string;
  typeName: string;
  modelName: string;
}
// 备件详情
export type PartListDataType = {
  createTime: string;// 创建日期
  createUser: number;// 创建人
  updateTime: string;// 修改时间
  updateUser: number;// 修改人
  createUsername: string;
  updateUsername: string;
  no: string;
  modelName: string;
  typeName: string;
} & ConsumableSaveDataType

