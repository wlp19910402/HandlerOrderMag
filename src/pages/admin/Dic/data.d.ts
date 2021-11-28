export type DicDataType = {
  id?: number; //字典id
  name: string; // 角色名称
  parentId?: number; // 字典父级iD
  type?: string; //字典类型
  status?: number; //0启用状态，1是禁用
};
export type PageDataType = {
  current: number;
  pageSize: number;
};
/**
 * 品类=category
 * 品牌=brand
 * 型号=model
 * 订单来源=order_resource
 * 服务类型=service_type
 * 服务方式=service_mode
 */
