import { pickerDateFormat, pickerInitialValue } from '@/utils/parameter'
import React, { useState, useEffect } from 'react';
import { Table, InputNumber, Popconfirm, Drawer, Form, Typography, DatePicker, message, Descriptions, Row, Col, Image } from 'antd';
import { deleteProtfolioConsumable, updateProtfolioConsumable } from '@/pages/archive/portfolio/service'
import { RecordConsumableDataType } from '@/pages/archive/portfolio/data.d'
import ProDescriptions from '@ant-design/pro-descriptions';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ImageFlatList from '@/components/common/ImageFlatList'
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
// const disabledDate = (current: any) => {
//   // if (!dates || dates.length === 0) {
//   //   return false;
//   // }
//   // const tooLate = dates[ 0 ] && current.diff(dates[ 0 ], 'days') > 7;
//   // const tooEarly = dates[ 1 ] && dates[ 1 ].diff(current, 'days') > 7;
//   // return tooEarly || tooLate;

//   return current.diff(new Date(), 'days') < -1
// };
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
  const inputNode = inputType === 'number' ? <InputNumber min={ 0 } /> : <DatePicker
    picker="date"
    mode="date"
    format="YYYY-MM-DD"
    placeholder={ `请选择${title}` }
    style={ { width: "100%" } }
    allowClear={ false }
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
  queryConsumableList: () => void;
  dataConsumableList: any[]
}
const EditableTable: React.FC<ConsumableEditableProps> = ({ queryConsumableList, dataConsumableList }) => {
  const [ form ] = Form.useForm();
  const [ editingKey, setEditingKey ] = useState('');
  const [ showDetail, setShowDetail ] = useState<boolean>(false);
  const [ currentRow, setCurrentRow ] = useState<any>();
  const isEditing = (record: any) => record.id === editingKey;
  const tiggerEdit = (record: any) => {
    form.setFieldsValue({ expirationTime: pickerInitialValue(record.expirationTime), replacementCycle: record.replacementCycle, replacementTime: pickerInitialValue(record.replacementTime), id: record.id });
    setEditingKey(record.id);
  };
  const tiggerCancel = () => {
    setEditingKey('');
  };
  const tiggerDelete = async (id: React.Key) => {
    let response = await deleteProtfolioConsumable(id)
    if (!response) return
    message.success("删除成功");
    queryConsumableList();
  }
  const sumbitSave = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as RecordConsumableDataType;
      const newData = [ ...dataConsumableList ];
      const index = newData.findIndex(item => key === item.id);
      if (index > -1) {
        const item: RecordConsumableDataType = newData[ index ];
        let editParams = {
          expirationTime: pickerDateFormat(row.expirationTime),//到期时间
          id: item.id,
          replacementCycle: row.replacementCycle,//更换周期
          replacementTime: pickerDateFormat(row.replacementTime)
        }
        let response = await updateProtfolioConsumable(editParams)
        if (!response) return
        message.success("修改成功");
        setEditingKey('');
        queryConsumableList();
      } else {
      }
    } catch (errInfo) {
      console.log('异常', errInfo);
    }
  };
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
      title: '耗材编号',
      dataIndex: 'baseInfo',
      render: (val: any, entity: any) => val.no
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
      editable: true,
      width: "160px",
      render: (val: any) => pickerDateFormat(val)
    },
    {
      title: '更换周期(天)',
      dataIndex: 'replacementCycle',
      editable: true,
      width: "120px",
      inputType: "number",
    },
    {
      title: '到期日期',
      dataIndex: 'expirationTime',
      editable: true,
      width: "160px",
      render: (val: any) => pickerDateFormat(val)
    },
    {
      title: '操作',
      dataIndex: 'operation',
      hideInDescriptions: true,
      width: "110px",
      render: (_: any, record: RecordConsumableDataType) => {
        const editable = isEditing(record);
        return editable ? (
          <span key="edit">
            <a onClick={ () => sumbitSave(record.id) } style={ { marginRight: 8 } }>
              保存
            </a>
            <a onClick={ tiggerCancel } >取消</a>
          </span>
        ) : (
            <span key="info">
              <Typography.Link disabled={ editingKey !== '' } onClick={ () => tiggerEdit(record) } style={ { marginRight: 8 } }>
                编辑
             </Typography.Link>
              <Popconfirm title="确认删除吗?" onConfirm={ () => tiggerDelete(record.id) }>
                <a > 删除</a>
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

  useEffect(() => {
    queryConsumableList();
  }, [])
  return (
    <>
      <Form form={ form }
        onFieldsChange={ (data) => {
          let fieldName = data[ 0 ].name[ 0 ]
          if (fieldName === "replacementCycle" || fieldName === "replacementTime") {
            let timeCycle = parseInt(form.getFieldValue("replacementCycle") ? form.getFieldValue("replacementCycle") : "0") * 1000 * 24 * 60 * 60
            let getReplaceTime = (new Date(pickerDateFormat(form.getFieldValue("replacementTime")))).getTime()
            form.setFieldsValue({ "expirationTime": pickerInitialValue(new Date(getReplaceTime + timeCycle)) })
          }
        } }
        component={ false }
      >
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
    </>
  );
};

export default EditableTable