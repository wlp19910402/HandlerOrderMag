import { PlusOutlined } from '@ant-design/icons';
import { Button, Tree } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
// import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
// import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
// import ProDescriptions from '@ant-design/pro-descriptions';
import ProCard from '@ant-design/pro-card';
// import { queryRoleList, deleteRole } from './service';
// import type { RoleDataType } from './data.d';
// import ModalModifyForm from './components/ModalModifyForm';
// import ModalMenuTree from './components/ModalMenuTree';
// import LineWrap from '@/components/common/LineWrap';
import { queryPermByRoleId, queryPermAllData } from '@/pages/admin/UserList/service';
import type { UserListDataType } from '../../data';
import type { DataNode } from 'rc-tree/lib/interface.d';
// import styles from './styles.less';

type DetailListProps = {
  id: number | null;
};

type permListType = {
  id?: number;
  name?: string;
  checked?: boolean;
  children?: permListType[];
};

const TableAuthForm: React.FC<DetailListProps> = (props) => {
  const { id } = props;
  const [permListByRoleId, setpermListByRoleId] = useState<DataNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    if (permListByRoleId.length == 0) {
      queryPermAllData().then((res) => {
        setpermListByRoleId(treeDataFormat(res.data));
      });
    }
    if (!id) {
      setpermListByRoleId([]);
      return;
    }
    fetchPermListByRoleId();
    actionRef.current && actionRef.current.reloadAndRest?.();
  }, [id]);

  const treeDataFormat: any = (data: permListType[]) => {
    return data.map((item: permListType) => ({
      key: item.id,
      title: item.name,
      children: item.children && item.children.length > 0 ? treeDataFormat(item.children) : [],
    }));
  };
  const onExpand = (expandedKeys: React.Key[]) => {
    setExpandedKeys(expandedKeys);
  };
  const onCheck = (checkedKeys: any, info: any) => {
    // setCheckedParentKeys(info.halfCheckedKeys)
    console.log('onCheck', checkedKeys);
    setCheckedKeys(checkedKeys);
  };
  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('onSelect', selectedKeys);
    setSelectedKeys(selectedKeys);
  };
  const fetchPermListByRoleId = async () => {
    if (id === null) {
      setpermListByRoleId([]);
    }
    const response: any = await queryPermByRoleId({ roleId: id });
    if (!response) {
      // setpermListByRoleId([]);
      setCheckedKeys(response.data);
    } else {
      // setpermListByRoleId(treeDataFormat(response.data));
      // setExpandedKeys(response.data);
      setCheckedKeys(response.data);
    }
  };
  return (
    <ProCard
      ghost
      style={{
        marginTop: 8,
        marginLeft: 0,
        marginRight: '0',
        padding: '0 12px',
      }}
      gutter={[0]}
      wrap
      title="授权"
    >
      <ProCard
        
        layout="default"
        ghost
        colSpan={24}
        style={{
          marginTop: 8,
          marginLeft: 0,
          marginRight: '0px',
          height: 'calc(100vh - 240px)',
          minHeight: '500px',
          marginBottom: '20px',
          overflow: 'auto',
        }}
        bordered
      >
        <Tree
          checkable
          disabled={id === null}
          expandedKeys={expandedKeys}
          style={{ justifyContent: 'left' }}
          treeData={permListByRoleId}
          onCheck={onCheck}
          onExpand={onExpand}
          checkedKeys={checkedKeys}
          onSelect={onSelect}
          selectedKeys={selectedKeys}
        />
      </ProCard>
    </ProCard>
    // <ProTable<UserListDataType>
    //   toolBarRender={ () => [ <Button
    //     type="primary"
    //     onClick={ () => {
    //       // handleModalVisible(true);
    //       // setCurrentRow(undefined);
    //     } }
    //   >
    //     保存
    //   </Button> ] }
    //   actionRef={ actionRef }
    //   bordered={ true }
    //   columns={ columns }
    //   request={ async () => {
    //     const response = await fetchPermListByRoleId();
    //     if (!response) return;
    //     return response;
    //   } }
    //   headerTitle="权限"
    //   // dataSource={userListByRoleId}
    //   options={
    //     {
    //       reload: false,
    //       density: false,
    //       fullScreen: false,
    //       setting: false,
    //     }
    //   }
    //   pagination={ false }
    //   style={ { height: 'calc(100vh - 140px)', minHeight: "500px", } }
    //   rowKey="key"
    //   search={ false }
    // />
  );
};

export default TableAuthForm;
