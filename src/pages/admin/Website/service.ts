import type {
  UserSearchType,
  WebSiteAreaSaveParams,
  WebsiteSearchType,
  SiteSaveParams,
} from './data';
import API from '@/services/API.d';
import httpServer from '@/utils/httpServer';
//网点列表

//分页获取网点列表
export const queryWebsiteList = async (params: WebsiteSearchType) => {
  return await httpServer.get(API.WEBSITE_LIST_BY_PAGE, {
    params: {
      ...params,
      pageNo: params.current,
    },
  });
};
//
export const upadateWebsiteStatus = async (id: number) => {
  return httpServer.post(API.WEBSITE_UPDATE_STATUS, {
    data: { id },
  });
};

export const getAreaData = async (params: any = 0) => {
  return httpServer.get(API.GET_AREA_DATA, { params: { parentCode: params } });
};
//网点服务区域删除区域
export const deleteAreaByWebsiteId = async (id: number) => {
  return httpServer.post(API.WEBSITE_DELETE_BY_ID, {
    data: { id },
  });
};
//网点服务区域分页列表
export const getAreaDataByWebsite = async (params: any) => {
  return httpServer.get(API.GET_AREA_DATA_BY_WEBSITE, {
    params: { ...params, pageNo: params.current },
  });
};
export const saveWebsite = async (params: SiteSaveParams) => {
  return httpServer.post(API.WEBSITE_SAVE, {
    data: params,
  });
};
//服务区域保存
export const saveWebsiteArea = async (params: WebSiteAreaSaveParams) => {
  return httpServer.post(API.WEBSITE_AREA_SAVE, {
    data: params,
  });
};

//查看网点详情
export const queryWebsiteDetailById = async (id: number) => {
  return await httpServer.get(API.WEBSITE_DETAIL_BY_ID, { params: { id } });
};

//根据网点id查询列表
export const queryUserListBySiteId = async (params: {
  pageSize: number;
  current: number;
  siteId: number;
}) => {
  return await httpServer.get(API.USER_LIST_By_WEBSITE_ID, {
    params: {
      pageSize: params.pageSize,
      pageNo: params.current,
      siteId: params.siteId,
    },
  });
};
