import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserSwitchOutlined,
  LockOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import { Button, Drawer, message, Popconfirm, Switch, Tooltip, Tag, Select, Divider } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { queryUserList, deleteUser, statusUser, getUserRoleId } from './service';
import type { UserListDataType, searchBindFlag } from '../data.d';
import ModalModifyForm from './components/ModalModifyForm';
import { queryRoleList, queryCurUserSiteList } from '@/pages/admin/Role/service';
import ModalAuthifyForm from './components/ModalAuthifyForm';
import ModalModifyPasswordForm from './components/ModalModifyPasswordForm';
const { Option } = Select;
export type RoleCheckBoxDataType = {
  label: string;
  value: number;
};
export type SiteCheckBoxDataType = {
  label: string;
  value: number;
};
const ResumeList: React.FC<UserListDataType> = () => {
  const [ showDetail, setShowDetail ] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [ currentRow, setCurrentRow ] = useState<UserListDataType>();
  const [ selectedRowsState, setSelectedRows ] = useState<UserListDataType[]>([]);
  const [ createModalVisible, handleModalVisible ] = useState<boolean>(false);
  const [ createModalPasswordVisible, handleModalPasswordVisible ] = useState<boolean>(false);
  const [ modalAuthifyVisible, handleModalAuthifyVisible ] = useState<boolean>(false);
  const [ roleData, setRoleData ] = useState<RoleCheckBoxDataType[] | undefined>();
  const [ siteData, setSiteData ] = useState<SiteCheckBoxDataType[] | undefined>();
  const [ initialRoleIds, setInitialRoleIds ] = useState<number[] | undefined>(undefined);
  const columns: ProColumns<any>[] = [
    {
      title: '手机号',
      dataIndex: 'mobile',
      // hideInSearch: true,
      width: 120,
      tip: '规则名称是唯一的 key',
      valueType: 'textarea',
      key: 'mobile',
      fixed: 'left',
      render: (val, entity) => {
        return (
          <a
            onClick={ () => {
              setCurrentRow(entity);
              setShowDetail(true);
            } }
          >
            { `${val}` }
          </a>
        );
      },
    },
    {
      title: '姓名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      hideInSearch: true,
      width: 60,
      align: 'center',
      key: 'gender',
      valueEnum: {
        0: { text: '男' },
        1: { text: '女' },
      },
    },
    {
      title: '身份证号',
      key: 'idCode',
      hideInSearch: true,
      dataIndex: 'idCode',
    },
    {
      title: '实名认证',
      key: 'accountAuth',
      width: 100,
      hideInSearch: true,
      dataIndex: 'accountAuth',
      valueEnum: {
        // ...searchBindFlag,
        0: { text: '已认证', status: 'Processing' },
        1: { text: '未认证', status: 'Default' },
      },
    },
    {
      title: '角色',
      key: 'roleId',
      dataIndex: 'roleList',
      render: (val, record) => {
        return (
          <div>
            { Array.isArray(val) &&
              val.map((item, index) => (
                <Tag key={ index } color="blue">
                  { item.name }
                </Tag>
              )) }
          </div>
        );
      },
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        return <Select options={ roleData } key="label" />;
      },
    },
    {
      title: '状态',
      key: 'dataStatus',
      dataIndex: 'dataStatus',
      valueEnum: {
        0: { text: '启用', status: 'Success' },
        1: { text: '禁用', status: 'Error' },
        2: { text: '待加入', status: 'warning' },
        3: { text: '审核中', status: 'Processing' },
        4: { text: '审核失败', status: 'Default' },
      },
    },
    // {
    //   title: "状态",
    //   dataIndex: 'status',
    //   hideInSearch: true,
    //   hideInForm: true,
    //   key: "status",
    //   render: ((val, record) => {
    //     return (<Switch disabled={ record.id === 1 } loading={ false } onClick={ async (checked: boolean, event: Event) => {
    //       record.id !== undefined && switchUserStatus(record.id?.toString(), val === 1)
    //     } } checkedChildren='启用' unCheckedChildren='禁用' defaultChecked={ val === 1 } />)
    //   })
    // },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: '140px',
      fixed: 'right',
      render: (_, record) =>
        record.superAdmin === 0 ? (
          []
        ) : (
          <>
            { record.dataStatus == 2 && (
              <Popconfirm
                title="是否取消邀请？"
                onConfirm={ () => {
                  record.id !== undefined && tiggerDeleteUser(record.id?.toString());
                } }
              >
                <a type="link">取消邀请</a>
              </Popconfirm>
            ) }
            { record.dataStatus == 0 && (
              <a
                type="link"
                onClick={ async () => {
                  fetchUserRoleId(record);
                } }
              >
                修改角色
              </a>
            ) }
            { record.dataStatus == 0 && <Divider type="vertical" /> }
            { (record.dataStatus === 0 || record.dataStatus === 1) && (
              <a
                type="link"
                onClick={ async () =>
                  switchUserStatus(record.id?.toString(), record.dataStatus === 0)
                }
              >
                {/* 修改角色 */ }
                { record.dataStatus === 0 ? '禁用' : '启用' }
              </a>
            ) }
          </>
        ),
    },
  ];
  useEffect(() => {
    fetchRoleListData();
  }, []);
  const switchUserStatus = async (id: string, batch: boolean) => {
    const response = await statusUser(id);
    if (!response) return;
    setShowDetail(false);
    actionRef.current && actionRef.current.reloadAndRest?.();
    message.success(`${batch ? '禁用' : '启用'}成功`);
  };
  const tiggerDeleteUser = async (id: string) => {
    const response = await deleteUser(id);
    if (!response) return;
    setShowDetail(false);
    actionRef.current && actionRef.current.reloadAndRest?.();
    message.success('取消邀请成功');
  };
  //修改角色
  const fetchUserRoleId = async (record: UserListDataType) => {
    setCurrentRow(record);
    record &&
      record.id !== undefined &&
      setInitialRoleIds(record?.roleList?.map((item) => item.id));

    // getUserRoleId(record.id?.toString()).then(async (response) => {
    //   if (!response) return;
    //   setInitialRoleIds(response.data);
    // record.
    await fetchRoleListData(), handleModalAuthifyVisible(true);

    // });
  };
  // const fetchUserEdit = async (record: UserListDataType) => {
  //   setCurrentRow(record);
  //   record.id !== undefined &&
  //     getUserRoleId(record.id?.toString()).then(async (response: any) => {
  //       if (!response) return;
  //       setInitialRoleIds(response.data);
  //       await fetchRoleListData();
  //       handleModalVisible(true);
  //     });
  // };
  // const fetchUserPasswordEdit = async (record: UserListDataType) => {
  //   setCurrentRow(record);
  //   handleModalPasswordVisible(true);
  // };
  const fetchRoleListData = async () => {
    if (roleData === undefined) {
      const response = await queryRoleList();
      if (!response) return;
      await setRoleData(
        response.data.map((item: any) => ({
          label: item.name,
          value: item.id,
        })),
      );
    }
  };
  const fetchSiteListData = async () => {
    if (siteData === undefined) {
      const response = await queryCurUserSiteList();
      if (!response) return;
      await setSiteData(
        response.data.map((item: any) => ({
          label: item.siteName,
          value: item.siteId,
        })),
      );
    }
  };

  // const fetchCurUserSiteListData = async () => {
  //   CUR_USER_SITE_LIST
  // }

  const fetchQueryUserList = async (params: any) => {
    const response = await queryUserList(params);
    if (!response) return { data: [] };
    const { data } = response;
    return { ...data, data: data.records };
  };
  return (
    <PageContainer header={ { title: '' } }>
      <ProTable
        bordered={ true }
        // scroll={{ x: true }}
        //    & {
        //     scrollToFirstRowOnChange?: boolean;
        // };
        scroll={ { x: 800 } }
        size="small"
        headerTitle="查询表格"
        actionRef={ actionRef }
        rowKey="id"
        pagination={ {
          pageSize: 10,
        } }
        toolBarRender={ () => [
          <Button
            type="primary"
            onClick={ async () => {
              await fetchSiteListData();
              await fetchRoleListData();
              await setInitialRoleIds([]);
              handleModalVisible(true);
              setCurrentRow(undefined);
            } }
          >
            <PlusOutlined />
            邀请人员
          </Button>,
        ] }
        request={ async (params, sorter, filter) =>
          await fetchQueryUserList({ ...params, sorter, filter })
        }
        columns={ columns }
        // rowSelection={ {
        //   onChange: (_, selectedRows: any) => setSelectedRows(selectedRows),
        // } }
        rowSelection={ false }
      />
      { createModalVisible && (
        <ModalModifyForm
          createModalVisible={ createModalVisible }
          handleModalVisible={ handleModalVisible }
          actionRef={ actionRef }
          currentRow={ currentRow }
          roleData={ roleData }
          siteData={ siteData }
          initialRoleIds={ initialRoleIds }
          setShowDetail={ setShowDetail }
        />
      ) }
      {/* {createModalPasswordVisible && currentRow && (
        <ModalModifyPasswordForm
          createModalVisible={createModalPasswordVisible}
          handleModalVisible={handleModalPasswordVisible}
          actionRef={actionRef}
          currentRow={currentRow}
          setShowDetail={setShowDetail}
        />
      )} */}
      { modalAuthifyVisible && (
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
        { currentRow?.mobile && (
          <ProDescriptions<UserListDataType>
            column={ 2 }
            bordered={ true }
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
