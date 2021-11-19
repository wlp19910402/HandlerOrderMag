import React, { useState, useEffect } from 'react';
import { Table, InputNumber, Popconfirm, Drawer, Form, Typography, message, Descriptions, Row, Col, Image } from 'antd';
import { deleteProtfolioPart, updateProtfolioPart } from '@/pages/archive/portfolio/service'
import { RecordPartsDataType } from '@/pages/archive/portfolio/data.d'
import ProDescriptions from '@ant-design/pro-descriptions';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ImageFlatList from '@/components/common/ImageFlatList'
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: RecordPartsDataType;
  index: number;
  value: string;
  children: React.ReactNode;
}
const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  value,
  ...restProps
}) => {
  const inputNode = <InputNumber min={ 0 } max={ 1000 } />;
  return (
    <td { ...restProps }>
      {editing ? (
        <Form.Item
          name={ dataIndex }
          style={ { margin: 0 } }
          rules={ [
            {
              required: true,
              message: `${title}不能为空!`,
            },
          ] }
        >
          {inputNode }
        </Form.Item>
      ) : (
          children
        ) }
    </td>
  );
};
interface ConsumableEditableProps {
  queryPartList: () => void;
  dataPartList: any[]
}
const EditableTable: React.FC<ConsumableEditableProps> = ({ queryPartList, dataPartList }) => {
  const [ form ] = Form.useForm();
  const [ editingKey, setEditingKey ] = useState('');
  const [ showDetail, setShowDetail ] = useState<boolean>(false);
  const [ currentRow, setCurrentRow ] = useState<any>();
  const isEditing = (record: any) => record.id === editingKey;
  const tiggerEdit = (record: any) => {
    form.setFieldsValue({ warrantyPeriod: record.warrantyPeriod, id: record.id });
    setEditingKey(record.id);
  };
  const tiggerCancel = () => {
    setEditingKey('');
  };
  const tiggerDelete = async (id: React.Key) => {
    let response = await deleteProtfolioPart(id)
    if (!response) return
    message.success("删除成功");
    queryPartList();
  }
  const sumbitSave = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as RecordPartsDataType;
      const newData = [ ...dataPartList ];
      const index = newData.findIndex(item => key === item.id);
      if (index > -1) {
        const item: RecordPartsDataType = newData[ index ];
        let editParams = {
          id: item.id,
          warrantyPeriod: row.warrantyPeriod,//保险周期
        }
        let response = await updateProtfolioPart(editParams)
        if (!response) return
        message.success("修改成功");
        setEditingKey('');
        queryPartList();
      } else {
      }
    } catch (errInfo) {
      console.log('异常', errInfo);
    }
  };
  const columns = [
    {
      title: '备件名称',
      dataIndex: 'baseInfo',
      render: (val: any, entity: any) => {
        return (
          <a
            onClick={ () => {
              setCurrentRow(entity);
              setShowDetail(true);
            } }
          >
            {`${val.name}` }
          </a>
        );
      }
    },
    {
      title: '备件编号',
      dataIndex: 'baseInfo',
      render: (val: any, entity: any) => val.no
    },
    {
      title: '备件类型',
      dataIndex: 'baseInfo',
      render: (val: any, entity: any) => val.typeName
    },
    {
      title: '备件型号',
      dataIndex: 'baseInfo',
      render: (val: any, entity: any) => val.modelName
    },
    {
      title: '保修周期(月)',
      dataIndex: 'warrantyPeriod',
      editable: true
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: "110px",
      hideInDescriptions: true,
      render: (_: any, record: RecordPartsDataType) => {
        const editable = isEditing(record);
        return editable ? (
          <span key="edit2">
            <a key="save" onClick={ () => sumbitSave(record.id) } style={ { marginRight: 8 } }>
              保存
            </a>
            <a key="cancel" onClick={ tiggerCancel } >取消</a>
          </span>
        ) : (
            <span key="info">
              <Typography.Link key="edit" disabled={ editingKey !== '' } onClick={ () => tiggerEdit(record) } style={ { marginRight: 8 } }>
                编辑
             </Typography.Link>
              <Popconfirm key="delete" title="确认删除吗?" onConfirm={ () => tiggerDelete(record.id) }>
                <a > 删除</a>
              </Popconfirm>
            </span>
          );
      },
    },
  ];
  let descriptionsColums = [ {
    dataIndex: 'baseInfo',
    hideInForm: true,
    hideInTable: false,
    hideInSearch: true,
    hide: true,
    render: (val: any, entity: any) => {
      return (
        <Descriptions size="small"
          column={ 1 }
          style={ { width: "100%" } }
          title="备件信息"
        >
          <Descriptions.Item label="备件名称">{ val?.name }</Descriptions.Item>
          <Descriptions.Item label="备件编号" >{ val?.no }</Descriptions.Item>
          <Descriptions.Item label="备件类型">{ val?.typeName }</Descriptions.Item>
          <Descriptions.Item label="备件型号">{ val?.modelName }</Descriptions.Item>
          <Descriptions.Item label="备件描述">{ val?.description }</Descriptions.Item>
          <Descriptions.Item label="备件创建时间">{ val?.createTime }</Descriptions.Item>
          <Descriptions.Item label="备件创建人">{ val?.createUsername }</Descriptions.Item>
          <Descriptions.Item label="备件修改时间">{ val?.updateTime }</Descriptions.Item>
          <Descriptions.Item label="备件修改人">{ val?.updateUsername }</Descriptions.Item>
          <Descriptions.Item label="备件图片"><ImageFlatList imageUrls={ val?.imgUrls } /></Descriptions.Item>
        </Descriptions>
      );
    }
  } ]
  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: RecordPartsDataType) => ({
        record,
        inputType: col.dataIndex === 'replacementCycle' ? 'number' : 'date',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  })

  useEffect(() => {
    queryPartList();
  }, [])
  return (
    <>
      <Form form={ form } component={ false }>
        <Table
          components={ {
            body: {
              cell: EditableCell,
            },
          } }
          rowKey="id"
          bordered
          dataSource={ dataPartList }
          columns={ mergedColumns }
          rowClassName="editable-row"
          pagination={ false }
          scroll={ { y: 480 } }
        />
      </Form>
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
          <ProDescriptions<RecordPartsDataType>
            prefixCls="0"
            column={ 1 }
            key={ currentRow?.id }
            request={ async () => ({
              data: currentRow || {},
            }) }
            params={ {
              id: currentRow?.id,
            } }
            columns={ descriptionsColums as ProDescriptionsItemProps<RecordPartsDataType>[] }
          />
        ) }
      </Drawer>
    </>
  );
};

export default EditableTable