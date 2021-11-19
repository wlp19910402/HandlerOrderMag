import API from '@/services/API.d'
import httpServer from '@/utils/httpServer'

// 获取用户角色
export const getCodeImage = async () => {
  return await httpServer.get(`${API.HANDLER_ORDER_CODE}`)
}