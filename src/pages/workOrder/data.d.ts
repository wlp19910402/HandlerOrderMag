import { RecordPartsDataType, RecordConsumableDataType, ConsumableListDataType, PortfolioListDataType } from '@/pages/archive/portfolio/data.d'
export type PageDataType = {
  current: number;
  pageSize: number;
}
export interface OrderTypeType {
  company: string;
  customerMobile: string;
  customerName: string;
  imgUrls: string[];
  orderType: "az" | "wx" | "xj" | "jd";
  portfolioId?: number;//档案id
  workDescription: string;
}
export const orderTypeData = [
  { label: "维修工单", value: "wx", listPath: "/workOrder/maintain" },
  { label: "巡检工单", value: "xj", listPath: "/workOrder/patrol" },
  { label: "安装工单", value: "az", listPath: "/workOrder/install" },
  // { label: "建档工单", value: "jd" }
]
export const orderTypeMatchInfo = (val) => orderTypeData.find(item => item.value === val)
export const orderTypeEnum = {
  wx: "维修工单",
  xj: "巡检工单",
  az: "安装工单",
  // jd: "建档工单"
}
export const orderStatusData = [
  { label: "未派单", value: "wpd", color: "gray", textType: "warning" },
  { label: "派单", value: "pd", color: "blue", textType: "secondary" },
  { label: "接单", value: "jd", color: "blue", textType: "secondary" },
  { label: "转单", value: "zd", color: "blue", textType: "secondary" },
  { label: "结单", value: "wc", color: "green", textType: "success" },
  { label: "已撤单", value: "cancel", color: "red", textType: "danger" }
]

export const orderStatusEnum = {
  wpd: { text: "未派单", status: 'Default' },
  pd: { text: "派单", status: 'Default' },
  jd: { text: "接单", status: 'Processing' },
  zd: { text: "转单", status: 'Processing' },
  wc: { text: "结单", status: 'Success' },
  cancel: { text: "已撤单", status: 'Error' }
}
export interface OrderListSearchType extends PageDataType {
  company?: string;//报单单位
  createTimeEnd?: string;//创建时间2
  createTimeStart?: string;//创建时间1
  customerMobile?: string;//客户电话
  customerName?: string;//客户姓名
  engineerName?: string;//工程师姓名
  orderNo: string;//工单编号
  orderType?: string;//工单类型
  receivingTimeEnd?: string;//接单时间2
  receivingTimeStart?: string;//接单时间1
  sourceType?: string;//工单来源
  status?: string;//工单状态
}
export interface OrderListType extends OrderTypeType {
  createTime: string;
  createUser: string;
  createUserName: string;
  customerMobile: string;
  customerName: string;
  deviceName: string;
  deviceType: string;
  engineerId: number;
  engineerName: string;
  id: number;
  orderImgUrls: string[];
  orderNo: string;//工单编号
  orderType: string;
  portfolioId: string;//档案id
  supporterNames: string;
  supporterIds: number;
  receivingTime: string;
  sourceType: string;
  status: string;
  workDescription: string;
}
//更改的耗材列表数据类型
export interface WorkConsumablesDataType {
  baseInfo: ConsumableListDataType[]
  createTime: string;
  createUser: string;
  reateUsername: string;//创建人名称
  id: number;
  expirationTime: string;//到期时间
  oldExpirationTime: string;//旧的到期时间
  orderId: number;//工单id
  pcId: number;//档案耗材id
  portfolioId: number;//档案id
  replacementCycle: string;//更换周期
}
//工单详情页面
export interface WorkOrderInfoDataType extends OrderListType {
  consumables: RecordConsumableDataType[],//档案耗材信息
  parts: RecordPartsDataType[];//档案备件信息
  portfolio: PortfolioListDataType;//档案信息
  subImgUrls: string[];//结单图片
  subRemark: string;//结单备注
  subTime: string;//结单时间
  subUser: string;//结单人id
  subUsername: String;//结单人姓名
  workConsumables: WorkConsumablesDataType[];//更换耗材
  workDescription: string;//工单描述
}

//工单操作日志
export interface WorkOrderWrokLogDataType {
  createTime: string;//操作时间
  createUser: string;//操作人id
  createUsername: string;//操作人姓名
  id: number;//日志id
  operationLog: string;//操作日志
  operationType: string;//操作类型：pd 派单，jd接单，zd 转单，wx 维修，wc 完成,可用值:pd,jd,zd,wx,wc,cancel
  orderId: number;//工单ID
}