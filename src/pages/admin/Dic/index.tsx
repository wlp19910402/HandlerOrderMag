import React, { useState } from 'react';
import ProCard from '@ant-design/pro-card';
import TableBarnd from './components/TableBarnd';
import TableModel from './components/TableModel';
import TableCategory from './components/TableCategory';
import { updateDicStatus, saveDic, deleteDic } from './service';
import type { ActionType } from '@ant-design/pro-table';
import type { DicDataType } from './data';
import { message } from 'antd';
const RoleManageCmp: React.FC = () => {
  const [id, setIp] = useState<number | null>(null);
  const [brandId, setBarndId] = useState<number | null>(null);
  const tiggerUpdateDicStatus = async (
    id: number,
    actionRef: React.MutableRefObject<ActionType | undefined>,
  ) => {
    const response = await updateDicStatus(id);
    if (!response) return;
    actionRef.current && actionRef.current.reloadAndRest?.();
    message.success('修改状态成功');
  };
  const tiggerSaveDic = async (
    params: DicDataType,
    actionRef: React.MutableRefObject<ActionType | undefined>,
  ) => {
    const response = await saveDic(params);
    if (!response) return;
    actionRef.current && actionRef.current.reloadAndRest?.();
    message.success(params.id === undefined ? '新增成功' : '编辑成功');
  };
  const tiggerDeleteDic = async (
    id: number,
    actionRef: React.MutableRefObject<ActionType | undefined>,
  ) => {
    const response = await deleteDic(id);
    if (!response) return;
    actionRef.current && actionRef.current.reloadAndRest?.();
    message.success('删除成功');
  };
  return (
    <ProCard split="vertical">
      <ProCard colSpan={8} ghost bodyStyle={{ padding: '0 0 10px ' }}>
        <TableCategory
          id={id}
          onChangeId={(id: number | null) => setIp(id)}
          tiggerSaveDic={tiggerSaveDic}
          tiggerUpdateDicStatus={tiggerUpdateDicStatus}
          tiggerDeleteDic={tiggerDeleteDic}
        />
      </ProCard>
      <ProCard colSpan={8} ghost style={{ justifyContent: 'left' }}>
        <TableBarnd
          id={id}
          brandId={brandId}
          onChangeId={(id: number | null) => setBarndId(id)}
          tiggerSaveDic={tiggerSaveDic}
          tiggerUpdateDicStatus={tiggerUpdateDicStatus}
          tiggerDeleteDic={tiggerDeleteDic}
        />
      </ProCard>
      <ProCard colSpan={8} ghost bodyStyle={{ padding: '0 0 10px ' }}>
        <TableModel
          id={brandId}
          tiggerSaveDic={tiggerSaveDic}
          tiggerUpdateDicStatus={tiggerUpdateDicStatus}
          tiggerDeleteDic={tiggerDeleteDic}
        />
      </ProCard>
    </ProCard>
  );
};

export default RoleManageCmp;
