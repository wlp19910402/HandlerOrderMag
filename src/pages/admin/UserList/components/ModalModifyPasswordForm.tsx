/**
 * 用户列表 编辑 和 新增
 */
import React from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { editUserPassword } from '../service';
import type { UserListDataType } from '../../data';
import { message } from 'antd'

type ModalModifyFormDataProps = {
  createModalVisible: boolean;
  handleModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  actionRef: React.MutableRefObject<ActionType | undefined>;
  currentRow: UserListDataType;
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>;
}
const ModalModifyForm: React.FC<ModalModifyFormDataProps> = (props) => {
  const { createModalVisible, handleModalVisible, actionRef, currentRow, setShowDetail } = props
  const submitForm = async (value: any) => {
    let response = await editUserPassword({ ...value, id: currentRow?.id })
    if (!response) return
    setShowDetail(false)
    actionRef.current && actionRef.current.reload();
    message.success("修改密码成功");
    handleModalVisible(false);
  }
  return (
    <ModalForm
      modalProps={ {
        maskClosable: false,
        okText: "保存"
      } }
      title={ "修改密码" }
      width="400px"
      visible={ createModalVisible }
      onVisibleChange={ handleModalVisible }
      onFinish={ async (value) => {
        await submitForm({ password: value.password })
      } }
      labelCol={ { span: 5 } }
      layout="horizontal"
    >
      <ProFormText
        label="用户名"
        name="username"
        disabled
        initialValue={ currentRow.username }
      />
      <ProFormText
        label="姓名"
        initialValue={ currentRow.realname }
        name="realname"
        disabled
      />
      <ProFormText.Password
        rules={ [
          {
            required: true,
            message: "请输入新密码！"
          }
        ] }
        label="新密码"
        name="password"
        placeholder="请输入新密码"
      />
    </ModalForm>
  )
}

export default ModalModifyForm;
