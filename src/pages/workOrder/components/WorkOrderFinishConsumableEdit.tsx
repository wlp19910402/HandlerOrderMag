import { pickerDateFormat, pickerInitialValue } from '@/utils/parameter'
import React, { useState, useEffect } from 'react';
import { Table, InputNumber, Popconfirm, Drawer, Spin, Form, Button, DatePicker, Descriptions, Row, Col, Image } from 'antd';
import { RecordConsumableDataType } from '@/pages/archive/portfolio/data.d'
import ProDescriptions from '@ant-design/pro-descriptions';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ImageFlatList from '@/components/common/ImageFlatList'
import { infoProtfolio } from '@/pages/archive/portfolio/service'
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: RecordConsumableDataType;
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
  const inputNode = inputType === 'number' ? <InputNumber min={ 0 } max={ 1000 } /> : <DatePicker
    picker="date"
    mode="date"
    format="YYYY-MM-DD"
    placeholder={ `请选择${title}` }
    disabledDate={ (current) => current.diff(new Date(), 'days') < -1 }
    style={ { width: "100%" } }
  />;
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
  portfolioId: React.Key;
  consumableUpdate: any[];
  setConsumableUpdate: React.Dispatch<React.SetStateAction<any[]>>
}
const EditableTable: React.FC<ConsumableEditableProps> = ({ portfolioId, setConsumableUpdate, consumableUpdate }) => {
  const [ form ] = Form.useForm();
  const [ editingKey, setEditingKey ] = useState('');
  const [ showDetail, setShowDetail ] = useState<boolean>(false);
  const [ currentRow, setCurrentRow ] = useState<any>();
  const [ dataConsumableList, setDataConsumableList ] = useState<any[]>([])
  const [ dataConsumableListOrgin, setDataConsumableListOrgin ] = useState<any[]>([])
  const [ loading, setLoading ] = useState<boolean>(true)
  const isEditing = (record: any) => record.id === editingKey;
  const tiggerEdit = (record: any) => {
    let dateParems = (new Date()).getTime() + parseInt(record.replacementCycle) * 24 * 60 * 60 * 1000
    form.setFieldsValue({ expirationTime: pickerInitialValue(new Date(dateParems)), id: record.id });
    setEditingKey(record.id);
  };
  const tiggerCancel = () => {
    setEditingKey('');
  };
  const initFun = async () => {
    let response = await infoProtfolio(portfolioId)
    setLoading(false)
    if (!response) return
    setDataConsumableList(response.data.consumables)
    setDataConsumableListOrgin(response.data.consumables.map((item: any) => ({ id: item.id, expirationTime: item.expirationTime })))
  }
  useEffect(() => {
    initFun()
  }, [])
  const tiggerDeleteUpdate = async (id: React.Key) => {
    let updateData = consumableUpdate.filter(item => item.pcId !== id)
    let orginExpirationTime = dataConsumableListOrgin.find(item => item.id === id).expirationTime
    let newData = dataConsumableList.map(item => {
      if (item.id === id) {
        item.expirationTime = orginExpirationTime
      }
      return item
    })
    setConsumableUpdate(updateData)
    setDataConsumableList(newData)
  }
  const sumbitSave = async (key: React.Key) => {
    const row = (await form.validateFields()) as RecordConsumableDataType;
    const newData = dataConsumableList.map(item => {
      if (item.id === key) {
        item.expirationTime = pickerDateFormat(row.expirationTime)
      }
      return item
    });
    setDataConsumableList(newData)
    let editParams = {
      expirationTime: pickerDateFormat(row.expirationTime),//到期时间
      pcId: key
    }
    let updateData: any[] = []
    if (consumableUpdate?.find((item: any) => item.pcId === key)) {
      updateData = consumableUpdate?.map(item => {
        if (item.pcId === key) {
          item.expirationTime = editParams.expirationTime
        }
        return item
      })
    } else {
      updateData = [ ...consumableUpdate, editParams ]
    }
    setConsumableUpdate(updateData)
    setEditingKey('');
  }
  const columns = [
    {
      title: '耗材名称',
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
      title: '耗材类型',
      dataIndex: 'baseInfo',
      render: (val: any, entity: any) => val.typeName
    },
    {
      title: '耗材型号',
      dataIndex: 'baseInfo',
      render: (val: any, entity: any) => val.modelName
    },
    {
      title: '安装日期',
      dataIndex: 'replacementTime',
      render: (val: any) => pickerDateFormat(val)
    },
    {
      title: '更换周期(天)',
      dataIndex: 'replacementCycle',
      inputType: "number",
    },
    {
      title: '到期日期',
      dataIndex: 'expirationTime',
      editable: true,
      width: "180px",
      render: (val: any) => pickerDateFormat(val)
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: "140px",
      hideInDescriptions: true,
      render: (_: any, record: RecordConsumableDataType) => {
        const editable = isEditing(record);
        return editable ? (
          <span key="edit">
            <Button size="small" type="link" onClick={ () => sumbitSave(record.id) } style={ { marginRight: 8 } }>
              保存
            </Button>
            <Button size="small" type="link" onClick={ tiggerCancel } >取消</Button>
          </span>
        ) : (
            <span key="info">
              <Button
                size="small"
                type="link"
                disabled={ editingKey !== '' }
                onClick={ () => tiggerEdit(record) }
                style={ { marginRight: 8 } }>
                { consumableUpdate.find(item => item.pcId === record.id) === undefined ? "更换" : "编辑" }
              </Button>
              <Popconfirm disabled={ consumableUpdate.find(item => item.pcId === record.id) === undefined } title="确认取消更换吗?" onConfirm={ () => tiggerDeleteUpdate(record.id) }>
                <Button size="small" type="link" disabled={ consumableUpdate.find(item => item.pcId === record.id) === undefined }>取消</Button>
              </Popconfirm>
            </span>
          );
      },
    },
  ];
  let descriptionsColums = [
    {
      title: '',
      dataIndex: 'baseInfo',
      hideInForm: true,
      hideInTable: false,
      hideInSearch: true,
      hide: true,
      render: (val: any, entity: any) => {
        return (
          <span>
            <Descriptions size="small"
              column={ 1 }
              style={ { width: "100%" } }
              title="耗材信息"
            >
              <Descriptions.Item label="耗材名称">{ val?.name }</Descriptions.Item>
              <Descriptions.Item label="耗材编号" >{ val?.no }</Descriptions.Item>
              <Descriptions.Item label="耗材类型">{ val?.typeName }</Descriptions.Item>
              <Descriptions.Item label="耗材型号">{ val?.modelName }</Descriptions.Item>
              <Descriptions.Item label="耗材描述">{ val?.description }</Descriptions.Item>
              <Descriptions.Item label="耗材创建时间">{ val?.createTime }</Descriptions.Item>
              <Descriptions.Item label="耗材创建人">{ val?.createUsername }</Descriptions.Item>
              <Descriptions.Item label="耗材修改时间">{ val?.updateTime }</Descriptions.Item>
              <Descriptions.Item label="耗材修改人">{ val?.updateUsername }</Descriptions.Item>
              <Descriptions.Item label="耗材图片"><ImageFlatList imageUrls={ val?.imgUrls } /></Descriptions.Item>
            </Descriptions>
          </span>
        );
      }
    } ]
  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: RecordConsumableDataType) => ({
        record,
        inputType: col.dataIndex === 'replacementCycle' ? 'number' : 'date',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  })
  return (
    <Spin spinning={ loading }>
      <Form form={ form } component={ false }>
        <Table
          components={ {
            body: {
              cell: EditableCell,
            },
          } }
          rowKey="id"
          bordered
          dataSource={ dataConsumableList }
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
          <ProDescriptions<RecordConsumableDataType>
            prefixCls="0"
            column={ 1 }
            title={ " " }
            key={ currentRow?.id }
            request={ async () => ({
              data: currentRow || {},
            }) }
            params={ {
              id: currentRow?.id,
            } }
            columns={ descriptionsColums as ProDescriptionsItemProps<RecordConsumableDataType>[] }
          />
        ) }
      </Drawer>
    </Spin>
  );
};

export default EditableTable