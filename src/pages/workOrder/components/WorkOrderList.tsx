import { PlusOutlined, FileDoneOutlined, SendOutlined, EyeOutlined, ContainerOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, Drawer, Popconfirm, Image, Tooltip, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { queryList, cancelOrder } from '@/pages/workOrder/service';
import { orderStatusEnum, OrderListType, orderTypeEnum, orderTypeMatchInfo } from '@/pages/workOrder/data.d';
import ImgNull from '@/assets/images/images-null.png';
import ModelBindProtolioAdd from '@/pages/workOrder/components/ModelBindProtolioAdd';
import ModelSendOrder from '@/pages/workOrder/components/ModelSendOrder';
import { history } from 'umi';
import ImageFlatList from '@/components/common/ImageFlatList'
interface WorkOrderListProps {
  orderType: string;
}
const DictionaryList: React.FC<WorkOrderListProps> = ({ orderType = 'wx' }) => {
  const [ showDetail, setShowDetail ] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [ currentRow, setCurrentRow ] = useState<OrderListType>();
  const [ createModalVisible, handleModalVisible ] = useState<boolean>(false);
  const [ sendModalVisible, handleSendModalVisible ] = useState<boolean>(false);
  const columns: ProColumns<any>[] = [
    {
      title: '工单编号',
      dataIndex: 'orderNo',
      render: (val, entity) => {
        return (
          <a
            onClick={ () => {
              setCurrentRow(entity);
              setShowDetail(true);
            } }
          >
            {`${val}` }
          </a>
        );
      },
    },
    {
      title: '报单单位',
      dataIndex: 'company',
    },
    {
      title: '工单类型',
      dataIndex: 'orderType',
      hideInSearch: true,
      hideInTable: true,
      valueEnum: {
        ...orderTypeEnum,
      },
    },
    {
      title: '工单来源',
      dataIndex: 'sourceType',
    },
    {
      title: '图片',
      dataIndex: 'orderImgUrls',
      hideInSearch: true,
      render: (val: any) => {
        return val && val.length > 0 ? (
          <Image
            width="60px"
            height="60px"
            src={ `${val[ 0 ]}?x-oss-process=image/resize,h_100,w_100,m_lfit` }
            preview={ { src: val[ 0 ] } }
          />
        ) : (
            <Image width="60px" height="60px" src={ ImgNull } preview={ false }></Image>
          );
      },
    },
    {
      title: '客户姓名',
      dataIndex: 'customerName',
    },
    {
      title: '客户电话',
      dataIndex: 'customerMobile',
    },
    {
      title: '工程师',
      dataIndex: 'engineerName',
    },
    {
      title: "支持人员",
      dataIndex: "supporterNames",
      hideInSearch: true,
      hideInTable: true
    },
    {
      title: '工单状态及时间',
      dataIndex: 'status',
      width:"160px",
      render:(val,record)=>{
        return (
          <>
            <div>{orderStatusEnum[val].text}</div>
            <div style={{fontSize:'12px',color:"#999999"}}>{val!=='wpd'?record.latestOperationTime:record.createTime}</div>
          </>
        )
      }
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '设备类型',
      dataIndex: ' deviceType',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '创建人',
      dataIndex: 'createUsername',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '接单时间',
      dataIndex: 'receivingTime',
      hideInForm: true,
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '工单描述',
      dataIndex: 'workDescription',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: orderType!=='xj'?'180px':'150px',
      render: (_, record) => <>
      {orderType!=='xj'&&
        <Tooltip  title={ record.portfolioId !== '' ? '重新绑定' : '绑定档案' }>
          <Button
            key="bind"
            size="small"
            onClick={ () => {
              fetchBindPortolio(record);
            } }
            type={ record.portfolioId === '' ? 'link' : 'text' }
            disabled={ record.status === 'wc' || record.status === 'cancel' }
          >
            <FileDoneOutlined className="qm-table-icon" />
          </Button>
        </Tooltip>}
        <Tooltip title={ record.engineerId !== '' ? '重新派单' : '派单' }>
          { record.portfolioId === '' ? (
            <Popconfirm
              title="尚未绑定档案，确认去派单？"
              onConfirm={ () => {
                fetchSendOrder(record);
              } }
              disabled={ record.status === 'wc' || record.status === 'cancel' }
            >
              <Button
                type={ record.engineerId === '' ? 'link' : 'text' }
                size="small"
                disabled={ record.status === 'wc' || record.status === 'cancel' }
              >
                <SendOutlined className="qm-table-icon" />
              </Button>
            </Popconfirm>
          ) : (
              <Button
                key="send"
                type={ record.engineerId === '' ? 'link' : 'text' }
                size="small"
                onClick={ () => {
                  fetchSendOrder(record);
                } }
                disabled={ record.status === 'wc' || record.status === 'cancel' }
              >
                <SendOutlined className="qm-table-icon" />
              </Button>
            ) }
        </Tooltip>
        <Tooltip title={ '结单' }>
          <Button
            onClick={ () => { history.push(`${orderTypeMatchInfo(orderType)?.listPath}/finish/${record.orderNo}`) } }
            size="small"
            type="link"
            disabled={ record.status === 'wc' || record.status === 'cancel' }>
            <ContainerOutlined className="qm-table-icon" />
          </Button>
        </Tooltip>
        <Tooltip title={ '详情' }>
          <Button
            onClick={ () => { history.push(`${orderTypeMatchInfo(orderType)?.listPath}/info/${record.id}`) } }
            size="small" type="link">
            <EyeOutlined className="qm-table-icon" />
          </Button>
        </Tooltip>
        <Tooltip title='撤单'>
          <Popconfirm
            key="cancel"
            title="是否要撤单？"
            onConfirm={ () => {
              record.id !== undefined && tiggerCancel(record.id?.toString());
            } }
            disabled={ record.status === 'wc' || record.status === 'cancel' }
          >
            <Button
              size="small"
              type="link"
              disabled={ record.status === 'wc' || record.status === 'cancel' }
            >
              {/* <IconFont type="icon-cheshen" style={ { fontSize: "17px" } } /> */ }
              <RollbackOutlined className="qm-table-icon" />
            </Button>
          </Popconfirm>
        </Tooltip>
      </>,
    },
  ];
  const columnsDrawer = [
    ...columns.filter((item) => item.dataIndex !== 'orderImgUrls'),
    {
      title: '图片',
      dataIndex: 'orderImgUrls',
      hideInSearch: true,
      render: (val: any) => <ImageFlatList imageUrls={ val } />
    },
  ];
  const tiggerCancel = async (id: string) => {
    const response = await cancelOrder(id)
    if (!response) return
    if (actionRef.current) {
      actionRef.current.reloadAndRest?.();
    }
    message.success("撤单成功")
  };
  const listReloadAndRest = () => {
    if (actionRef.current) {
      actionRef.current.reloadAndRest?.();
    }
  };
  const fetchBindPortolio = async (record: any) => {
    await setCurrentRow(record);
    handleModalVisible(true);
  };
  const fetchSendOrder = async (record: OrderListType) => {
    await setCurrentRow(record);
    handleSendModalVisible(true);
  };
  const fetchQueryList = async (params: any) => {
    const response = await queryList(params);
    if (!response) return { data: [] };
    const { data } = response;
    return { ...data, data: data.records };
  };
  return (
    <PageContainer header={ { title: '' } }>
      <ProTable
        size="small"
        headerTitle="查询表格"
        actionRef={ actionRef }
        rowKey="id"
        search={ {
          labelWidth: 80,
        } }
        pagination={ {
          pageSize: 10,
        } }
        toolBarRender={ () => [
          <Button
            type="primary"
            onClick={ async () => {
              history.push('/workOrder/addOrder?orderType=' + orderType);
            } }
          >
            <PlusOutlined />
            新建
          </Button>,
        ] }
        request={ async (params, sorter, filter) =>
          await fetchQueryList({ ...params, ...filter, orderType: orderType })
        }
        columns={ columns }
        rowSelection={ false }
      />
      {createModalVisible && (
        <ModelBindProtolioAdd
          createModalVisible={ createModalVisible }
          handleModalVisible={ handleModalVisible }
          listReloadAndRest={ listReloadAndRest }
          currentOrder={ currentRow }
          companyName={ currentRow?.company ? currentRow?.company : '' }
        />
      ) }
      {sendModalVisible && (
        <ModelSendOrder
          createModalVisible={ sendModalVisible }
          handleModalVisible={ handleSendModalVisible }
          listReloadAndRest={ listReloadAndRest }
          currentOrder={ currentRow }
        />
      ) }
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
          <ProDescriptions<OrderListType>
            column={ 1 }
            title={ '设备信息' }
            key={ currentRow?.id }
            request={ async () => ({
              data: currentRow || {},
            }) }
            params={ {
              id: currentRow?.id,
            } }
            columns={ columnsDrawer as ProDescriptionsItemProps<OrderListType>[] }
          />
        ) }
      </Drawer>
    </PageContainer>
  );
};

export default DictionaryList;
