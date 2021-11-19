import { UserSwitchOutlined } from '@ant-design/icons';
import { Button, Drawer, Tooltip } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { queryList } from '@/pages/admin/WxUser/service';
import { wxUserListDataType } from "@/pages/admin/WxUser/data";
import ModalModifyForm from './components/ModalModifyForm'

const DictionaryList: React.FC<{}> = () => {
  const [ showDetail, setShowDetail ] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [ currentRow, setCurrentRow ] = useState<wxUserListDataType>();
  const [ createModalVisible, handleModalVisible ] = useState<boolean>(false);
  const columns: ProColumns<any>[] = [
    {
      title: "微信昵称",
      dataIndex: 'wxNickname',
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
      hideInSearch: true
    },
    {
      title: "查询范围",
      dataIndex: 'onlyEngineer',
      hideInTable: true,
      valueEnum: {
        0: { text: "所有", status: false },
        1: { text: "工程师", status: true }
      },
    },
    {
      title: "工程师姓名",
      dataIndex: 'realname'
    },
    {
      title: "工程师手机号",
      dataIndex: 'mobile'
    },
    {
      title: "管理员名称",
      dataIndex: 'adminUsername',
      hideInSearch: true
    },
    {
      title: "创建时间",
      dataIndex: 'createTime',
      hideInSearch: true
    },
    {
      title: "操作",
      valueType: 'option',
      width: "60px",
      render: (_, record) => [
        <Tooltip title="授权" key="setRole">
          <Button
            type="link"
            size="small"
            onClick={ async () => { fetchUserEdit(record) } }
          >
            <UserSwitchOutlined className="qm-table-icon" />
          </Button>
        </Tooltip>
      ],
    },
  ];
  const fetchUserEdit = async (record: wxUserListDataType) => {
    await setCurrentRow(record);
    handleModalVisible(true);
  }
  const fetchQueryList = async (params: any) => {
    const response = await queryList({ ...params, onlyEngineer: params.onlyEngineer === "1" ? true : false })
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
          labelWidth: 120,
        } }
        pagination={ {
          pageSize: 10,
        } }
        request={ async (params, sorter, filter) => await fetchQueryList({ ...params, ...filter }) }
        columns={ columns }
        rowSelection={ false }
      />
      {createModalVisible && currentRow && (
        <ModalModifyForm
          createModalVisible={ createModalVisible }
          handleModalVisible={ handleModalVisible }
          actionRef={ actionRef }
          wxUserId={ currentRow.id }
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
          <ProDescriptions<wxUserListDataType>
            column={ 1 }
            title={ "工程师信息" }
            key={ currentRow?.id }
            request={ async () => ({
              data: currentRow || {},
            }) }
            params={ {
              id: currentRow?.id,
            } }
            columns={ columns as ProDescriptionsItemProps<wxUserListDataType>[] }
          />
        ) }
      </Drawer>
    </PageContainer>
  );
};

export default DictionaryList;