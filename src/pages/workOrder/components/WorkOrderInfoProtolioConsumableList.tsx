import { pickerDateFormat } from '@/utils/parameter'
import React, { useState } from 'react';
import { Table, Drawer, Descriptions } from 'antd';
import { RecordConsumableDataType } from '@/pages/archive/portfolio/data.d'
import ProDescriptions from '@ant-design/pro-descriptions';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ImageFlatList from '@/components/common/ImageFlatList'
interface WorkOrderInfoConsumableListProps {
  dataList: RecordConsumableDataType[] | []
}
const WorkOrderInfoConsumableList: React.FC<WorkOrderInfoConsumableListProps> = ({ dataList }) => {
  const [ showDetail, setShowDetail ] = useState<boolean>(false);
  const [ currentRow, setCurrentRow ] = useState<any>();
  const columns = [
    {
      title: 'ID',
      width: "64px",
      dataIndex: 'id',
      render: (val: any) => val
    },
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
      render: (val: any) => pickerDateFormat(val)
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

  return (
    <>
      <Table
        rowKey="id"
        bordered
        dataSource={ dataList }
        rowClassName="editable-row"
        columns={ columns }
        pagination={ false }
        scroll={ { y: 480 } }
      />
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

export default WorkOrderInfoConsumableList