import React, { useState, useEffect } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryPartList } from '@/pages/device/Part/service';
import type { PartListDataType } from '@/pages/device/Part/data.d';
import { fetchDicTypeSelectObj } from '@/pages/admin/Dictionary/service'
import CODE from '@/utils/DicCode.d'
import SearchSelect from '@/components/common/SerchSelect'
import { Button } from 'antd'
interface TablePartListProps {
  setSelectedRows: React.Dispatch<React.SetStateAction<any[]>>
  selectedRowsState: any[];
  setEditableRowKeys: React.Dispatch<React.SetStateAction<any[]>>;
  portfolioId: string;
}
const TablePartList: React.FC<TablePartListProps> = ({ setSelectedRows, selectedRowsState = [], setEditableRowKeys, portfolioId }) => {
  const [ searchType, setSearchType ] = useState<any>({})//设备类型
  let dicCode = async () => {
    setSearchType(await fetchDicTypeSelectObj(CODE.PART_TYPE))
  }
  useEffect(() => {
    dicCode()
  }, [])
  const columns: ProColumns<any>[] = [
    {
      title: "备件名称",
      dataIndex: 'name',
    },
    {
      title: "备件编号",
      dataIndex: 'no',
      hideInSearch: true
    },
    {
      title: "备件类型",
      dataIndex: 'typeName',
      hideInSearch: true
    },
    {
      title: "备件类型",
      dataIndex: 'type',
      hideInDescriptions: true,
      hideInTable: true,
      filters: true,
      onFilter: true,
      valueEnum: {
        ...searchType
      },
    },
    {
      title: "备件型号",
      dataIndex: 'modelName',
      hideInSearch: true,
      width: "100px"
    },
    {
      title: "备件型号",
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
            { ...rest }
            state={ {
              type: stateType,
            } }
          />
        );
      },
    },
    {
      title: "操作",
      valueType: 'option',
      width: "48px",
      render: (_, record) => [
        <Button
          key="add"
          style={ selectedRowsState.length > 0 ? !!selectedRowsState.find(item => item.partId === record.id) ? {} : { color: "#1B90FF" } : { color: "#1B90FF" } }
          type="text"
          disabled={ selectedRowsState.length > 0 ? !!selectedRowsState.find(item => item.partId === record.id) : false }
          onClick={ () => {
            selectRecord(record)
          } }>添加</Button>
      ],
    },
  ];

  const selectRecord = (record: PartListDataType) => {
    setSelectedRows(
      [ ...selectedRowsState, {
        portfolioId: parseInt(portfolioId),
        partId: record.id,
        partName: record.name,
        num: 1,
        warrantyPeriod: 1,
        partNo: record.no,
        partTypeName: record.typeName,
        paryModelName: record.modelName
      } ]
    )
    setEditableRowKeys([ ...selectedRowsState.map(item => item.partId), record.id ])
  }
  const fetchQueryList = async (params: any) => {
    const response = await queryPartList(params)
    if (!response) return { data: [] }
    const { data } = response;
    return ({ ...data, data: data.records })
  }
  return (
    <ProTable
      style={ { border: "8px solid #ddd", } }
      tableStyle={ { marginTop: "-70px" } }
      size="small"
      headerTitle="请选择添加对应的备件"
      rowKey="id"
      search={ {
        labelWidth: 90,
      } }
      pagination={ {
        pageSize: 4
      } }
      request={ async (params, sorter, filter) => await fetchQueryList({ ...params, ...filter }) }
      columns={ columns }
      scroll={ { y: 100 } }
    />
  );
};

export default TablePartList;