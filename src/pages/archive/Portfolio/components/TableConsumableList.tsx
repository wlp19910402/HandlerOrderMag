import React, { useState, useEffect } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryConsumableList } from '@/pages/device/Consumable/service';
import type { ConsumableListDataType } from '@/pages/device/Consumable/data.d';
import { fetchDicTypeSelectObj } from '@/pages/admin/Dictionary/service';
import CODE from '@/utils/DicCode.d';
import SearchSelect from '@/components/common/SerchSelect';
import { Button } from 'antd';
import { pickerInitialValue } from '@/utils/parameter';
interface TableConsumableListProps {
  setSelectedRows: React.Dispatch<React.SetStateAction<any[]>>;
  selectedRowsState: any[];
  setEditableRowKeys: React.Dispatch<React.SetStateAction<any[]>>;
  portfolioId: string;
}
const TableConsumableList: React.FC<TableConsumableListProps> = ({
  setSelectedRows,
  selectedRowsState = [],
  setEditableRowKeys,
  portfolioId,
}) => {
  const [searchType, setSearchType] = useState<any>({}); //设备类型
  let dicCode = async () => {
    setSearchType(await fetchDicTypeSelectObj(CODE.CONSUMABLE_TYPE));
  };
  useEffect(() => {
    dicCode();
  }, []);
  const columns: ProColumns<any>[] = [
    {
      title: '耗材名称',
      dataIndex: 'name',
    },
    {
      title: '耗材编号',
      dataIndex: 'no',
      hideInSearch: true,
    },
    {
      title: '耗材类型',
      dataIndex: 'typeName',
      hideInSearch: true,
    },
    {
      title: '耗材类型',
      dataIndex: 'type',
      hideInDescriptions: true,
      hideInTable: true,
      filters: true,
      onFilter: true,
      valueEnum: {
        ...searchType,
      },
    },
    {
      title: '耗材型号',
      dataIndex: 'modelName',
      hideInSearch: true,
      width: '100px',
    },
    {
      title: '耗材型号',
      dataIndex: 'model',
      hideInDescriptions: true,
      hideInTable: true,
      valueType: 'select',
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        const stateType = form.getFieldValue('type');
        return (
          <SearchSelect
            {...rest}
            state={{
              type: stateType,
            }}
          />
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: '48px',
      render: (_, record) => [
        <Button
          key="add"
          style={
            selectedRowsState.length > 0
              ? !!selectedRowsState.find((item) => item.consumableId === record.id)
                ? {}
                : { color: '#1890ff' }
              : { color: '#1890ff' }
          }
          type="text"
          disabled={
            selectedRowsState.length > 0
              ? !!selectedRowsState.find((item) => item.consumableId === record.id)
              : false
          }
          onClick={() => {
            selectRecord(record);
          }}
        >
          添加
        </Button>,
      ],
    },
  ];

  const selectRecord = (record: ConsumableListDataType) => {
    let replacementTime = new Date();
    let replacementCycle = 30;
    let expirationTime = new Date(
      replacementTime.getTime() + replacementCycle * 24 * 60 * 60 * 1000,
    );
    setSelectedRows([
      ...selectedRowsState,
      {
        portfolioId: parseInt(portfolioId),
        consumableId: record.id,
        consumableName: record.name,
        expirationTime: pickerInitialValue(expirationTime),
        num: 1,
        replacementCycle: replacementCycle,
        replacementTime: pickerInitialValue(replacementTime),
        consumableNo: record.no,
        consumableTypeName: record.typeName,
        consumableModelName: record.modelName,
      },
    ]);
    setEditableRowKeys([...selectedRowsState.map((item) => item.consumableId), record.id]);
  };
  const fetchQueryList = async (params: any) => {
    const response = await queryConsumableList(params);
    if (!response) return { data: [] };
    const { data } = response;
    return { ...data, data: data.records };
  };
  return (
    <ProTable
      style={{ border: '8px solid #ddd' }}
      tableStyle={{ marginTop: '-70px' }}
      size="small"
      headerTitle="请选择添加对应的耗材"
      rowKey="id"
      search={{
        labelWidth: 90,
      }}
      pagination={{
        pageSize: 4,
      }}
      request={async (params, sorter, filter) => await fetchQueryList({ ...params, ...filter })}
      columns={columns}
      scroll={{ y: 100 }}
    />
  );
};

export default TableConsumableList;
