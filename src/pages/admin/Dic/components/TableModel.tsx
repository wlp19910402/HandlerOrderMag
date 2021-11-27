import {
  EditOutlined,
  MinusCircleOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Popconfirm, Tooltip, Divider, Input } from 'antd';
import React, { useRef, useEffect } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryDicListByParentId } from '../service';
import type { DicDataType } from '../data';
import styles from '../styles.less';

type DicListProps = {
  id: number | null;
  tiggerSaveDic: (
    params: DicDataType,
    actionRef: React.MutableRefObject<ActionType | undefined>,
  ) => void;
  tiggerUpdateDicStatus: (
    id: number,
    actionRef: React.MutableRefObject<ActionType | undefined>,
  ) => void;
  tiggerDeleteDic: (id: number, actionRef: React.MutableRefObject<ActionType | undefined>) => void;
};
const TableBarnd: React.FC<DicListProps> = (props) => {
  const { id, tiggerSaveDic, tiggerUpdateDicStatus, tiggerDeleteDic } = props;
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<DicDataType>[] | undefined = [
    {
      title: '产品型号',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      width: 100,
      valueType: 'option',
      align: 'center',
      key: 'option',
      render: (_, record, index, action) => (
        <>
          {record.status === 0 && (
            <>
              <Tooltip title="编辑" key="edit">
                <a
                  onClick={() => {
                    if (record.id !== undefined) action?.startEditable?.(record.id);
                  }}
                >
                  <EditOutlined className="qm-table-icon" />
                </a>
              </Tooltip>
              <Divider type="vertical" />
            </>
          )}
          <Tooltip title={record.status === 1 ? '启用' : '禁用'} key="delete">
            <Popconfirm
              title={'确定要' + (record.status === 1 ? '启用' : '禁用')}
              onConfirm={() => {
                record.id !== undefined && tiggerUpdateDicStatus(record.id, actionRef);
              }}
            >
              <a>
                {record.status === 1 && <CheckCircleOutlined className="qm-table-icon" />}
                {record.status === 0 && <MinusCircleOutlined className="qm-table-icon" />}
              </a>
            </Popconfirm>
          </Tooltip>
          {record.status === 1 && (
            <>
              <Divider type="vertical" />
              <Tooltip title="删除" key="delete">
                <Popconfirm
                  title="是否要删除此行？"
                  onConfirm={() => {
                    record.id !== undefined && tiggerDeleteDic(record.id, actionRef);
                  }}
                >
                  <a>
                    <DeleteOutlined className="qm-table-icon" />
                  </a>
                </Popconfirm>
              </Tooltip>
            </>
          )}
        </>
      ),
    },
  ];
  useEffect(() => {
    actionRef.current && actionRef.current.reloadAndRest?.();
  }, [id]);
  const fetchDicListByParentId = async () => {
    if (id === null) return;
    const response: any = await queryDicListByParentId(id);
    if (!response) return;
    return response;
  };

  return (
    <div style={{ margin: 0, padding: '12px 10px 2px' }}>
      <ProTable
        className="qm-dic-table"
        bordered={true}
        size="small"
        editable={{
          type: 'single',
          actionRender: (row, config, defaultDom) => {
            return [defaultDom.save, defaultDom.cancel];
          },
          onSave: async (id: any, record: DicDataType) => {
            if (id !== undefined && id != null) tiggerSaveDic(record, actionRef);
          },
        }}
        rowClassName={(record: DicDataType) => {
          return record.id === id ? styles['split-row-select-active'] : record.id + '--' + id;
        }}
        actionRef={actionRef}
        rowKey="id"
        options={{
          reload: false,
          density: false,
          fullScreen: false,
          setting: false,
        }}
        search={false}
        pagination={{
          pageSize: 20,
          simple: true,
          style: { justifyContent: 'center' },
          hideOnSinglePage: true,
        }}
        scroll={{ y: 'calc(100vh - 240px)' }}
        toolBarRender={false}
        request={fetchDicListByParentId}
        columns={columns}
        rowSelection={false}
      />

      {id !== null && (
        <Input.Search
          placeholder="请输入品类名称"
          allowClear
          enterButton="添加"
          suffix={'0/10'}
          style={{ marginTop: '10px' }}
          maxLength={10}
          onSearch={(val, event) => {
            tiggerSaveDic(
              {
                parentId: id,
                name: val,
                type: 'model',
              },
              actionRef,
            );
            event?.cancelable;
          }}
        />
      )}
    </div>
  );
};

export default TableBarnd;
