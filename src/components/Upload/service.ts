import API from '@/services/API.d'
import httpServer from '@/utils/httpServer'
import React from 'react'
type UploadOssSignParamsType = {
  fileMd5?: string;
  originalName: string;
  share?: boolean;
  target?: string;
}
const defaultUploadOssSign: UploadOssSignParamsType = {
  fileMd5: "",
  originalName: "",
  share: true,
  target: ""
}
export type OssToken = {
  accessKeyId: string;
  accessKeySecret: string;
  stsToken: string;
  bucket: string;
  region: string;
  // uploadFullPath: string;
}
export const uploadOssSign = async (params: UploadOssSignParamsType) => {
  return httpServer.post(`${API.UPLOAD_OSS_SIGN}`, { data: { ...defaultUploadOssSign, ...params } });
}
// 获取sts签名
export const uploadStsSign = async (params: UploadOssSignParamsType) => {
  return httpServer.post(API.UPLOAD_STS_SIGN, { data: { ...defaultUploadOssSign, ...params } });
}

export const setUploadUrlImage = async (uploadImages: string[], setUploadImages: (value: React.SetStateAction<string[]>) => void, url?: string, index?: number) => {
  let tmp = uploadImages
  if (url !== '' && !url) {
    tmp = tmp.filter((item: any) => item !== '');
    if (tmp.length < 6) {
      tmp.push("")
    }
  } else {
    tmp = tmp.map((item: any, idx: number) => {
      return idx === index ? url : item
    }).filter((item: any) => item !== '');
    if (tmp.length < 6) {
      tmp.push("")
    }
  }
  await setUploadImages([])
  setUploadImages(tmp)
}