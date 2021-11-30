import type { UserSearchType, EditUserDataType } from '@/pages/admin/data';
import API from '@/services/API.d';
import httpServer from '@/utils/httpServer';

export type UserAuthorityType = {
  roleIds: string[];
  userId: number;
};

export const queryOrderPageList = async (params: any) => {
  return await httpServer.get(API.ORDER_LIST_BY_PAGE, {
    params: {
      // ...params,
      pageNo: params.current,
      pageSize: params.pageSize,
    }
  })
}
//分页获取用户列表
export const queryUserList = async (params: UserSearchType) => {
  return await httpServer.post(API.USER_LIST, {
    data: {
      pageSize: params.pageSize,
      pageNo: params.current,
      username: params.username,
      mobile: params.mobile,
      roleId: params.roleId,
      status: params.status,
    },
  });
};
//根据角色查询当前角色的权限列表及其权限信息
export const queryPermByRoleId = async (params: any) => {
  return await httpServer.get(API.PERM_LIST_BY_ROLE + '/' + params.roleId);
};
export const queryPermAllData = async () => {
  return await httpServer.get(API.GET_PERM_LIST_ALL);
};
//根据角色查询用户列表
export const queryUserByRoleId = async (params: any) => {
  return await httpServer.get(API.USER_LIST_BY_ROLE, {
    params: {
      pageSize: params.pageSize,
      pageNo: params.current,
      roleId: params.roleId,
    },
  });
};

export const queryUserNotBindWxList = async (params: UserSearchType) => {
  return await httpServer.get(API.USER_NOT_BIND_WX, {
    params: {
      pageSize: params.pageSize,
      pageNo: params.current,
      username: params.username,
      // bindFlag: params.bindFlag,
    },
  });
};
export const addUser = async (params: EditUserDataType) => {
  return httpServer.post(API.USER_ADD, { data: params });
};
export const editUser = async (params: EditUserDataType) => {
  return httpServer.post(API.USER_EDIT, { data: params });
};
export const editUserPassword = async (params: any) => {
  return httpServer.post(API.USER_EDIT_PWD, { data: params });
};
// 授权信息添加 修改用户角色
export async function saveUserAuthority (params: UserAuthorityType) {
  // return httpServer.post(API.USER_AUTHORITY, { data: params });
  return httpServer.post(API.USER_BIND_ROLE_EDIT, { data: params });
}
export const deleteUser = async (id: string) => {
  return httpServer.get(`${API.USER_DELETE}/${id}`);
};
// 设置用户状态
export const statusUser = async (id: string) => {
  return httpServer.post(API.USER_STATUS, {
    data: { id },
  });
};
// 获取用户角色
export const getUserRoleId = async (id: string) => {
  return await httpServer.get(`${API.USER_ROLE_ID}/${id}`);
};