import { PlusOutlined, EditOutlined, DeleteOutlined, AuditOutlined } from '@ant-design/icons';
import { Button, Drawer, message, Popconfirm, Tooltip, Divider } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import ProCard from '@ant-design/pro-card';
import { queryRoleList, deleteRole } from './service';
import type { RoleDataType } from './data.d';
import ModalModifyForm from './components/ModalModifyForm';
import ModalMenuTree from './components/ModalMenuTree';
import LineWrap from '@/components/common/LineWrap';
import { queryUserByRoleId } from '@/pages/admin/UserList/service';
import type { UserListDataType } from '../data.d';
import styles from './styles.less';
/**
 *  删除节点
 * @param selectedRows
 */
// const handleRemove = async (selectedRows: RoleDataType[]) => {
//   const hide = message.loading('正在删除');
//   if (!selectedRows) return true;
//   try {
//     // await removeRule({
//     //   deleteId: selectedRows.map((row) => row.id),
//     // });
//     hide;
//     message.success('删除成功，即将刷新');
//     return true;
//   } catch (error) {
//     hide;
//     message.error('删除失败，请重试');
//     return false;
//   }
// };

type DetailListProps = {
  id: number | null;
};
const DetailList: React.FC<DetailListProps> = (props) => {
  const { id } = props;
  const [userListByRoleId, setUserListByRoleId] = useState<UserListDataType[]>([]);
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
      width: 80,
      dataIndex: 'mobile',
    },
  ];

  useEffect(() => {
    if (!id) {
      setUserListByRoleId([]);
      return;
    }
    actionRef.current && actionRef.current.reloadAndRest?.();
  }, [id]);

  const fetchUserListByRoleId = async (params: any) => {
    if (id === null) return { data: [] };
    const response = await queryUserByRoleId({ ...params, roleId: id });
    if (!response) return { data: [] };
    const { data } = response;
    return { ...data, data: data.records };
  };
  // actionRef.current && actionRef.current.reloadAndRest?.();
  return (
    <ProTable<UserListDataType>
      toolBarRender={() => [
        <Button type="primary">
          <PlusOutlined />
          保存
        </Button>,
      ]}
      actionRef={actionRef}
      bordered={true}
      columns={columns}
      request={async (params, sorter, filter) => {
        const response = await fetchUserListByRoleId({ ...params, sorter, filter });
        if (!response) return;
        return response;
      }}
      headerTitle="权限"
      // dataSource={userListByRoleId}
      pagination={{
        pageSize: 10,
        // showSizeChanger: false,
      }}
      rowKey="key"
      // toolBarRender={ false }
      search={false}
    />
  );
};

type RoleListProps = {
  onChange: (id: number) => void;
  id: number | null;
};

const RoleList: React.FC<RoleListProps> = (props) => {
  const { id } = props;
  const { onChange } = props;
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<RoleDataType>();
  const [selectedRowsState, setSelectedRows] = useState<RoleDataType[]>([]);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [modalTreeVisible, handleModalTreeVisible] = useState<boolean>(false);
  const columns: ProColumns<RoleDataType>[] | undefined = [
    {
      title: '角色名称',
      dataIndex: 'name',
      // tip: '规则名称是唯一的 key',
      key: 'name',
      render: (val, entity) => {
        return (
          <a
          // onClick={ () => {
          //   // setCurrentRow(entity);
          //   // setShowDetail(true);
          // } }
          >
            {`${val}`}
          </a>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInForm: true,
      render: (val: any) => <LineWrap title={val || ''}></LineWrap>,
    },
    {
      title: '操作',
      width: 68,
      valueType: 'option',
      key: 'option',
      render: (_, record) => (
        <>
          <Tooltip title="编辑" key="edit">
            <a
              onClick={async () => {
                handleModalVisible(true);
                setCurrentRow(record);
              }}
            >
              <EditOutlined className="qm-table-icon" />
            </a>
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="删除" key="delete">
            <Popconfirm
              title="是否要删除此行？"
              onConfirm={() => {
                record.id !== undefined && tiggerDeleteRole(record.id);
              }}
            >
              <a>
                <DeleteOutlined className="qm-table-icon" />
              </a>
            </Popconfirm>
          </Tooltip>
          {/* // <Tooltip title="绑定权限" key="setBindRole">
        //   <Button size="small" type="link" onClick={ () => { handleModalTreeVisible(true); setCurrentRow(record); } }>
        //     <AuditOutlined className="qm-table-icon" />
        //   </Button>
        // </Tooltip> */}
        </>
      ),
    },
  ];
  const tiggerDeleteRole = async (paramsId: number) => {
    const response = await deleteRole(paramsId);
    if (!response) return;
    actionRef.current && actionRef.current.reloadAndRest?.();
    message.success('删除成功');
  };
  return (
    <>
      <ProTable
        bordered={true}
        size="small"
        rowClassName={(record: RoleDataType) => {
          return record.id === id ? styles['split-row-select-active'] : record.id + '--' + id;
        }}
        headerTitle="角色"
        actionRef={actionRef}
        rowKey="id"
        onRow={(record) => {
          return {
            onClick: () => {
              if (record.id) {
                onChange(record.id);
              }
            },
          };
        }}
        // search={ {
        //   labelWidth: 80,
        // } }
        search={false}
        pagination={{
          pageSize: 10,
        }}
        scroll={{ y: 600 }}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              handleModalVisible(true);
              setCurrentRow(undefined);
            }}
          >
            <PlusOutlined />
            新建
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const response = await queryRoleList();
          if (!response) return;
          return response;
        }}
        columns={columns}
        // rowSelection={ {
        //   onChange: (_, selectedRows: any) => setSelectedRows(selectedRows),
        // } }
        rowSelection={false}
      />

      {createModalVisible && (
        <ModalModifyForm
          createModalVisible={createModalVisible}
          handleModalVisible={handleModalVisible}
          actionRef={actionRef}
          currentRow={currentRow}
        />
      )}
      {modalTreeVisible && currentRow !== undefined && (
        <ModalMenuTree
          modalTreeVisible={modalTreeVisible}
          handleModalTreeVisible={handleModalTreeVisible}
          actionRef={actionRef}
          currentRow={currentRow}
        />
      )}
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项
            </div>
          }
        >
          <Popconfirm
            title={`是否要批量删除 ${selectedRowsState.length} 项`}
            onConfirm={async () => {
              // await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <Button>批量删除</Button>
          </Popconfirm>
        </FooterToolbar>
      )}
      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<RoleDataType>
            column={1}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<RoleDataType>[]}
          />
        )}
      </Drawer>
    </>
  );
};

const Demo: React.FC = () => {
  const [id, setIp] = useState<number | null>(null);
  return (
    <ProCard split="vertical">
      <ProCard colSpan={8} ghost>
        <RoleList id={id} onChange={(id: number) => setIp(id)} />
      </ProCard>
      <ProCard colSpan={8} ghost>
        <DetailList id={id} />
      </ProCard>
      <ProCard colSpan={8} ghost>
        <DetailList id={id} />
      </ProCard>
    </ProCard>
  );
};

export default Demo;
