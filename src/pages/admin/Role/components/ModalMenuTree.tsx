/**
 * 角色授权
 */
import React, { useState, useEffect } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import type { RoleDataType } from '../data.d';
import { message, Modal, Tree } from 'antd'
import type { Dispatch} from 'umi';
import { connect } from 'umi'
import type { MenuModelState } from '@/models/menu'
import { treeData } from '@/pages/admin/Menu/index'
import { getRoleDetail, BindRole } from '../service'
import type { MenuDataType } from '@/pages/admin/Menu/data.d'

type ModalTreeDataProps = {
  modalTreeVisible: boolean;
  handleModalTreeVisible: React.Dispatch<React.SetStateAction<boolean>>;
  actionRef: React.MutableRefObject<ActionType | undefined>;
  currentRow: RoleDataType | undefined;
  menuTree: MenuDataType[] | [];
  dispatch: Dispatch;
}
export type SaveRoleParamsType = {
  menuIds: number[];
  roleId: number;
}
const ModalTreeForm: React.FC<ModalTreeDataProps> = (props) => {
  const { modalTreeVisible, handleModalTreeVisible, menuTree, actionRef, currentRow, dispatch } = props
  const [ expandedKeys, setExpandedKeys ] = useState<React.Key[]>([ '0-0-0', '0-0-1' ]);
  const [ checkedKeys, setCheckedKeys ] = useState<React.Key[]>([]);
  const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
  const [ autoExpandParent, setAutoExpandParent ] = useState<boolean>(true);
  const [ checkedParentKeys, setCheckedParentKeys ] = useState<React.Key[]>([])
  const submitForm = async (id: number) => {
    const arrSet = new Set(checkedKeys.concat(checkedParentKeys));
    const arr = Array.from(arrSet);
    const response = await BindRole({
      menuIds: arr.map((item: any) => parseInt(item)),
      roleId: id
    })
    if (!response) return
    actionRef.current && actionRef.current.reload();
    message.success("保存成功");
    handleModalTreeVisible(false);
  }
  const onExpand = (expandedKeys: React.Key[]) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };
  const onCheck = (checkedKeys: any, info: any) => {
    setCheckedParentKeys(info.halfCheckedKeys)
    setCheckedKeys(checkedKeys);
  }
  const onSelect = (selectedKeys: React.Key[], info: any) => {
    setSelectedKeys(selectedKeys);
  };
  useEffect(() => {
    if (menuTree.length === 0) {
      dispatch({
        type: 'menu/fetchMenuTree'
      })
    }
    if (currentRow?.id) {
      getRoleDetail(currentRow.id?.toString()).then(response => {
        if (!response) return
        setCheckedKeys(response.data.menuIds.map((item: any) => item.toString()))
      })
    }
  }, [])
  return (
    <Modal title={ `绑定菜单权限:${currentRow?.roleName}` }
      visible={ modalTreeVisible }
      onOk={ () => currentRow?.id !== undefined && submitForm(currentRow?.id) }
      okText="保存"
      onCancel={ () => { handleModalTreeVisible(false) } }
      bodyStyle={ { maxHeight: "560px", overflow: "auto" } }
      maskClosable={ false }
    >
      <Tree
        checkable
        onExpand={ onExpand }
        expandedKeys={ expandedKeys }
        autoExpandParent={ autoExpandParent }
        onCheck={ onCheck }
        checkedKeys={ checkedKeys }
        onSelect={ onSelect }
        selectedKeys={ selectedKeys }
        treeData={ treeData(menuTree) }
      />
    </Modal>
  )
}


export default connect(
  ({ loading, menu }: { loading: { models: Record<string, boolean> }, menu: MenuModelState }
  ) => ({
    loading: !!loading.models.menu,
    menuTree: menu.menuTree
  }))(ModalTreeForm);