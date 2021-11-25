import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Drawer, message, Popconfirm, Tooltip, Divider, PageHeader } from 'antd';
import React, { useState, useRef } from 'react';
import { FooterToolbar } from '@ant-design/pro-layout';
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
import styles from './styles.less';
import TableUserListByRole from './components/TableUserListByRole'
import TableAuthForm from './components/TableAuthForm'

type RoleListProps = {
  onChange: (id: number) => void;
  id: number | null;
};

const RoleList: React.FC<RoleListProps> = (props) => {
  const { id } = props;
  const { onChange } = props;
  const actionRef = useRef<ActionType>();
  const [ currentRow, setCurrentRow ] = useState<RoleDataType>();
  const [ selectedRowsState, setSelectedRows ] = useState<RoleDataType[]>([]);
  const [ createModalVisible, handleModalVisible ] = useState<boolean>(false);
  const [ modalTreeVisible, handleModalTreeVisible ] = useState<boolean>(false);
  const columns: ProColumns<RoleDataType>[] | undefined = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInForm: true,
      render: (val: any) => <LineWrap title={ val || '' }></LineWrap>,
    },
    {
      title: '操作',
      width: 80,
      valueType: 'option',
      align: "center",
      key: 'option',
      render: (_, record) => (
        <>
          <Tooltip title="编辑" key="edit">
            <a
              onClick={ async () => {
                handleModalVisible(true);
                setCurrentRow(record);
              } }
            >
              <EditOutlined className="qm-table-icon" />
            </a>
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="删除" key="delete">
            <Popconfirm
              title="是否要删除此行？"
              onConfirm={ () => {
                record.id !== undefined && tiggerDeleteRole(record.id);
              } }
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
    <PageHeader
      className="qm-role-menu-header"
      title="角色"
      style={ { margin: 0, padding: '10px 10px 0' } }
      extra={ [ <Button type="primary" onClick={ () => {
        handleModalVisible(true);
        setCurrentRow(undefined);
      } }
      >
        <PlusOutlined />
        新建
      </Button>
      ] }
    >
      <ProTable
        className="qm-role-table"
        bordered={ true }
        size="small"
        rowClassName={ (record: RoleDataType) => {
          return record.id === id ? styles[ 'split-row-select-active' ] : record.id + '--' + id;
        } }
        style={ { marginTop: '-2px' } }
        actionRef={ actionRef }
        rowKey="id"
        onRow={ (record) => {
          return {
            onClick: () => {
              if (record.id) {
                onChange(record.id);
              }
            },
          };
        } }
        options={
          {
            reload: false,
            density: false,
            fullScreen: false,
            setting: false,
          }
        }
        search={ false }
        pagination={ {
          pageSize: 10,
          simple: true,
          style: { justifyContent: 'center' },
          hideOnSinglePage: true
        } }
        scroll={ { y: 'calc(100vh - 260px)' } }
        toolBarRender={ false }
        request={ async (params, sorter, filter) => {
          const response = await queryRoleList();
          if (!response) return;
          return response;
        } }
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
        />
      ) }
      { modalTreeVisible && currentRow !== undefined && (
        <ModalMenuTree
          modalTreeVisible={ modalTreeVisible }
          handleModalTreeVisible={ handleModalTreeVisible }
          actionRef={ actionRef }
          currentRow={ currentRow }
        />
      ) }
      { selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={ { fontWeight: 600 } }>{ selectedRowsState.length }</a> 项
            </div>
          }
        >
          <Popconfirm
            title={ `是否要批量删除 ${selectedRowsState.length} 项` }
            onConfirm={ async () => {
              // await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            } }
          >
            <Button>批量删除</Button>
          </Popconfirm>
        </FooterToolbar>
      ) }
    </PageHeader>
  );
};

const RoleManageCmp: React.FC = () => {
  const [ id, setIp ] = useState<number | null>(null);
  return (
    <ProCard split="vertical">
      <ProCard colSpan={ 8 } ghost bodyStyle={ { padding: '0 0 10px ' } }>
        <RoleList id={ id } onChange={ (id: number) => setIp(id) } />
      </ProCard>
      <ProCard colSpan={ 8 } ghost style={ { justifyContent: "left" } }>
        <TableAuthForm id={ id } />
      </ProCard>
      <ProCard colSpan={ 8 } ghost bodyStyle={ { padding: '0 0 10px ' } }  >
        <TableUserListByRole id={ id } />
      </ProCard>
    </ProCard>
  );
};

export default RoleManageCmp;
