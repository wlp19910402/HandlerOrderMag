import {
  EditOutlined,
  MinusCircleOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Popconfirm, Tooltip, Divider, Input } from 'antd';
import React, { useRef, useEffect, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryDicListByParentId } from '../service';
import type { DicDataType } from '../data';
import styles from '../styles.less';

type DicListProps = {
  onChangeId: (brandId: number | null) => void;
  id: number | null;
  brandId: number | null;
  tiggerSaveDic: (
    params: DicDataType,
    actionRef: React.MutableRefObject<ActionType | undefined>,
  ) => void;
  tiggerUpdateDicStatus: (
    id: number,
    actionRef: React.MutableRefObject<ActionType | undefined>,
  ) => void;
  tiggerDeleteDic: (id: number, actionRef: React.MutableRefObject<ActionType | undefined>) => void;
  fetchQueryDicListByPage: (params: any) => Promise<any>;
};
const TableBarnd: React.FC<DicListProps> = (props) => {
  const {
    id,
    brandId,
    onChangeId,
    tiggerSaveDic,
    tiggerUpdateDicStatus,
    tiggerDeleteDic,
    fetchQueryDicListByPage,
  } = props;
  const actionRef = useRef<ActionType>();
  const [addInputLen, setAddInputLen] = useState<number>(0);
  const columns: ProColumns<DicDataType>[] | undefined = [
    {
      title: '产品品牌',
      dataIndex: 'name',
      key: 'name',
      render: (val, record) => {
        if (record.status === 0) return val;
        else return <span style={{ opacity: 0.5 }}>{val}</span>;
      },
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
            <a
              onClick={() => {
                record.id !== undefined && tiggerUpdateDicStatus(record.id, actionRef);
              }}
            >
              {record.status === 1 && <CheckCircleOutlined className="qm-table-icon" />}
              {record.status === 0 && <MinusCircleOutlined className="qm-table-icon" />}
            </a>
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
    onChangeId(null);
    actionRef.current && actionRef.current.reloadAndRest?.();
  }, [id]);
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
            tiggerSaveDic(record, actionRef);
          },
        }}
        rowClassName={(record: DicDataType) => {
          return record.id === brandId ? styles['split-row-select-active'] : record.id + '--' + id;
        }}
        actionRef={actionRef}
        rowKey="id"
        onRow={(record) => {
          return {
            onClick: () => {
              if (record.id) {
                onChangeId(record.id);
              }
            },
          };
        }}
        options={{
          reload: false,
          density: false,
          fullScreen: false,
          setting: false,
        }}
        search={false}
        pagination={{
          pageSize: 15,
          simple: true,
          style: { justifyContent: 'center' },
          hideOnSinglePage: true,
        }}
        scroll={{ y: 'calc(100vh - 240px)' }}
        toolBarRender={false}
        request={async (params, sorter, filter) => {
          if (id === null) return [];
          return await fetchQueryDicListByPage({
            ...params,
            sorter,
            filter,
            parentId: id,
          });
        }}
        columns={columns}
        rowSelection={false}
      />

      {id !== null && (
        <Input.Search
          placeholder="请输入品类名称"
          enterButton="添加"
          className="qm-add-suffix "
          suffix={addInputLen + '/10'}
          style={{ marginTop: '10px' }}
          maxLength={10}
          onChange={(event) => {
            setAddInputLen(event.target.value.length);
          }}
          onSearch={(val, event) => {
            tiggerSaveDic(
              {
                parentId: id,
                name: val,
                type: 'brand',
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
