import { PlusOutlined } from '@ant-design/icons';
import { Button, Tree, PageHeader, Spin } from 'antd';
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
import ProList from '@ant-design/pro-list';
import { RoleBindMenu } from '@/pages/admin/Role/service'
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
export type SaveRoleParamsType = {
  permIds: number[];
  roleId: number | null;
}
const TableAuthForm: React.FC<DetailListProps> = (props) => {
  const { id } = props;
  const [ permListByRoleId, setpermListByRoleId ] = useState<DataNode[]>([]);
  const [ expandedKeys, setExpandedKeys ] = useState<React.Key[]>([]);
  const [ checkedKeys, setCheckedKeys ] = useState<number[] | []>([]);
  const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
  const [ loading, setLoading ] = useState<boolean | undefined>(false)
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
  }, [ id ]);

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
    <Spin spinning={ loading }>
      <PageHeader
        className="qm-role-menu-header"
        title="授权"

        extra={ [ <Button disabled={ id === null } type="primary" onClick={ () => {
          setLoading(true)
          if (id !== null) RoleBindMenu({ permIds: checkedKeys, roleId: id }).then(() => setLoading(false)).catch(() => setLoading(false))
          else setLoading(false)
        } }>
          保存
        </Button>
        ] }
        style={ { margin: 0, padding: 10 } }
      >
        <div className="qm-role-table-title">菜单列表</div>
        <ProCard
          layout="default"
          ghost
          colSpan={ 24 }
          style={ {
            marginLeft: 0,
            marginRight: '0px',
            height: 'calc(100vh - 230px)',
            minHeight: '500px',
            marginBottom: '20px',
            overflow: 'auto',
          } }
          bordered
        >
          <Tree
            checkable
            disabled={ id === null }
            expandedKeys={ expandedKeys }
            style={ { justifyContent: 'left' } }
            treeData={ permListByRoleId }
            onCheck={ onCheck }
            onExpand={ onExpand }
            checkedKeys={ checkedKeys }
            onSelect={ onSelect }
            selectedKeys={ selectedKeys }
          />
        </ProCard>
      </PageHeader>
    </Spin>
  );
};

export default TableAuthForm;
