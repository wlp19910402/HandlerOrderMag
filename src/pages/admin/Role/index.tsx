import { PlusOutlined, EditOutlined, DeleteOutlined, AuditOutlined } from '@ant-design/icons';
import { Button, Drawer, message, Popconfirm, Tooltip, Badge } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType, } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import ProCard from '@ant-design/pro-card';
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

type TableListItem = {
  createdAtRange?: number[];
  createdAt: number;
  code: string;
};

type DetailListProps = {
  id: number | null;
};
const DetailList: React.FC<DetailListProps> = (props) => {
  const { id } = props;
  const [ tableListDataSource, setTableListDataSource ] = useState<TableListItem[]>([]);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '时间点',
      key: 'createdAt',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: '代码',
      key: 'code',
      width: 80,
      dataIndex: 'code',
      valueType: 'code',
    },
    {
      title: '操作',
      key: 'option',
      width: 80,
      valueType: 'option',
      render: () => [ <a key="a">预警</a> ],
    },
  ];

  useEffect(() => {
    const source = [];
    for (let i = 0; i < 15; i += 1) {
      source.push({
        createdAt: Date.now() - Math.floor(Math.random() * 10000),
        code: `const getData = async params => {
          const data = await getData(params);
          return { list: data.data, ...data };
        };`,
        key: i,
      });
    }

    setTableListDataSource(source);
  }, [ id ]);

  return (
    <ProTable<TableListItem>
      columns={ columns }
      dataSource={ tableListDataSource }
      pagination={ {
        pageSize: 3,
        showSizeChanger: false,
      } }
      rowKey="key"
      toolBarRender={ false }
      search={ false }
    />
  );
};

type statusType = BadgeProps[ 'status' ];

const valueEnum: statusType[] = [ 'success', 'error', 'processing', 'default' ];

export type IpListItem = {
  ip?: string;
  cpu?: number | string;
  mem?: number | string;
  disk?: number | string;
  status: statusType;
};

const ipListDataSource: IpListItem[] = [];

for (let i = 0; i < 10; i += 1) {
  ipListDataSource.push({
    ip: `106.14.98.1${i}4`,
    cpu: 10,
    mem: 20,
    status: valueEnum[ Math.floor(Math.random() * 10) % 4 ],
    disk: 30,
  });
}

type RoleListProps = {
  onChange: (id: number) => void;
}


const RoleList: React.FC<RoleListProps> = (props) => {
  const { onChange } = props;
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
      width: 40,
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
        // <Tooltip title="绑定权限" key="setBindRole">
        //   <Button size="small" type="link" onClick={ () => { handleModalTreeVisible(true); setCurrentRow(record); } }>
        //     <AuditOutlined className="qm-table-icon" />
        //   </Button>
        // </Tooltip>
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
    <>
      <ProTable
        bordered={ true }
        size="small"
        headerTitle="查询表格"
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

      {
        createModalVisible && (
          <ModalModifyForm
            createModalVisible={ createModalVisible }
            handleModalVisible={ handleModalVisible }
            actionRef={ actionRef }
            currentRow={ currentRow }
          />
        )
      }
      {
        modalTreeVisible && currentRow !== undefined && (
          <ModalMenuTree
            modalTreeVisible={ modalTreeVisible }
            handleModalTreeVisible={ handleModalTreeVisible }
            actionRef={ actionRef }
            currentRow={ currentRow }
          />
        )
      }
      {
        selectedRowsState?.length > 0 && (
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
        )
      }
      <Drawer
        width={ 600 }
        visible={ showDetail }
        onClose={ () => {
          setCurrentRow(undefined);
          setShowDetail(false);
        } }
        closable={ false }
      >
        { currentRow?.name && (
          <ProDescriptions<RoleDataType>
            column={ 1 }
            title={ currentRow?.name }
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
    </>
  );
};


const Demo: React.FC = () => {
  const [ id, setIp ] = useState<number | null>(null);
  return (
    <ProCard split="vertical">
      <ProCard colSpan="284px" ghost>
        <RoleList onChange={ (id: number) => setIp(id) } />
      </ProCard>
      <ProCard title={ id }>
        <DetailList id={ id } />
      </ProCard>
    </ProCard>
  );
};

export default Demo;
