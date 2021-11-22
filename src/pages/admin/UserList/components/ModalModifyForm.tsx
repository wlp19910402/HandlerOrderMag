/**
 * 邀请用户
 */
import React from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormCheckbox } from '@ant-design/pro-form';
import { addUser, editUser } from '../service';
import type { UserListDataType, EditUserDataType } from '../../data.d';
import type { RoleCheckBoxDataType, SiteCheckBoxDataType } from '../index';
import { message } from 'antd';

type ModalModifyFormDataProps = {
  createModalVisible: boolean;
  handleModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  actionRef: React.MutableRefObject<ActionType | undefined>;
  currentRow: UserListDataType | undefined;
  roleData: RoleCheckBoxDataType[] | undefined;
  siteData: SiteCheckBoxDataType[] | undefined;
  initialRoleIds: number[] | undefined;
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>;
};
const ModalModifyForm: React.FC<ModalModifyFormDataProps> = (props) => {
  const {
    createModalVisible,
    handleModalVisible,
    actionRef,
    currentRow,
    roleData,
    siteData,
    initialRoleIds = undefined,
    setShowDetail,
  } = props;
  const submitForm = async (value: EditUserDataType) => {
    let response;
    if (currentRow?.id !== undefined) {
      response = await editUser({ ...value, id: currentRow?.id });
    } else {
      response = await addUser(value);
    }
    if (!response) return;
    setShowDetail(false);
    actionRef.current && actionRef.current.reload();
    message.success(`${currentRow?.id !== undefined ? '修改' : '添加'}成功`);
    handleModalVisible(false);
  };
  return (
    <ModalForm
      modalProps={ {
        maskClosable: false,
        okText: '邀请',
      } }
      title={ currentRow?.id !== undefined ? '用户编辑' : '邀请人员' }
      width="400px"
      visible={ createModalVisible }
      onVisibleChange={ handleModalVisible }
      onFinish={ async (value) => {
        const bodyVaule: EditUserDataType = {
          mobile: value.mobile,
          roleIds: value.roleIds,
          siteList: value.siteIds
        };
        await submitForm(bodyVaule);
      } }
      labelCol={ { span: 5 } }
      layout="horizontal"
    >
      {/* <ProFormText
        rules={[
          {
            required: true,
            message: '请输入用户名！',
          },
        ]}
        label="用户名"
        name={currentRow?.id !== undefined ? 'oldUsername' : 'username'}
        placeholder="请输入用户名"
        disabled={currentRow?.id !== undefined}
        initialValue={currentRow?.username}
      /> */}
      {/* <ProFormText
        rules={[
          {
            required: true,
            message: '请输入姓名！',
          },
        ]}
        label="姓名"
        name="realname"
        placeholder="请输入姓名"
        initialValue={currentRow?.realname}
      /> */}
      {/* {currentRow?.id === undefined && (
        <ProFormText.Password
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
          label="密码"
          name="password"
          placeholder="请输入密码"
        />
      )} */}
      <ProFormText
        rules={ [
          { required: true, message: '请输入手机号！' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
        ] }
        label="手机号"
        name="mobile"
        placeholder="请输入手机号"
        initialValue={ currentRow?.mobile }
      />
      {/* <ProFormText
        rules={[
          {
            required: true,
            message: '请输入邮箱！',
          },
        ]}
        label="邮箱"
        name="email"
        placeholder="请输入邮箱"
        initialValue={currentRow?.email}
      /> */}
      { roleData && roleData.length > 0 && (
        <ProFormCheckbox.Group
          name={ currentRow?.id !== undefined ? 'oldRoleIds' : 'roleIds' }
          layout="horizontal"
          label="角色"
          options={ roleData }
          disabled={ currentRow?.id !== undefined }
          initialValue={ initialRoleIds }
          rules={ [ { required: true, message: '必填项哦' } ] }
        />
      ) }
      { siteData && siteData.length > 0 && (
        <ProFormCheckbox.Group
          name={ currentRow?.id !== undefined ? 'oldSiteIds' : 'siteIds' }
          layout="horizontal"
          label="网点"
          options={ siteData }
          disabled={ currentRow?.id !== undefined }
          initialValue={ initialRoleIds }
          rules={ [ { required: true, message: '必填项哦' } ] }
        />
      ) }

    </ModalForm>
  );
};

export default ModalModifyForm;
