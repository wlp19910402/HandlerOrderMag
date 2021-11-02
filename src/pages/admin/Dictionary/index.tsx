import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Drawer, message, Popconfirm, Tooltip } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { queryDictionaryList, deleteDictionary } from './service';
import type { DictionaryDataType } from '../data.d';
import ModalModifyForm from './components/ModalModifyForm'
export type RoleCheckBoxDataType = {
  label: string;
  value: number;
}
const DictionaryList: React.FC<DictionaryDataType> = () => {
  const [ showDetail, setShowDetail ] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [ currentRow, setCurrentRow ] = useState<DictionaryDataType>();
  const [ selectedRowsState, setSelectedRows ] = useState<DictionaryDataType[]>([]);
  const [ createModalVisible, handleModalVisible ] = useState<boolean>(false);
  const columns: ProColumns<any>[] = [
    {
      title: "字典类型",
      dataIndex: 'type',
      hideInTable: true,
      valueEnum: {
        "": { text: "所有" },
        sb_type: { text: "设备类型" },
        sb_brand: { text: "设备品牌" },
        sb_model: { text: "设备型号" },
        hc_type: { text: "耗材类型" },
        hc_model: { text: "耗材型号" },
        bj_type: { text: "备件类型" },
        bj_model: { text: "备件型号" }
      },
    },
    {
      title: "字典值",
      dataIndex: 'name',
      key: 'name',
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
      title: "字典类型",
      dataIndex: 'typeName',
      hideInSearch: true
    },
    {
      title: "字典路径",
      dataIndex: 'parentPathName',
      hideInSearch: true
    },
    {
      title: "字典路径",
      dataIndex: 'parentPath',
      hideInDescriptions: true,
      hideInTable: true,
      hideInSearch: true
    },
    {
      title: "备注",
      dataIndex: 'remark',
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: "操作",
      valueType: 'option',
      width: "94px",
      render: (_, record) => [
        <Tooltip title="编辑" key="edit">
          <Button
            key="edit"
            type="link"
            size="small"
            disabled={ record.type === "0" }
            onClick={ () => { fetchUserEdit(record) } }
          >
            <EditOutlined className="qm-table-icon" />
          </Button>
        </Tooltip>,
        <Tooltip title="删除" key="delete">
          <Popconfirm
            key="delete"
            disabled={ record.type === "0" }
            title="是否要删除此行？"
            onConfirm={ () => { record.type !== undefined && tiggerDeleteDictionary(record.id?.toString()); } }>
            <Button disabled={ record.type === "0" } size="small" type="link"><DeleteOutlined className="qm-table-icon" /></Button>
          </Popconfirm>
        </Tooltip>
      ],
    },
  ];
  const tiggerDeleteDictionary = async (id: string) => {
    const response = await deleteDictionary(id)
    if (!response) return
    if (actionRef.current) {
      actionRef.current.reloadAndRest?.();
    }
    message.success("删除成功")
  }
  const fetchUserEdit = async (record: DictionaryDataType) => {
    await setCurrentRow(record);
    handleModalVisible(true);
  }
  const fetchQueryList = async (params: any) => {
    const response = await queryDictionaryList(params)
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
        search={ {
          labelWidth: 80,
        } }
        pagination={ {
          pageSize: 10,
        } }
        toolBarRender={ () => [
          <Button type="primary" onClick={ async () => { await setCurrentRow(undefined); handleModalVisible(true); } }>
            <PlusOutlined />新建
          </Button>,
        ] }
        request={ async (params, sorter, filter) => await fetchQueryList({ ...params, sorter, filter }) }
        columns={ columns }
        rowSelection={ false }
      />
      {createModalVisible && (
        <ModalModifyForm
          createModalVisible={ createModalVisible }
          handleModalVisible={ handleModalVisible }
          actionRef={ actionRef }
          currentRow={ currentRow }
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
        { currentRow?.id && (
          <ProDescriptions<DictionaryDataType>
            column={ 1 }
            title={ currentRow?.name }
            key={ currentRow?.id }
            request={ async () => ({
              data: currentRow || {},
            }) }
            params={ {
              id: currentRow?.id,
            } }
            columns={ columns as ProDescriptionsItemProps<DictionaryDataType>[] }
          />
        ) }
      </Drawer>
    </PageContainer>
  );
};

export default DictionaryList;
