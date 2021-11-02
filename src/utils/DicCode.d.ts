/**
 * 字典类型针对的值，为了进行其他数据进行查询
 */
const DicCode = {
  DEVICE_DIC: "sb_type",// 设备字典
  CONSUMABLE_DIC: "hc_type",//耗材字典
  PART_DIC: "bj_type",//备件字典

  DEVICE_TYPE: "sb_type",//设备类型
  DEVICE_BRAND: "sb_brand",//设备品牌
  DEVICE_MODEL: "sb_model",//设备型号
  CONSUMABLE_TYPE: "hc_type",//耗材类型
  CONSUMABLE_MODEL: "hc_model",//耗材型号
  PART_TYPE: "bj_type",//备件类型
  PART_MODEL: "bj_model",//备件型号
}
export const dicTypeData = [
  { label: "设备字典", value: DicCode.DEVICE_DIC },
  { label: "耗材字典", value: DicCode.CONSUMABLE_DIC },
  { label: "备件字典", value: DicCode.PART_DIC }
]

export const dicClassData = {
  "sb_type": [
    { label: "设备类型", value: DicCode.DEVICE_TYPE },
    { label: "设备品牌", value: DicCode.DEVICE_BRAND },
    { label: "设备型号", value: DicCode.DEVICE_MODEL }
  ],
  "hc_type": [
    { label: "耗材类型", value: DicCode.CONSUMABLE_TYPE },
    { label: "耗材型号", value: DicCode.CONSUMABLE_MODEL }
  ],
  "bj_type": [
    { label: "备件类型", value: DicCode.PART_TYPE },
    { label: "备件型号", value: DicCode.PART_MODEL }
  ],
}

export const matchDicClass = (type: any) => dicClassData[ type ]

export type PageDataDicType = {
  current: number;
  pageSize: number;
  name: string,
  type: string
}
export default DicCode