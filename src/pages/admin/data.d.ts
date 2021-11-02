export type UserListDataType = {
  createTime?: string;
  deptId?: number;
  email: string;
  id?: number;
  mobile: string;
  realname?: string;
  status?: string;
  username: string;
}
export const searchBindFlag = {
  0: { text: "所有", status: 'Default' },
  1: { text: "已绑定微信管理员", status: 'Default' },
  2: { text: "未绑定微信管理员", status: 'Processing' }
}
export type PageDataType = {
  current: number;
  pageSize: number;
}
export type UserSearchType = {
  username?: string;// 用户名
  bindFlag?: number;// 范围
} & PageDataType
export type EditUserDataType = {
  email: string,
  mobile: string,
  password?: string,
  realname: string,
  roleIds?: number[],
  username?: string,
  id?: number
}

export type DictionaryDataType = {
  id?: number,
  parentId: number,
  name: string,
  remark: string,
  type: string,
  typeName: string,
  parentPath: string,
  parentPathName: string
}