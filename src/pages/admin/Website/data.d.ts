export type SiteOrderType = {
  asc: true;
  column: string;
};
export type PageDataType = {
  current: number;
  pageSize: number;
};
export type SiteSaveParams = {
  address: string;
  cityCode: string;
  cityName: string; //城市名称
  districtCode: string;
  districtName: string;
  id?: number;
  personLiableMobile: string;
  personLiableName: string;
  provinceCode: string;
  provinceName: string;
  siteName: string;
  streetCode: string;
  streetName: string;
};

export type WebSiteAreaSaveParams = {
  cityCode: string;
  cityName: string; //城市名称
  districtCode: string;
  districtName: string;
  id?: number;
  provinceCode: string;
  provinceName: string;
  siteId: number;
  streetCode: string;
  streetName: string;
};
export type SiteDataType = {
  id?: number;
  address?: string; //详细地址
  cityCode?: string; //城市code
  cityName: string; //城市名称
  districtCode?: string; //区县code
  districtName: string;
  personLiableMobile?: string; //网点责任人电话
  personLiableName?: string; //网点责任人
  provinceCode?: string; //省份code
  provinceName?: string;
  siteName?: string; //网点名称
  siteNo?: string; //网点编号
  status?: number; //状态【1禁用、0=启用】
  streetCode?: string; //街道/社区code
};
export type WebsiteSearchType = {
  orders?: SiteOrderType;
} & SiteDataType &
  PageDataType;
export type WebsiteListDataType = {
  orders?: SiteOrderType[];
  records?: SiteDataType[];
  searchCount?: boolean;
  size?: number;
  total?: number;
  current?: number;
  pages?: number;
};

export type AreaListItmeType = {
  areaCode: string; //行政区代码;
  areaName: string; //行政区名称;
  level: number; //级别【1省级，2市级，3区县级，4街道
  parentCode: string; //上级行政区
};
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
  status?: number; //0:启用、1:禁用、2:待加入、3:审核中、4:审核成功、5:审核失败
  accountAuth?: boolean;
  superAdmin?: boolean; //1: 超级管理员 ；0:普通人员
  roleList?: RoleListType[];
};

export const searchBindFlag = {
  0: { text: '所有', status: 'Default' },
  1: { text: '已绑定微信管理员', status: 'Default' },
  2: { text: '未绑定微信管理员', status: 'Processing' },
};

export type UserSearchType = {
  username?: string; // 用户名
  roleId?: number;
  mobile?: string;
  status?: number;
} & PageDataType;
export type EditUserDataType = {
  mobile: string;
  roleIds: number[];
  siteList: number[];
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
