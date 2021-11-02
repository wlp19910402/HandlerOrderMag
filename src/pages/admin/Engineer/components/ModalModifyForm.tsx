/**
 * 单位列表 编辑 和 新增
 */
import React, { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { saveCompany } from '@/pages/archive/Company/service';
import type { CompanySaveDataType } from '@/pages/archive/Company/data.d';
import { message } from 'antd'
type ModalModifyFormDataProps = {
  createModalVisible: boolean;
  handleModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  actionRef: React.MutableRefObject<ActionType | undefined>;
  currentRow: CompanySaveDataType | undefined;
}
const ModalModifyForm: React.FC<ModalModifyFormDataProps> = (props) => {
  const { createModalVisible, handleModalVisible, actionRef, currentRow } = props
  const submitForm = async (value: CompanySaveDataType) => {
    let params = currentRow?.id !== undefined ? { ...value, id: currentRow.id } : value;
    const response = await saveCompany({
      ...params,
    })
    if (!response) return
    actionRef.current && actionRef.current.reload();
    handleModalVisible(false);
    message.success(`${currentRow?.id !== undefined ? '修改' : '添加'}成功`);
  }
  const formRef = useRef<any | null>(null);
  return (
    <ModalForm
      modalProps={ {
        maskClosable: false,
        okText: "保存"
      } }
      title={ currentRow?.id !== undefined ? "单位编辑" : "单位新增" }
      width="600px"
      visible={ createModalVisible }
      onVisibleChange={ handleModalVisible }
      onFinish={ async (value: any) => {
        await submitForm(value)
      } }
      labelCol={ { span: 4 } }
      layout="horizontal"
      formRef={ formRef }
    >
      <ProFormText
        rules={ [
          {
            required: true,
            message: "请输入单位名称！"
          },
        ] }
        label="单位名称"
        name="company"
        placeholder="请输入单位名称"
        initialValue={ currentRow?.company }
      />
      <ProFormText
        rules={ [
          { required: true, message: "请输入联系电话！" },
          { pattern: /^1\d{10}$/, message: "请输入正确的手机号" }
        ] }
        label="联系电话"
        name="contactMobile"
        placeholder="请输入联系电话"
        initialValue={ currentRow?.contactMobile }
      />
      <ProFormText
        rules={ [
          {
            required: true,
            message: "请输入联系人！"
          },
        ] }
        label="联系人"
        name="contactUser"
        placeholder="请输入联系人"
        initialValue={ currentRow?.contactUser }
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
      />
    </ModalForm >
  )
}

export default ModalModifyForm;