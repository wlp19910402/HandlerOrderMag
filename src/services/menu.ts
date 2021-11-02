import type { MenuDataType } from '@/pages/admin/Menu/data.d';
import API from '@/services/API.d'
import httpServer from '@/utils/httpServer'

export const queryMenuTree = async () => {
  return await httpServer.post(API.MENU_TREE);
}
export const saveMenu = async (params: MenuDataType) => {
  return await httpServer.post(API.MENU_SAVE, { data: params });
}
export const queryCurrentMenu = async () => {
  return await httpServer.post(API.MENU_CURRENT_TREE);
}

export const fetchDelMenu = async (id: string) => {
  return await httpServer.post(`${API.MENU_DELETE  }/${  id}`);
}