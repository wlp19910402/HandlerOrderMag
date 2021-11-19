/**
 * 字典列表 编辑 和 新增
 */
import React, { useRef, useState, useEffect } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea, ProFormRadio } from '@ant-design/pro-form';
import { saveDictionary } from '../service';
import type { DictionaryDataType } from '../../data.d';
import { message, Alert } from 'antd'
import { dicTypeData } from '@/utils/DicCode.d'
import { fetchDicTypeSelect, queryDictionaryParentId } from '@/pages/admin/Dictionary/service'
import CODE, { matchDicClass } from '@/utils/DicCode.d'
import AddSelect from './AddSelect'
export interface OptionProps {
  label: React.ReactNode;
  value: any;
}
type ModalModifyFormDataProps = {
  createModalVisible: boolean;
  handleModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  actionRef: React.MutableRefObject<ActionType | undefined>;
  currentRow: DictionaryDataType | undefined;
}
const ModalModifyForm: React.FC<ModalModifyFormDataProps> = (props) => {
  const { createModalVisible, handleModalVisible, actionRef, currentRow } = props
  const [ setList, handleSetList ] = useState<any>(matchDicClass(CODE.DEVICE_DIC))
  const [ addSelect, handleAddSelect ] = useState<any[]>([])
  const [ nullData, handleNullData ] = useState<any>({ status: false, text: "" })
  const [ currentEditDic, handleCurrentEditDic ] = useState<any>({})
  const submitForm = async (value: DictionaryDataType) => {
    let params = currentRow?.id !== undefined ? { ...value, id: currentRow.id } : value;
    const response = await saveDictionary({ ...params })
    if (!response) return
    if (actionRef.current) {
      actionRef.current.reload();
    }
    handleModalVisible(false);
    message.success(`${currentRow?.id !== undefined ? '修改' : '添加'}成功`);
  }
  const formRef = useRef<any | null>(null)
  useEffect(() => {
    handleNewCode(CODE.DEVICE_DIC)
  }, [])
  const handleNewCode = async (val: any) => {
    let currentSetList = matchDicClass(val)
    await handleSetList(currentSetList)
    currentSetList.length > 0 && formRef.current.setFieldsValue({ type: currentSetList[ 0 ].value })
    currentSetList.length > 0 && handleCurrentEditDic({ typeName: currentSetList[ 0 ].label, type: currentSetList[ 0 ].value })
    handleNullData({ status: false, text: "" })
    dicTypeData.forEach(item => {
      if (item.value === val) {
        formRef.current.setFieldsValue({ "parentId": 0 });
      }
    })
    handleAddSelect([])
  }
  const handleTypeCode = async (val: any) => {
    let valIndex = setList.findIndex((item: any) => item.value === val)
    handleNullData({ status: false, text: "" })
    handleCurrentEditDic({ typeName: setList.find((item: any) => item.value === val).label, type: val })
    formRef.current.setFieldsValue({ type: val, "addSelect-1": null, "addSelect-0": null });
    handleAddSelect([])
    if (valIndex === 0) {
      let parentType = formRef.current.getFieldValue("parentType")
      dicTypeData.forEach(item => {
        if (item.value === parentType) {
          formRef.current.setFieldsValue({ "parentId": 0 });
        }
      })

    } else {
      let arr = [];
      let parentType = formRef.current.getFieldValue("parentType");
      let response = await fetchDicTypeSelect(parentType)
      let label = matchDicClass(parentType)[ 0 ].label
      // if (response.length === 0) {
      //   handleNullData({ status: true, text: `请先设置对应的" ${label} "的值，上级不能为空哦~` })
      //   return
      // }
      arr.push({
        name: "addSelect-0",
        label: label,
        value: response[ 0 ] ? response[ 0 ].value : undefined,
        option: response,
        isControlType: valIndex === 1
      })
      let typeObj: any = response[ 0 ] ? { parentId: response[ 0 ].value } : { parentId: null }
      if (valIndex === 2) {
        let labelNewCode = matchDicClass(parentType)[ 1 ].label
        let res = response[ 0 ] ? await queryDictionaryParentId(response[ 0 ].value) : []
        // if (res.length === 0) {
        //   handleNullData({ status: true, text: `请先设置对应的" ${labelNewCode} "的值，上级不能为空哦~` })
        //   return
        // }
        handleNullData({ status: false, text: "" })
        arr.push({
          name: `addSelect-1`,
          label: labelNewCode,
          option: res,
          value: res[ 0 ] ? res[ 0 ].value : undefined,
          isControlType: valIndex === 2
        })
        typeObj = res[ 0 ] ?
          {
            parentId: res[ 0 ].value
          } : {
            parentId: null
          }
      }
      formRef.current.setFieldsValue(typeObj);
      handleAddSelect(arr)
    }
  }
  return (
    <ModalForm
      modalProps={ {
        maskClosable: false,
        okText: "保存"
      } }
      submitter={ {
        submitButtonProps: {
          disabled: nullData.status
        }
      } }
      title={ currentRow?.id !== undefined ? "字典编辑" : "字典新增" }
      width="600px"
      visible={ createModalVisible }
      onVisibleChange={ handleModalVisible }
      onFinish={ async (value: any) => {
        await submitForm(value)
      } }
      labelCol={ { span: 6 } }
      layout="horizontal"
      formRef={ formRef }
    >
      {currentRow?.id === undefined && (
        <>
          <ProFormRadio.Group
            name="parentType"
            label="选择字典"
            radioType="button"
            options={ [
              ...dicTypeData
            ] }
            initialValue={ CODE.DEVICE_DIC }
            normalize={ (val, prevValue, all) => {
              handleNewCode(val)
              return val
            } }
          />
          <ProFormRadio.Group
            name="type"
            label="选择类型"
            radioType="button"
            options={ [
              ...setList
            ] }
            initialValue={ CODE.DEVICE_DIC }
            normalize={ (val, prevValue, all) => {
              handleTypeCode(val)
              return val
            } }
          />
          {!nullData.status && addSelect.length > 0 && addSelect.map((item: any, index: number) => {
            return <AddSelect
              key={ index }
              name={ item.name }
              label={ item.label }
              value={ item.value }
              option={ item.option }
              formRefCurrent={ formRef.current }
              isControlType={ item.isControlType }
              addSelect={ addSelect }
              handleAddSelect={ handleAddSelect }
            />
          }) }
        </>
      ) }
      {nullData.status &&
        <Alert
          style={ { fontSize: "12px", marginTop: "20px" } }
          message={ nullData.text } type="warning" showIcon />
      }
      {!nullData.status && <>
        <ProFormText
          label="父级id"
          name={ "parentId" }
          placeholder="请输入父级id"
          initialValue={ currentRow?.parentId }
          disabled
          hidden
        />
        <ProFormText
          rules={ [
            {
              required: true,
              message: `请输入${currentEditDic.typeName}`
            },
          ] }
          label={ currentEditDic.typeName }
          name="name"
          placeholder={ `请输入${currentEditDic.typeName}` }
          initialValue={ currentRow?.name }
        />
        <ProFormTextArea
          name="remark"
          label="备注"
          placeholder="请输入备注"
          initialValue={ currentRow?.remark }
          rules={ [
            {
              max: 100,
              message: `内容最多支持100个字符!`,
            },
          ] }
        /></> }
    </ModalForm >
  )
}

export default ModalModifyForm;