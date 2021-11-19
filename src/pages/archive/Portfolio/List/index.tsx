import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Drawer, message, Popconfirm, Image, Tooltip } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { queryProtfolioList, deleteProtfolio } from '@/pages/archive/portfolio/service';
import type { PortfolioListDataType } from '@/pages/archive/portfolio/data';
import ImgNull from '@/assets/images/images-null.png';
import { fetchDicTypeSelectObj } from '@/pages/admin/Dictionary/service'
import CODE from '@/utils/DicCode.d'
import { history, Link } from 'umi'
import SearchSelect from '@/components/common/SerchSelect'
import { pickerDateFormat } from '@/utils/parameter'
import ImageFlatList from '@/components/common/ImageFlatList'
// const handleRemove = async (selectedRows: PortfolioListDataType[]) => {
//   const hide = message.loading('正在删除');
//   if (!selectedRows) return true;
//   try {
//     hide;
//     message.success('删除成功，即将刷新');
//     return true;
//   } catch (error) {
//     hide;
//     message.error('删除失败，请重试');
//     return false;
//   }
// };
const DictionaryList: React.FC<PortfolioListDataType> = () => {
  const [ showDetail, setShowDetail ] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [ currentRow, setCurrentRow ] = useState<PortfolioListDataType>();
  const [ selectedRowsState, setSelectedRows ] = useState<PortfolioListDataType[]>([]);
  const [ searchType, setSearchType ] = useState<any>({})//设备类型
  let dicCode = async () => {
    setSearchType(await fetchDicTypeSelectObj(CODE.DEVICE_TYPE))
  }
  useEffect(() => {
    dicCode()
  }, [])
  const columns: ProColumns<any>[] = [
    {
      title: "档案编号",
      dataIndex: 'no',
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
      }
    },
    {
      title: "单位名称",
      dataIndex: 'companyName',
      ellipsis: true
    },
    {
      title: "单位编号",
      dataIndex: 'companyNo',
      hideInSearch: true,
    },
    {
      title: "单位联系人",
      dataIndex: 'contactUser',
      hideInSearch: true,
      hideInTable: true
    },
    {
      title: "单位联系电话",
      dataIndex: 'contactMobile',
      hideInSearch: true,
      hideInTable: true
    },
    {
      title: "二维码编号",
      dataIndex: 'qrCodde',
      ellipsis: true
    },
    {
      title: "设备名称",
      dataIndex: 'deviceName',
    },
    {
      title: "设备编号",
      dataIndex: 'deviceNo',
      hideInSearch: true
    },
    {
      title: "设备图片",
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
      title: "设备品牌",
      dataIndex: 'brandName',
      hideInSearch: true,
    },
    {
      title: "设备类型",
      dataIndex: 'typeName',
      hideInSearch: true
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
      title: "安装位置",
      dataIndex: 'installLocation',
      hideInSearch: true,
      hideInTable: true,
      ellipsis: true
    },
    {
      title: "安装日期",
      dataIndex: 'installTime',
      hideInSearch: true,
      hideInTable: true,
      render: (val: any) => pickerDateFormat(val)
    },
    {
      title: "设备描述",
      dataIndex: 'description',
      hideInForm: true,
      hideInTable: true,
      hideInSearch: true
    },
    {
      title: "创建人",
      dataIndex: 'createUsername',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true
    },
    {
      title: "创建时间",
      dataIndex: 'createTime',
      hideInForm: true,
      hideInTable: true,
      hideInSearch: true
    },
    {
      title: "修改人",
      dataIndex: 'updateUsername',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true
    },
    {
      title: "修改时间",
      dataIndex: 'updateTime',
      hideInForm: true,
      hideInTable: true,
      hideInSearch: true
    },
    {
      title: "操作",
      valueType: 'option',
      width: "120px",
      render: (_, record) => [
        <Tooltip title="编辑" key="edit">
          <Link to={ `/archive/portfolio/edit/${record.id}` }>
            <EditOutlined className="qm-table-icon" />
          </Link>
        </Tooltip>,
        <Tooltip title="删除" key="delete">
          <Popconfirm
            title="是否要删除此行？"
            onConfirm={ () => { record.id !== undefined && tiggerDelete(record.id?.toString()); } }>
            <Button size="small" type="link"><DeleteOutlined className="qm-table-icon" /></Button>
          </Popconfirm>
        </Tooltip>,
        ,
        <Tooltip title="详情" key="info">
          <Link key="edit" to={ `/archive/portfolio/info/${record.id}` }>
            <EyeOutlined className="qm-table-icon" />
          </Link>
        </Tooltip>
      ],
    },
  ];
  const columnsDrawer = [
    ...columns.filter(item => item.dataIndex !== 'imgUrls'),
    {
      title: "设备图片",
      dataIndex: 'imgUrls',
      hideInSearch: true,
      render: (val: any) => <ImageFlatList imageUrls={ val } />
    } ]
  const tiggerDelete = async (id: string) => {
    const response = await deleteProtfolio(id)
    if (!response) return
    if (actionRef.current) {
      actionRef.current.reloadAndRest?.();
    }
    message.success("删除成功")
  }
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
        toolBarRender={ () => [
          <Button type="primary" onClick={ async () => { history.push('/archive/portfolio/create') } }>
            <PlusOutlined />新建
          </Button>,
        ] }
        request={ async (params, sorter, filter) => await fetchQueryList({ ...params, ...filter }) }
        columns={ columns }
        // rowSelection={ {
        //   onChange: (_, selectedRows: any) => setSelectedRows(selectedRows),
        // } }
        rowSelection={ false }
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
            title={ `是否要批量删除 ${selectedRowsState.length} 项` }
            onConfirm={ async () => {
              // await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            } }>
            <Button
            >
              批量删除
          </Button>
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
          <ProDescriptions<PortfolioListDataType>
            column={ 1 }
            title={ currentRow?.name }
            key={ currentRow?.id }
            request={ async () => ({
              data: currentRow || {},
            }) }
            params={ {
              id: currentRow?.id,
            } }
            columns={ columnsDrawer as ProDescriptionsItemProps<PortfolioListDataType>[] }
          />
        ) }
      </Drawer>
    </PageContainer>
  );
};

export default DictionaryList;
