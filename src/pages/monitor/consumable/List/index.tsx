import { Button, Drawer, message, Popconfirm, Image } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { queryProtfolioList, quickCreateWorkOrder } from '@/pages/monitor/consumable/service';
import type { PortfolioConsumableListDataType } from '@/pages/monitor/consumable/data';
import ImgNull from '@/assets/images/images-null.png';
import { fetchDicTypeSelectObj } from '@/pages/admin/Dictionary/service'
import CODE from '@/utils/DicCode.d'
import SearchSelect from '@/components/common/SerchSelect'
import { pickerDateFormat } from '@/utils/parameter'
import ImageFlatList from '@/components/common/ImageFlatList'
const DictionaryList: React.FC<PortfolioConsumableListDataType> = () => {
  const [ showDetail, setShowDetail ] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [ currentRow, setCurrentRow ] = useState<PortfolioConsumableListDataType>();
  const [ selectedRowsState, setSelectedRows ] = useState<PortfolioConsumableListDataType[]>([]);
  const [ searchType, setSearchType ] = useState<any>({})//设备类型
  const [ searchConsumableType, setSearchConsumableType ] = useState<any>({})
  let dicCode = async () => {
    setSearchType(await fetchDicTypeSelectObj(CODE.DEVICE_TYPE))
    setSearchConsumableType(await fetchDicTypeSelectObj(CODE.CONSUMABLE_TYPE))
  }
  useEffect(() => {
    dicCode()
  }, [])
  const columns: ProColumns<any>[] = [
    {
      title: "档案编号",
      dataIndex: 'portfolioNo',
      ellipsis: true
    },
    {
      title: "单位名称",
      dataIndex: 'companyName',
      ellipsis: true
    },
    {
      title: "设备名称",
      dataIndex: 'deviceName',
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: "设备名称",
      dataIndex: 'name',
      hideInDescriptions: true,
      hideInTable: true,
      ellipsis: true
    },
    {
      title: "设备品牌",
      dataIndex: 'brandName',
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: "设备类型",
      dataIndex: 'typeName',
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: "设备类型",
      dataIndex: 'type',
      hideInDescriptions: true,
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        ...searchType
      },
    },
    {
      title: "设备品牌",
      dataIndex: 'brand',
      hideInDescriptions: true,
      hideInTable: true,
      valueType: 'select',
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        const stateType = form.getFieldValue('type');
        return (
          < SearchSelect
            { ...rest }
            state={ {
              type: stateType,
            } }
          />
        );
      },
    },
    {
      title: "设备型号",
      dataIndex: 'modelName',
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: "设备型号",
      dataIndex: 'model',
      hideInDescriptions: true,
      hideInTable: true,
      valueType: 'select',
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        const stateType = form.getFieldValue('brand');
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
      title: "耗材编号",
      dataIndex: 'consumableNo',
      hideInSearch: true
    },
    {
      title: "耗材名称",
      dataIndex: 'consumableName',
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
      title: "耗材类型",
      dataIndex: 'consumableTypeName',
      hideInSearch: true
    },
    {
      title: "耗材类型",
      dataIndex: 'consumableType',
      hideInDescriptions: true,
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        ...searchConsumableType
      },
    },
    {
      title: "耗材型号",
      dataIndex: 'consumableModelName',
      hideInSearch: true
    },
    {
      title: "耗材型号",
      dataIndex: 'consumableModel',
      hideInDescriptions: true,
      hideInTable: true,
      valueType: 'select',
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        const stateType = form.getFieldValue('consumableType');
        return (
          < SearchSelect
            { ...rest }
            state={ {
              type: stateType,
            } }
          />
        );
      },
    },
    {
      title: "到期日期范围",
      dataIndex: 'expirationStartTime',
      hideInDescriptions: true,
      hideInTable: true,
      valueType: 'dateRange'
    },
    {
      title: "耗材图片",
      dataIndex: 'imgUrls',
      hideInSearch: true,
      render: (val: any) => {
        return val && val.length > 0 ?
          (
            <Image
              width="60px" height="60px"
              src={ `${val[ 0 ]}?x-oss-process=image/resize,h_100,w_100,m_lfit` }
              preview={ { src: val[ 0 ] } }
            />
          ) : (
            <Image
              width="60px"
              height="60px"
              src={ ImgNull }
              preview={ false }
            ></Image >
          )
      }
    },
    {
      title: "到期日期",
      dataIndex: 'expirationTime',
      hideInSearch: true,
      render: (val: any) => pickerDateFormat(val)
    },
    {
      title: "更换周期(天)",
      dataIndex: 'replacementCycle',
      hideInSearch: true,
    },
    {
      title: "实际更换日期",
      dataIndex: 'replacementTime',
      hideInSearch: true
    },
    {
      title: "是否过期",
      dataIndex: 'expireFlag',
      hideInSearch: true,
      valueEnum: {
        false: { text: '未过期', status: 'Default' },
        true: { text: '已过期', status: 'Error' }
      },
    }
  ];
  const columnsDrawer = [
    ...columns.filter(item => item.dataIndex !== 'imgUrls'),
    {
      title: "设备图片",
      dataIndex: 'imgUrls',
      hideInSearch: true,
      render: (val: any) => <ImageFlatList imageUrls={ val } />
    } ]
  const fetchQueryList = async (params: any) => {
    const response = await queryProtfolioList(params)
    if (!response) return { data: [] }
    const { data } = response;
    return ({ ...data, data: data.records })
  }
  return (
    <PageContainer header={ { title: "" } }>
      <ProTable
        size="small"
        headerTitle="查询表格"
        actionRef={ actionRef }
        rowKey="id"
        search={ {
          labelWidth: 110,
        } }
        pagination={ {
          pageSize: 10,
        } }
        request={ async (params, sorter, filter) => await fetchQueryList({ ...params, ...filter }) }
        columns={ columns }
        rowSelection={ {
          onChange: (_, selectedRows: any) => setSelectedRows(selectedRows),
        } }
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{ ' ' }<a style={ { fontWeight: 600 } }>{ selectedRowsState.length }</a>{ ' ' }
              项
            </div>
          }
        >
          <Popconfirm
            title={ `是否要转换为工单` }
            onConfirm={ async () => {
              let portfolioIdArr = [ ...(new Set(selectedRowsState.map(item => item.portfolioId))) ]
              if (portfolioIdArr.length === 1) {
                let response = await quickCreateWorkOrder(portfolioIdArr[ 0 ])
                if (!response) return
                message.success("新增工单成功，请在维修工单列表中查看")
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
              } else {
                message.error(`勾选了${portfolioIdArr.length}个不同的档案耗材，请勾选相同的档案耗材`)
              }
            } }>
            <Button type="primary"> 转换为工单</Button>
          </Popconfirm>
        </FooterToolbar>
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
          <ProDescriptions<PortfolioConsumableListDataType>
            column={ 1 }
            title={ currentRow?.consumableName }
            key={ currentRow?.id }
            request={ async () => ({
              data: currentRow || {},
            }) }
            params={ {
              id: currentRow?.id,
            } }
            columns={ columnsDrawer as ProDescriptionsItemProps<PortfolioConsumableListDataType>[] }
          />
        ) }
      </Drawer>
    </PageContainer>
  );
};

export default DictionaryList;
