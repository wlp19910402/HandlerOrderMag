import React, { useState } from 'react'
import type { ProColumns } from '@ant-design/pro-table'
import { EditableProTable } from '@ant-design/pro-table'
import { Modal, message, InputNumber } from 'antd'
import { PartAddDataType } from '@/pages/archive/portfolio/data.d'
import { addProtfolioPart } from '@/pages/archive/portfolio/service'
import TablePartList from '@/pages/archive/portfolio/components/TablePartList'

export type ColumnEditPartType = {
  partName: string;
  partNo: string;
  partTypeName: string;
  paryModelName: string;
} & PartAddDataType

type ModalModifyFormDataProps = {
  createModalVisible: boolean;
  handleModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  portfolioId: string;
  queryPartList: () => void;
}
const ModelPartAdd: React.FC<ModalModifyFormDataProps> = ({ createModalVisible = false, handleModalVisible, queryPartList, portfolioId }) => {
  const [ editableKeys, setEditableRowKeys ] = useState<React.Key[]>([]);
  const [ dataSource, setDataSource ] = useState<ColumnEditPartType[]>([]);
  const columns: ProColumns<ColumnEditPartType>[] = [
    {
      title: "备件名称",
      dataIndex: 'partName',
      editable: false,
      width: "80px"
    },
    {
      title: "备件编号",
      dataIndex: 'partNo',
      editable: false,
      width: "80px"
    },
    {
      title: "备件类型",
      dataIndex: 'partTypeName',
      editable: false,
      width: "80px"
    },
    {
      title: "备件型号",
      dataIndex: 'partModelName',
      editable: false,
      width: "80px"
    },
    {
      title: "报修周期(月)",
      dataIndex: 'warrantyPeriod',
      width: "100px",
      renderFormItem: (_, { isEditable }) => {
        return isEditable ? <InputNumber style={ { width: "100%" } } min={ 0 } max={ 1000 } /> : ""
      }
    },
    {
      title: "数量",
      dataIndex: 'num',
      width: "80px",
      renderFormItem: (_, { isEditable }) => {
        return isEditable ? <InputNumber style={ { width: "100%" } } min={ 1 } max={ 100 } /> : ""
      }
    },
    {
      title: '操作',
      valueType: 'option',
      width: 48,
      render: () => {
        return null;
      },
    },
  ];
  const submitConsumable = async () => {
    let data: PartAddDataType[] = dataSource.map(item => ({
      partId: item.partId,
      num: item.num,
      portfolioId: item.portfolioId,
      warrantyPeriod: item.warrantyPeriod
    }))
    let response = await addProtfolioPart(data)
    if (!response) return
    message.success("新增成功")
    handleModalVisible(false);
    queryPartList();
  }
  return (
    <>
      <Modal
        title="添加备件"
        width="90%"
        visible={ createModalVisible }
        onCancel={ () => handleModalVisible(false) }
        onOk={ submitConsumable }
        okText="保存"
        bodyStyle={ { padding: "0 " } }
      >
        <TablePartList
          selectedRowsState={ dataSource }
          setSelectedRows={ setDataSource }
          setEditableRowKeys={ setEditableRowKeys }
          portfolioId={ portfolioId }
        />
        <EditableProTable<ColumnEditPartType>
          rowKey="partId"
          headerTitle="设置新增备件内容"
          columns={ columns }
          value={ dataSource }
          onChange={ (data) => {
            setEditableRowKeys(data.map((item) => item.partId));
            setDataSource(data);
          } }
          recordCreatorProps={ false }
          editable={ {
            type: 'multiple',
            editableKeys,
            actionRender: (row: any, config: any, doms: any) => {
              return [ doms.delete ];
            },
            onValuesChange: (record: any, recordList: any) => {
              setDataSource(recordList);
            },
            onChange: setEditableRowKeys,
          } }
          scroll={ { y: 200 } }
        />
      </Modal>
    </>
  );
};

export default ModelPartAdd