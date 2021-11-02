import { PlusOutlined, EditOutlined, DeleteOutlined, UserSwitchOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Drawer, message, Popconfirm, Switch, Tooltip } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { queryUserList, deleteUser, statusUser, getUserRoleId } from './service';
import type { UserListDataType, searchBindFlag } from '../data.d';
import ModalModifyForm from './components/ModalModifyForm'
import { queryRoleList } from '@/pages/admin/Role/service'
import ModalAuthifyForm from './components/ModalAuthifyForm'
import ModalModifyPasswordForm from './components/ModalModifyPasswordForm'

export type RoleCheckBoxDataType = {
  label: string;
  value: number;
}

const ResumeList: React.FC<UserListDataType> = () => {
  const [ showDetail, setShowDetail ] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [ currentRow, setCurrentRow ] = useState<UserListDataType>();
  const [ selectedRowsState, setSelectedRows ] = useState<UserListDataType[]>([]);
  const [ createModalVisible, handleModalVisible ] = useState<boolean>(false);
  const [ createModalPasswordVisible, handleModalPasswordVisible ] = useState<boolean>(false);
  const [ modalAuthifyVisible, handleModalAuthifyVisible ] = useState<boolean>(false);
  const [ roleData, setRoleData ] = useState<RoleCheckBoxDataType[] | undefined>();
  const [ initialRoleIds, setInitialRoleIds ] = useState<number[] | undefined>(undefined)
  const columns: ProColumns<any>[] = [
    {
      title: "姓名",
      dataIndex: 'realname',
      tip: '规则名称是唯一的 key',
      hideInSearch: true,
      key: 'realname',
      render: (val, entity) => {
        return (
          <a
            onClick={ () => {
              setCurrentRow(entity);
              setShowDetail(true);
            } }
          >
            {`${val}` }
          </a>
        );
      },
    },
    {
      title: "用户名",
      dataIndex: 'username',
      key: "username",
    },
    {
      title: "范围",
      dataIndex: 'bindFlag',//0:查询所有， 1:查询已绑定微信管理员， 2:查询未绑定微信管理员
      // defaultSortOrder: 0,
      hideInTable: true,
      valueEnum: {
        // ...searchBindFlag,
        0: { text: "所有", status: 'Default' },
        1: { text: "已绑定微信管理员", status: 'Default' },
        2: { text: "未绑定微信管理员", status: 'Processing' }
      },
    },
    {
      title: "部门id",
      key: "deptId",
      hideInSearch: true,
      dataIndex: 'deptId'
    },
    {
      title: "电子邮箱",
      dataIndex: 'email',
      hideInSearch: true,
      valueType: 'textarea',
      key: "email",
    },
    {
      title: "手机号",
      dataIndex: 'mobile',
      hideInSearch: true,
      valueType: 'textarea',
      key: "mobile",
    },
    {
      title: "创建时间",
      dataIndex: 'createTime',
      hideInSearch: true,
      hideInTable: true,
      valueType: 'textarea',
      key: "createTime",
    },
    {
      title: "状态",
      dataIndex: 'status',
      hideInSearch: true,
      hideInForm: true,
      key: "status",
      render: ((val, record) => {
        return (<Switch disabled={ record.id === 1 } loading={ false } onClick={ async (checked: boolean, event: Event) => {
          record.id !== undefined && switchUserStatus(record.id?.toString(), val === 1)
        } } checkedChildren='启用' unCheckedChildren='禁用' defaultChecked={ val === 1 } />)
      })
    },
    {
      title: "操作",
      valueType: 'option',
      key: "option",
      width: "140px",
      render: (_, record) => [
        <Tooltip title="编辑" key="edit">
          <Button
            type="link"
            size="small"
            disabled={ record.id === 1 }
            onClick={ async () => { fetchUserEdit(record) } }
          >
            <EditOutlined className="qm-table-icon" />
          </Button>
        </Tooltip>,
        <Tooltip title="修改密码" key="password">
          <Button
            type="link"
            size="small"
            onClick={ async () => { fetchUserPasswordEdit(record) } }
          >
            <LockOutlined className="qm-table-icon" />
          </Button>
        </Tooltip>,
        <Tooltip title="删除" key="delete">
          <Popconfirm
            disabled={ record.id === 1 }
            title="是否要删除此行？"
            onConfirm={ () => { record.id !== undefined && tiggerDeleteUser(record.id?.toString()); } }>
            <Button disabled={ record.id === 1 } size="small" type="link"><DeleteOutlined className="qm-table-icon" /></Button>
          </Popconfirm>
        </Tooltip>,
        <Tooltip title="授权" key="setRole">
          <Button
            type="link"
            size="small"
            disabled={ record.id === 1 }
            onClick={ async () => { fetchUserRoleId(record) } }
          >
            <UserSwitchOutlined className="qm-table-icon" />
          </Button>
        </Tooltip>
      ],
    },
  ];
  const switchUserStatus = async (id: string, batch: boolean) => {
    const response = await statusUser(id);
    if (!response) return
    setShowDetail(false)
    actionRef.current && actionRef.current.reloadAndRest?.();
    message.success(`${batch ? '禁用' : '启用'}成功`)
  };
  const tiggerDeleteUser = async (id: string) => {
    const response = await deleteUser(id)
    if (!response) return
    setShowDetail(false)
    actionRef.current && actionRef.current.reloadAndRest?.();
    message.success("删除成功")
  }
  const fetchUserRoleId = async (record: UserListDataType) => {
    setCurrentRow(record);
    record.id !== undefined && getUserRoleId(record.id?.toString()).then(
      async (response) => {
        if (!response) return
        setInitialRoleIds(response.data);
        await fetchRoleListData();
        handleModalAuthifyVisible(true);
      })
  }
  const fetchUserEdit = async (record: UserListDataType) => {
    setCurrentRow(record);
    record.id !== undefined && getUserRoleId(record.id?.toString()).then(
      async (response: any) => {
        if (!response) return
        setInitialRoleIds(response.data);
        await fetchRoleListData();
        handleModalVisible(true);
      })
  }
  const fetchUserPasswordEdit = async (record: UserListDataType) => {
    setCurrentRow(record);
    handleModalPasswordVisible(true);
  }
  const fetchRoleListData = async () => {
    if (roleData === undefined) {
      const response = await queryRoleList()
      if (!response) return
      await setRoleData(response.data.map((item: any) => ({
        label: item.roleName,
        value: item.id
      })))
    }
  }
  const fetchQueryUserList = async (params: any) => {
    const response = await queryUserList(params)
    if (!response) return { data: [] }
    const { data } = response;
    return ({ ...data, data: data.records })
  }
  return (
    <PageContainer header={ { title: "" } }>
      <ProTable
        size="small"
        headerTitle="查询表格"
        actionRef={ actionRef }
        rowKey="id"
        pagination={ {
          pageSize: 10,
        } }
        toolBarRender={ () => [
          <Button type="primary" onClick={ async () => { await fetchRoleListData(); await setInitialRoleIds([]); handleModalVisible(true); setCurrentRow(undefined); } }>
            <PlusOutlined />新建
          </Button>,
        ] }
        request={ async (params, sorter, filter) => await fetchQueryUserList({ ...params, sorter, filter }) }
        columns={ columns }
        // rowSelection={ {
        //   onChange: (_, selectedRows: any) => setSelectedRows(selectedRows),
        // } }
        rowSelection={ false }
      />
      {createModalVisible && (
        <ModalModifyForm
          createModalVisible={ createModalVisible }
          handleModalVisible={ handleModalVisible }
          actionRef={ actionRef }
          currentRow={ currentRow }
          roleData={ roleData }
          initialRoleIds={ initialRoleIds }
          setShowDetail={ setShowDetail }
        />
      ) }
      {createModalPasswordVisible && currentRow && (
        <ModalModifyPasswordForm
          createModalVisible={ createModalPasswordVisible }
          handleModalVisible={ handleModalPasswordVisible }
          actionRef={ actionRef }
          currentRow={ currentRow }
          setShowDetail={ setShowDetail }
        />
      ) }
      {modalAuthifyVisible && (
        <ModalAuthifyForm
          modalAuthifyVisible={ modalAuthifyVisible }
          handleModalAuthifyVisible={ handleModalAuthifyVisible }
          actionRef={ actionRef }
          currentRow={ currentRow }
          roleData={ roleData }
          initialRoleIds={ initialRoleIds }
          setShowDetail={ setShowDetail }
        />
      ) }
      <Drawer
        width={ 600 }
        visible={ showDetail }
        onClose={ () => {
          setCurrentRow(undefined);
          setShowDetail(false);
        } }
        closable={ false }
      >
        { currentRow?.username && (
          <ProDescriptions<UserListDataType>
            column={ 1 }
            title={ currentRow?.username }
            key={ currentRow?.id }
            request={ async () => ({
              data: currentRow || {},
            }) }
            params={ {
              id: currentRow?.id,
            } }
            columns={ columns as ProDescriptionsItemProps<UserListDataType>[] }
          />
        ) }
      </Drawer>
    </PageContainer>
  );
};

export default ResumeList;
