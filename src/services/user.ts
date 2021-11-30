import API from '@/services/API.d';
import httpServer from '@/utils/httpServer';
import localforage from 'localforage';

export type LoginParamsType = {
  username: string;
  password: string;
  imageCode: string;
};
// 登录
export async function fakeAccountLogin (params: LoginParamsType) {
  let formData = new FormData();
  formData.set('username', params.username);
  formData.set('password', params.password);
  formData.set('imageCode', params.imageCode);
  return httpServer.post(API.HANDLER_ORDER_MAG, { data: formData });
  // return httpServer.post(API.USER_LOGIN, { data: params })
}
//获取用户信息
export function fackAccountInfo () {
  return httpServer.get(API.USER_CURRENT);
}
// 根据token刷新token值
export async function fackLogout () {
  return httpServer.post(API.USER_LOGOUT, { data: {} });
}
