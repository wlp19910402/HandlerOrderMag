// 工程师管理查询搜索的
export type EngineerSearchType = {
  current: number;
  pageSize: number;
  mobile?: string;// 工程手机号
  realname?: string;// 工程师姓名
  // roleName?: string;// 工程师角色: role_engineer 微信工程师,可用值:role_engineer
  status?: number;// 状态：0不可用，1可用
}

// 工程师列表
export type EngineerListDataType = {
  mobile: string;// 工程手机号
  realname: string;// 工程师姓名
  id: number;// 状态：0不可用，1可用
}
//工程状态的值
export const ENGINNER_STATUS = {
  OFF: 0,//不可用
  ON: 1  //
}
//工程师的状态
export const engineerStatusEnum = {
  0: { text: "不可用" },
  1: { text: "可用" }
}

