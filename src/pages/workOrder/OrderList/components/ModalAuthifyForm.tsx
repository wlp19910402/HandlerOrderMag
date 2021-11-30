/**
 * 用户列表中的修改角色
 */
import React from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormCheckbox } from '@ant-design/pro-form';
import type { UserAuthorityType } from '../service';
import { saveUserAuthority } from '../service';
import type { UserListDataType } from '../../data';
import type { RoleCheckBoxDataType } from '../index';

type ModalAuthifyFormDataProps = {
  modalAuthifyVisible: boolean;
  handleModalAuthifyVisible: React.Dispatch<React.SetStateAction<boolean>>;
  actionRef: React.MutableRefObject<ActionType | undefined>;
  currentRow: UserListDataType | undefined;
  roleData: RoleCheckBoxDataType[] | undefined;
  initialRoleIds: number[] | undefined;
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>;
};
const ModalAuthifyForm: React.FC<ModalAuthifyFormDataProps> = (props) => {
  const {
    modalAuthifyVisible,
    handleModalAuthifyVisible,
    actionRef,
    currentRow,
    roleData,
    initialRoleIds,
    setShowDetail,
  } = props;
  const submitForm = async (value: UserAuthorityType) => {
    const response = await saveUserAuthority(value);
    if (!response) return;
    setShowDetail(false);
    handleModalAuthifyVisible(false);
    actionRef.current && actionRef.current.reload();
  };
  return (
    <ModalForm
      modalProps={{
        maskClosable: false,
        okText: '保存',
      }}
      title="修改用户角色"
      width="640px"
      visible={modalAuthifyVisible}
      onVisibleChange={handleModalAuthifyVisible}
      onFinish={async (value) => {
        const bodyVaule: UserAuthorityType = {
          roleIds: value.roleIds.map((item: any) => item.toString()),
          userId: value.id,
        };
        await submitForm(bodyVaule);
      }}
      labelCol={{ span: 5 }}
      layout="horizontal"
    >
      <ProFormText hidden name="id" initialValue={currentRow?.id} />
      <ProFormText name="" disabled label="姓名" initialValue={currentRow?.username} />
      {roleData ? (
        <ProFormCheckbox.Group
          name="roleIds"
          layout="horizontal"
          label="角色"
          initialValue={initialRoleIds}
          options={roleData}
          rules={[{ required: true, message: '必填项哦' }]}
        />
      ) : (
        <></>
      )}
    </ModalForm>
  );
};

export default ModalAuthifyForm;
