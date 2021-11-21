export type RoleListType = {
  id: number;
  name: string;
};
export type UserListDataType = {
  gender?: number;
  idCode?: string;
  email: string;
  id?: number;
  mobile: string;
  roleName?: string;
  status?: string;
  username: string;
  dataStatus?: number; //0:启用、1:禁用、2:待加入、3:审核中、4:审核成功、5:审核失败
  accountAuth?: number;
  superAdmin?: number; //0: 超级管理员 ；1:普通人员
  roleList?: RoleListType[];
};
export const searchBindFlag = {
  0: { text: '所有', status: 'Default' },
  1: { text: '已绑定微信管理员', status: 'Default' },
  2: { text: '未绑定微信管理员', status: 'Processing' },
};
export type PageDataType = {
  current: number;
  pageSize: number;
};
export type UserSearchType = {
  username?: string; // 用户名
  roleId?: number;
  mobile?: string;
  dataStatus?: number;
} & PageDataType;
export type EditUserDataType = {
  // email: string;
  mobile: string;
  // password?: string;
  // realname: string;
  roleIds: number[];
  // username?: string;
  id?: number;
};

export type DictionaryDataType = {
  id?: number;
  parentId: number;
  name: string;
  remark: string;
  type: string;
  typeName: string;
  parentPath: string;
  parentPathName: string;
};
