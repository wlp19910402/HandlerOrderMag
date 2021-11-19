import { PageDataType } from '../data.d'

// 耗材管理查询搜索的
export type ConsumableSearchType = {
  model?: string;//耗材型号
  name?: string;//耗材名称
  type?: string;//备件类型
} & PageDataType
// 耗材保存
export type ConsumableSaveDataType = {
  description: string;
  id?: number;
  imgUrls: string[];// 图片
  model: string;
  name: string;// 名称
  type: string;
  modelName: string;
  typeName: string;
}
// 耗材详情
export type ConsumableListDataType = {
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

