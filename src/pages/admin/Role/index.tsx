import { PlusOutlined, EditOutlined, DeleteOutlined, AuditOutlined } from '@ant-design/icons';
import { Button, Drawer, message, Popconfirm, Tooltip } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { queryRoleList, deleteRole } from './service';
import type { RoleDataType } from './data.d';
import ModalModifyForm from './components/ModalModifyForm'
import ModalMenuTree from './components/ModalMenuTree'
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
const RoleList: React.FC<RoleDataType> = () => {
  const [ showDetail, setShowDetail ] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [ currentRow, setCurrentRow ] = useState<RoleDataType>();
  const [ selectedRowsState, setSelectedRows ] = useState<RoleDataType[]>([]);
  const [ createModalVisible, handleModalVisible ] = useState<boolean>(false);
  const [ modalTreeVisible, handleModalTreeVisible ] = useState<boolean>(false);
  const columns: ProColumns<any>[] | undefined = [
    {
      title: "角色名称",
      dataIndex: 'name',
      tip: '规则名称是唯一的 key',
      key: 'name',
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
      title: "备注",
      dataIndex: 'remark',
      hideInForm: true,
    },
    {
      title: "操作",
      width: 140,
      valueType: 'option',
      key: "option",
      render: (_, record) => [
        <Tooltip title="编辑" key="edit">
          <Button
            type="link"
            size="small"
            onClick={ async () => { handleModalVisible(true); setCurrentRow(record); } }
          >
            <EditOutlined className="qm-table-icon" />
          </Button>
        </Tooltip>,
        <Tooltip title="删除" key="delete">
          <Popconfirm
            title="是否要删除此行？"
            onConfirm={ () => { record.id !== undefined && tiggerDeleteRole(record.id?.toString()); } }>
            <Button size="small" type="link"><DeleteOutlined className="qm-table-icon" /></Button>
          </Popconfirm>
        </Tooltip>,
        <Tooltip title="绑定权限" key="setBindRole">
          <Button size="small" type="link" onClick={ () => { handleModalTreeVisible(true); setCurrentRow(record); } }>
            <AuditOutlined className="qm-table-icon" />
          </Button>
        </Tooltip>
      ]
    }
  ];
  const tiggerDeleteRole = async (id: string) => {
    const response = await deleteRole(id)
    if (!response) return
    actionRef.current && actionRef.current.reloadAndRest?.();
    message.success("删除成功")
  }
  return (
    <PageContainer header={ { title: "" } }>
      <ProTable
        size="small"
        headerTitle="查询表格"
        actionRef={ actionRef }
        rowKey="id"
        // search={ {
        //   labelWidth: 80,
        // } }
        search={ false }
        pagination={ {
          pageSize: 10,
        } }
        toolBarRender={ () => [
          <Button type="primary" onClick={ () => { handleModalVisible(true); setCurrentRow(undefined); } }>
            <PlusOutlined />新建
          </Button>,
        ] }
        request={ async (params, sorter, filter) => {
          const response = await queryRoleList()
          if (!response) return
          return response
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
              已选择{ ' ' }<a style={ { fontWeight: 600 } }>{ selectedRowsState.length }</a>{ ' ' }
              项
            </div>
          }
        >
          <Popconfirm
            title={ `是否要批量删除 ${selectedRowsState.length} 项` }
            onConfirm={ async () => {
              // await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            } }>
            <Button>
              批量删除
            </Button>
          </Popconfirm>
        </FooterToolbar>
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
        { currentRow?.roleName && (
          <ProDescriptions<RoleDataType>
            column={ 1 }
            title={ currentRow?.roleName }
            request={ async () => ({
              data: currentRow || {},
            }) }
            params={ {
              id: currentRow?.id,
            } }
            columns={ columns as ProDescriptionsItemProps<RoleDataType>[] }
          />
        ) }
      </Drawer>
    </PageContainer>
  );
};

export default RoleList;
