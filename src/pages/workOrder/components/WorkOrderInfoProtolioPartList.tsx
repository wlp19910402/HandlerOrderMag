import React, { useState } from 'react';
import { Table, Drawer, Descriptions } from 'antd';
import { RecordPartsDataType } from '@/pages/archive/portfolio/data.d'
import ProDescriptions from '@ant-design/pro-descriptions';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ImageFlatList from '@/components/common/ImageFlatList'
interface WorkOrderInfoConsumableListProps {
  dataList: RecordPartsDataType[] | []
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
          <ProDescriptions<RecordPartsDataType>
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
            columns={ descriptionsColums as ProDescriptionsItemProps<RecordPartsDataType>[] }
          />
        ) }
      </Drawer>
    </>
  );
};

export default WorkOrderInfoConsumableList