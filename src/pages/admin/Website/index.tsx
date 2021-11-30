import { PlusOutlined } from '@ant-design/icons';
import { Button, Drawer, message, Switch, Select } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import DrawerDetailAndEdit from './components/DrawerDetailAndEdit';
import { queryWebsiteList, upadateWebsiteStatus, getAreaData } from './service';
import type { SiteDataType } from './data';
import ModalModifyForm from './components/ModalModifyForm';
import { queryCurUserSiteList } from '@/pages/admin/Role/service';

export type RoleCheckBoxDataType = {
  label: string;
  value: number;
};
export type SiteCheckBoxDataType = {
  label: string;
  value: number;
};
export type selectLableType = { label: string; value: string | number };
const ResumeList: React.FC<SiteDataType> = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<SiteDataType>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [roleData, setRoleData] = useState<RoleCheckBoxDataType[] | undefined>();
  const [siteData, setSiteData] = useState<SiteCheckBoxDataType[] | undefined>();
  const [initialRoleIds, setInitialRoleIds] = useState<number[] | undefined>(undefined);
  const [provinceData, setProvinceData] = useState<selectLableType[]>([]);
  const [cityData, setCityData] = useState<selectLableType[]>([]);
  const [secondCity, setSecondCity] = useState<string>('');
  const [districtData, setDistrictData] = useState<selectLableType[]>([]);
  const [districtVal, setDistrictVal] = useState<string>('');
  const columns: ProColumns<any>[] = [
    {
      title: '网点名称',
      dataIndex: 'siteName',
      width: 120,
      valueType: 'textarea',
      key: 'siteName',
      fixed: 'left',
      render: (val, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {`${val}`}
          </a>
        );
      },
    },
    {
      title: '网点编号',
      dataIndex: 'siteNo',
      hideInTable: true,
      hideInSearch: true,
      key: 'siteNo',
    },
    {
      title: '责任人',
      dataIndex: 'personLiableName',
      key: 'personLiableName',
    },
    {
      title: '责任人电话',
      key: 'personLiableMobile',
      width: 115,
      dataIndex: 'personLiableMobile',
    },
    {
      title: '省份',
      key: 'provinceCode',
      dataIndex: 'provinceName',
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        return (
          <Select
            allowClear
            onChange={async (val: string) => {
              await fetchGetCityData(val);
              setSecondCity('');
              setDistrictVal('');
              form.setFieldsValue({ provinceCode: val });
            }}
            options={provinceData}
            key="provinceCode"
          />
        );
      },
    },
    {
      title: '城市',
      key: 'cityCode',
      dataIndex: 'cityName',

      renderFormItem: (item, { type, defaultRender, onChange, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        return (
          <Select
            allowClear
            onChange={async (val) => {
              setSecondCity(val);
              setDistrictVal('');
              await fetchGetDistrictData(val);
              form.setFieldsValue({ cityCode: val });
            }}
            value={secondCity}
            options={cityData}
            key="label"
          />
        );
      },
    },
    {
      title: '区域',
      key: 'districtCode',
      dataIndex: 'districtName',
      renderFormItem: (item, { type, defaultRender, onChange, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        return (
          <Select
            allowClear
            onChange={(val) => {
              setDistrictVal(val);
              form.setFieldsValue({ districtCode: val });
            }}
            value={districtVal}
            options={districtData}
            key="label"
          />
        );
      },
    },
    {
      title: '详细地址',
      key: 'address',
      hideInSearch: true,
      dataIndex: 'address',
    },
    {
      title: '状态',
      key: 'status',
      width: 80,
      align: 'center',
      dataIndex: 'status',
      render: (val, record) => {
        return (
          <Switch
            loading={false}
            onClick={async (checked: boolean, event: Event) => {
              record.id !== undefined && switchWebsiteStatus(record.id, val === 0);
            }}
            checkedChildren="启用"
            unCheckedChildren="禁用"
            defaultChecked={val === 0}
          />
        );
      },
      renderFormItem: (item, { type, defaultRender, onChange, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        return (
          <Select
            options={[
              { value: 0, label: '启用' },
              { value: 1, label: '禁用' },
            ]}
            key="label"
          />
        );
      },
    },
  ];
  useEffect(() => {
    fetchGetProvinceData();
  }, []);
  //获取城市
  const fetchGetCityData = async (code: string) => {
    setCityData([]);
    setDistrictData([]);
    if (code !== null && code !== undefined) {
      const response = await getAreaData(code);
      if (!response) return;
      await setCityData(
        response.data.map((item: any) => ({
          label: item.areaName,
          value: item.areaCode,
        })),
      );
    }
  };
  //获取区域
  const fetchGetDistrictData = async (code: string) => {
    setDistrictData([]);
    if (code !== null && code !== undefined) {
      const response = await getAreaData(code);
      if (!response) return;
      await setDistrictData(
        response.data.map((item: any) => ({
          label: item.areaName,
          value: item.areaCode,
        })),
      );
    }
  };
  const fetchGetProvinceData = async () => {
    if (roleData === undefined) {
      const response = await getAreaData();
      if (!response) return;
      await setProvinceData(
        response.data.map((item: any) => ({
          label: item.areaName,
          value: item.areaCode,
        })),
      );
    }
  };
  const switchWebsiteStatus = async (id: number, batch: boolean) => {
    const response = await upadateWebsiteStatus(id);
    if (!response) return;
    setShowDetail(false);
    actionRef.current && actionRef.current.reloadAndRest?.();
    message.success(`${batch ? '禁用' : '启用'}成功`);
  };

  const fetchSiteListData = async () => {
    if (siteData === undefined) {
      const response = await queryCurUserSiteList();
      if (!response) return;
      await setSiteData(
        response.data.map((item: any) => ({
          label: item.siteName,
          value: item.siteId,
        })),
      );
    }
  };

  const fetchQueryWebsiteList = async (params: any) => {
    const response = await queryWebsiteList(params);
    if (!response) return { data: [] };
    const { data } = response;
    return { ...data, data: data.records };
  };
  return (
    <PageContainer header={{ title: '' }}>
      <ProTable
        bordered={true}
        scroll={{ x: 800 }}
        size="small"
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
        onReset={() => {
          setSecondCity('');
          setDistrictVal('');
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={async () => {
              await fetchSiteListData();
              await setInitialRoleIds([]);
              handleModalVisible(true);
              setCurrentRow(undefined);
            }}
          >
            <PlusOutlined />
            新增网点
          </Button>,
        ]}
        request={async (params, sorter, filter) => await fetchQueryWebsiteList({ ...params })}
        columns={columns}
        rowSelection={false}
      />
      {createModalVisible && (
        <ModalModifyForm
          createModalVisible={createModalVisible}
          handleModalVisible={handleModalVisible}
          actionRef={actionRef}
          currentRow={currentRow}
          roleData={roleData}
          siteData={siteData}
          initialRoleIds={initialRoleIds}
          setShowDetail={setShowDetail}
          provinceData={provinceData}
        />
      )}

      <Drawer
        width={'700px'}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.siteName && (
          <DrawerDetailAndEdit
            provinceData={provinceData}
            currentRow={currentRow}
            actionRef={actionRef}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ResumeList;
