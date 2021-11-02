import type { PageDataType, DictionaryDataType } from '../data.d';
import API from '@/services/API.d'
import httpServer from '@/utils/httpServer'
import { PageDataDicType } from '@/utils/DicCode.d'

export type UserAuthorityType = {
  "roleIds": string[],
  "userId": number
}
export const queryDictionaryList = async (params: PageDataDicType) => {
  return await httpServer.get(API.DICTIONARY_LIST, {
    params: {
      pageSize: params.pageSize,
      pageNo: params.current,
      name: params.name,
      types: params.type
    }
  });
}
export const saveDictionary = async (params: DictionaryDataType) => {
  return httpServer.post(API.DICTIONARY_SAVE, { data: params });
}
export const deleteDictionary = async (id: string) => {
  return httpServer.post(`${API.DICTIONARY_DELETE}/${id}`)
}

export const queryDictionaryType = async (type: string) => {
  return await httpServer.get(`${API.DICTIONARY_TYPE}/${type}`);
}

//类型查询
export const fetchDicTypeSelect = async (type: string) => {
  try {
    const response = await queryDictionaryType(type)
    if (!response) return []
    return response.data.map((item: any) => ({ label: item.name, value: item.id, parentId: item.parentId, type: item.type }))
  } catch (err) {
    console.log(err)
    return []
  }
}
//id查询
export const queryDictionaryParentId = async (id: any) => {
  try {
    const response = await httpServer.get(`${API.DICTIONARY_PARENT_ID}/${id}`);
    if (!response) return []
    return response.data.map((item: any) => ({ label: item.name, value: item.id, parentId: item.parentId, type: item.type }))
  } catch (err) {
    console.log(err)
    return []
  }
}

export const fetchDicTypeSelectObj = async (type: string) => {
  try {
    const response = await queryDictionaryType(type)
    if (!response) return []
    let obj = {}
    response.data.map((item: any) => ({ label: item.name, value: item.id, parentId: item.parentId, type: item.type })).forEach((item: any) => {
      obj[ item.value ] = item.label
    })
    return obj
  } catch (err) {
    console.log(err)
    return {}
  }
}

export const fetchDicTypeSelectParentIdObj = async (id: any) => {
  try {
    const response = await httpServer.get(`${API.DICTIONARY_PARENT_ID}/${id}`);
    if (!response) return []
    let obj = {}
    response.data.map((item: any) => ({ label: item.name, value: item.id, parentId: item.parentId, type: item.type })).forEach((item: any) => {
      obj[ item.value ] = item.label
    })
    return obj
  } catch (err) {
    console.log(err)
    return {}
  }
}
