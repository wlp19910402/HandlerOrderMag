/**
 * 角色 编辑 和 新增
 */
import React from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { editRole, createRole } from '../service';
import type { RoleDataType } from '../data.d';
import { message } from 'antd'

type ModalModifyFormDataProps = {
  createModalVisible: boolean;
  handleModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  actionRef: React.MutableRefObject<ActionType | undefined>;
  currentRow: RoleDataType | undefined;
}
const ModalModifyForm: React.FC<ModalModifyFormDataProps> = (props) => {
  const { createModalVisible, handleModalVisible, actionRef, currentRow } = props
  const submitForm = async (value: RoleDataType) => {
    const response = await value.id !== undefined ? editRole(value) : createRole(value)
    if (!response) return
    handleModalVisible(false);
    message.success(`${value.id !== undefined ? '修改' : '添加'}成功`);
    actionRef.current && actionRef.current.reload();
  }
  return (
    <ModalForm
      modalProps={ {
        maskClosable: false,
        okText: "保存"
      } }
      title={ currentRow ? '编辑用户' : '新建用户' }
      width="400px"
      labelCol={ { span: 6 } }
      layout="horizontal"
      visible={ createModalVisible }
      onVisibleChange={ handleModalVisible }
      onFinish={ async (value) => {
        const bodyVaule: RoleDataType = {
          name: value.name,
          remark: value.remark
        }
        if (currentRow) {
          bodyVaule.id = currentRow.id
        }
        await submitForm(bodyVaule)

      } }
    >
      <ProFormText
        rules={ [
          {
            required: true,
            message: "请输入角色名称！"
          },
        ] }
        label="角色名称"
        name="name"
        placeholder="请输入角色名称"
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
      />
    </ModalForm>
  )
}

export default ModalModifyForm;
