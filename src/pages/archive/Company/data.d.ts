import { PageDataType } from '../data.d'
// 单位管理查询搜索的
export type CompanySearchType = {
  company?: string;// 单位名称
  contactMobile?: string;// 联系电话
  contactUser?: string;// 联系人
  no?: string;// 单位编号
} & PageDataType
// 单位保存
export type CompanySaveDataType = {
  company: string;
  id?: number;
  contactMobile: string;// 图片
  contactUser: string;// 联系人
  remark: string;//备注
}
// 单位详情
export type CompanyListDataType = {
  createTime: string;// 创建日期
  createUser: number;// 创建人
  updateTime: string;// 修改时间
  updateUser: number;// 修改人
  createUsername: string;
  no: string;// 单位编号
  updateUsername: string;
} & CompanySaveDataType

