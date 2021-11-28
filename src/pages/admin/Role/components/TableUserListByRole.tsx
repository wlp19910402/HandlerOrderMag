import { PageHeader } from 'antd';
import React, { useRef, useEffect } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryUserByRoleId } from '@/pages/admin/UserList/service';
import type { UserListDataType } from '../../data';

type DetailListProps = {
  id: number | null;
};
const TableUserListByRole: React.FC<DetailListProps> = (props) => {
  const { id } = props;
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<UserListDataType>[] = [
    {
      title: '姓名',
      key: 'username',
      dataIndex: 'username',
    },
    {
      title: '手机号',
      key: 'mobile',
      dataIndex: 'mobile',
    },
  ];
  useEffect(() => {
    actionRef.current && actionRef.current.reloadAndRest?.();
  }, [id]);

  const fetchUserListByRoleId = async (params: any) => {
    if (id === null) return { data: [] };
    const response = await queryUserByRoleId({ ...params, roleId: id });
    if (!response) return { data: [] };
    const { data } = response;
    return { ...data, data: data.records };
  };
  return (
    <PageHeader className="qm-role-menu-header" title="人员" style={{ margin: 0, padding: 10 }}>
      <ProTable<UserListDataType>
        className="qm-role-table"
        size="small"
        actionRef={actionRef}
        bordered={true}
        columns={columns}
        request={async (params, sorter, filter) => {
          const response = await fetchUserListByRoleId({ ...params, sorter, filter });
          if (!response) return;
          return response;
        }}
        options={{
          reload: false,
          density: false,
          fullScreen: false,
          setting: false,
        }}
        style={{ marginTop: '-2px' }}
        toolBarRender={false}
        pagination={{
          pageSize: 10,
          simple: true,
          style: { justifyContent: 'center' },
          hideOnSinglePage: true,
        }}
        rowKey="id"
        search={false}
      />
    </PageHeader>
  );
};

export default TableUserListByRole;