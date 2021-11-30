export interface OrderListItem {
  createTime: string;//创建时间
  customAddress: string;//地址
  finishTime: string;//完成时间
  id: number | string;//工单id标识
  orderNo: string;//工单编号
  orderOldNo: string;//第三方工单编号
  orderResourceName: string;//工单来源名称
  orderTime: string;//工单时间
  sendOrderTime: string;//派单时间
  serverSkuName: string; //服务sku名称
  serviceModelName: string; //服务方式名称
  serviceNum: number; //服务次数
  serviceTypeName: string;//服务类型名称
  siteName: string;//网点名称
  statusName: string;//工单状态名称
  subscribeServiceTimeRange: string;//履约时间（上门）
  warnColor: string;//报警颜色
}
type OrderType = {
  asc: boolean;
  column: string;
}
export interface OrderListSearch {
  pageNo?: number;
  pageSize?: number;
  orders?: OrderType[];
}