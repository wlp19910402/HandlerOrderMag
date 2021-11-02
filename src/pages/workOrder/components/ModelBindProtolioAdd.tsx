import { ConsumableAddDataType } from '@/pages/archive/portfolio/data.d'
import { Drawer, Image,  Modal, message, Popconfirm } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { queryProtfolioList } from '@/pages/archive/portfolio/service';
import type { PortfolioListDataType } from '@/pages/archive/portfolio/data.d';
import ImgNull from '@/assets/images/images-null.png';
import { fetchDicTypeSelectObj } from '@/pages/admin/Dictionary/service'
import CODE from '@/utils/DicCode.d'
import SearchSelect from '@/components/common/SerchSelect'
import { pickerDateFormat } from '@/utils/parameter'
import { bindProtolio } from '@/pages/workOrder/service'
import ImageFlatList from '@/components/common/ImageFlatList'
export type ColumnEditConsumableType = {
  consumableName: string;
  consumableNo: string;
  consumableTypeName: string;
  consumableModelName: string;
} & ConsumableAddDataType

type ModalModifyFormDataProps = {
  createModalVisible: boolean;
  handleModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  companyName: string;
  bindProtolioInfo?: (val: any) => void;
  listReloadAndRest?: () => void;
  currentOrder?: any;
}
const ModelConsumableAdd: React.FC<ModalModifyFormDataProps> = ({ createModalVisible = false, handleModalVisible, companyName, bindProtolioInfo, listReloadAndRest, currentOrder }) => {
  const [ showDetail, setShowDetail ] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [ currentRow, setCurrentRow ] = useState<PortfolioListDataType>();
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
      ellipsis: true,
      initialValue: companyName
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
      hideInTable: true,
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
      width: "48px",
      render: (_, record) => [
        <Popconfirm
          key="add"
          title="确定绑定当前档案？"
          onConfirm={ () => { tiggerBindProtolio(record) } }>
          <a >绑定</a>
        </Popconfirm>
      ],
    },
  ];
  const tiggerBindProtolio = async (record: any) => {
    //接单-新增工单填写信息时进行绑定档案
    if (bindProtolioInfo) {
      bindProtolioInfo(record);
      handleModalVisible(false);
      return
    }
    //在工单列表中进行绑定档案
    let response = await bindProtolio({
      id: currentOrder.id,
      portfolioId: record.id
    })
    if (!response) return
    message.success("绑定成功");
    if (listReloadAndRest) listReloadAndRest();
    handleModalVisible(false);
  }
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
    <>
      <Modal
        title="绑定档案"
        width="90%"
        visible={ createModalVisible }
        footer={ null }
        bodyStyle={ { padding: "0 " } }
        onCancel={ () => handleModalVisible(false) }
      >
        <ProTable
          headerTitle="查询表格"
          actionRef={ actionRef }
          rowKey="id"
          style={ { padding: 0 } }
          search={ {
            labelWidth: 90,
          } }
          pagination={ {
            pageSize: 10,
          } }
          size="small"
          request={ async (params, sorter, filter) => await fetchQueryList({ ...params, ...filter }) }
          columns={ columns }
          scroll={ { y: 300 } }
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
            <ProDescriptions<PortfolioListDataType>
              column={ 1 }
              title={ "设备档案信息" }
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
      </Modal>
    </>
  );
};

export default ModelConsumableAdd