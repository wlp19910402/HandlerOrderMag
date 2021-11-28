import { Tag } from 'antd';
import React, { useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryUserListBySiteId } from '../service';

type UserListBySiteIdType = {
  siteId: number;
};
const ResumeList: React.FC<UserListBySiteIdType> = (props) => {
  const { siteId } = props;
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<any>[] = [
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: 120,
      valueType: 'textarea',
      key: 'mobile',
      fixed: 'left',
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
      align: 'center',
      key: 'gender',
      valueEnum: {
        0: { text: '男' },
        1: { text: '女' },
      },
    },
    {
      title: '实名认证',
      key: 'accountAuth',
      hideInSearch: true,
      dataIndex: 'accountAuth',
      render: (val) => (val ? '已认证' : '未认证'),
    },
    {
      title: '角色',
      key: 'roleId',
      dataIndex: 'roleList',
      render: (val) => {
        return (
          <div>
            {Array.isArray(val) &&
              val.map((item, index) => (
                <Tag key={index} color="blue">
                  {item.name}
                </Tag>
              ))}
          </div>
        );
      },
    },
  ];
  const fetchQueryUserListBySiteId = async (params: any) => {
    const response = await queryUserListBySiteId({ ...params, siteId });
    if (!response) return { data: [] };
    const { data } = response;
    return { ...data, data: data.records };
  };
  return (
    <ProTable
      bordered={true}
      size="small"
      actionRef={actionRef}
      rowKey="id"
      pagination={{
        pageSize: 10,
      }}
      style={{ marginTop: '30px' }}
      toolBarRender={false}
      search={false}
      request={async (params, sorter, filter) =>
        await fetchQueryUserListBySiteId({ ...params, sorter, filter })
      }
      columns={columns}
      rowSelection={false}
    />
  );
};

export default ResumeList;
