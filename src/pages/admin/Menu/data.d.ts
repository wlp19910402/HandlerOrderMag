export type MenuDataType = {
  id?: number;// 主键id
  parentId?: number;// 父菜单ID，目录为0
  name?: string;// 菜单名称
  url?: string;// 菜单URL【前端路由】#表示目录
  icon?: string;// 图标
  type?: TypeFormType;// 类型 0：目录 1：菜单 2：按钮
  perms?: string;// 授权(多个用逗号分隔，如：user:list,user:create)【api端的授权】
  orderNum: number;// 排序
  children?: MenuDataType[]
}
export type TypeFormType = 0 | 1 | 2 | undefined

export const menuDefault: MenuDataType = {
  parentId: 0,
  name: "",
  url: "#",
  orderNum: 0,
  icon: "",
  perms: "",
  type: 0,
}