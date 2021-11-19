import type { EngineerSearchType } from './data';
import API from '@/services/API.d'
import httpServer from '@/utils/httpServer'

export const queryList = async (params: EngineerSearchType) => {
  return await httpServer.get(API.ENGINEER_LIST, {
    params: {
      pageSize: params.pageSize,
      pageNo: params.current,
      mobile: params.mobile,
      realname: params.realname
    }
  });
}
// export const saveCompany = async (params: CompanySaveDataType) => {
//   return httpServer.post(API.COMPANY_SAVE, { data: params });
// }

// export const deleteCompany = async (id: string) => {
//   return httpServer.post(`${API.COMPANY_DELETE}/${id}`)
// }

// export const findCompanyByName = async (name: string = "") => {
//   return httpServer.get(API.COMPANY_FIND_BY_NAME, { params: { name: name } })
// }