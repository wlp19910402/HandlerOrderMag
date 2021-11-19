// 工程师管理查询搜索的
export type EngineerSearchType = {
  current: number;
  pageSize: number;
  mobile?: string;// 工程手机号
  realname?: string;// 工程师姓名
  // roleName?: string;// 工程师角色: role_engineer 微信工程师,可用值:role_engineer
  status?: number;// 状态：0不可用，1可用
  onlyEngineer?: boolean;
}
export type WxBindAdminType = {
  adminId: number,
  id: number,
  mobile: string,
  realname: string
}
// 工程师列表
export type wxUserListDataType = {
  mobile: string;// 工程手机号
  realname: string;// 工程师姓名
  wxNickname: string;//微信昵称
  createTime: string;//创建时间
  adminUsername: string;//管理员名称
  adminId: number;//管理员id
  id: number;// 状态：0不可用，1可用
}

