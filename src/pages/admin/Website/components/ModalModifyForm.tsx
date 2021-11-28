/**
 * 编辑或新增网点
 */
import React, { useState, useEffect } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { getAreaData, saveWebsite } from '../service';
import type { SiteDataType, SiteSaveParams } from '../data';
import type { RoleCheckBoxDataType, SiteCheckBoxDataType, selectLableType } from '../index';
import { message, Select, Form } from 'antd';
// import { Form } from '_antd@4.17.1@antd';

type ModalModifyFormDataProps = {
  createModalVisible: boolean;
  handleModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  actionRef: React.MutableRefObject<ActionType | undefined>;
  currentRow: SiteDataType | undefined;
  roleData: RoleCheckBoxDataType[] | undefined;
  siteData: SiteCheckBoxDataType[] | undefined;
  initialRoleIds: number[] | undefined;
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>;
  provinceData: selectLableType[];
};
type AreaNameFieldType = {
  cityName?: string;
  provinceName?: string;
  districtName?: string;
};
const ModalModifyForm: React.FC<ModalModifyFormDataProps> = (props) => {
  const { createModalVisible, handleModalVisible, actionRef, currentRow, provinceData } = props;
  const [cityData, setCityData] = useState<selectLableType[]>([]);
  const [secondCity, setSecondCity] = useState<string | undefined>(currentRow?.cityCode);
  const [areaNameField, setAreaNameField] = useState<AreaNameFieldType>();
  const [districtData, setDistrictData] = useState<selectLableType[]>([]);
  const [districtVal, setDistrictVal] = useState<string | undefined>(currentRow?.districtCode);
  useEffect(() => {
    if (currentRow?.provinceCode && currentRow?.cityCode) {
      console.log(currentRow, 'currentRow');
      fetchGetCityData(currentRow?.provinceCode);
      fetchGetDistrictData(currentRow?.cityCode);
    }
  }, []);
  const submitForm = async (value: SiteSaveParams) => {
    let response;
    if (currentRow?.id !== undefined) {
      response = await saveWebsite({ id: currentRow?.id, ...value, ...areaNameField });
    } else {
      response = await saveWebsite({ ...value, ...areaNameField });
    }
    if (!response) return;
    actionRef.current && actionRef.current.reload();
    message.success(`${currentRow?.id !== undefined ? '修改' : '添加'}成功`);
    handleModalVisible(false);
  };
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
  return (
    <ModalForm
      modalProps={{
        maskClosable: false,
        okText: '保存',
      }}
      title={currentRow?.id !== undefined ? '网点编辑' : '新增网点'}
      width="720px"
      visible={createModalVisible}
      onVisibleChange={handleModalVisible}
      onFinish={async (value: any) => {
        await submitForm(value);
      }}
      labelCol={{ span: 5 }}
      layout="horizontal"
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: '请输入网点名称！',
          },
        ]}
        label="网点名称"
        name="siteName"
        placeholder="请输入网点名称"
        disabled={currentRow?.id !== undefined}
        initialValue={currentRow?.siteName}
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '请输入网点责任人！',
          },
        ]}
        label="网点责任人"
        name="personLiableName"
        placeholder="请输网点责任人"
        initialValue={currentRow?.personLiableName}
      />
      <ProFormText
        label="责任人电话"
        name="personLiableMobile"
        placeholder="请输责任人电话"
        rules={[
          { required: true, message: '请输入责任人电话！' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
        ]}
        initialValue={currentRow?.personLiableMobile}
      />
      <Form.Item
        rules={[
          {
            required: true,
            message: '请选择！',
          },
        ]}
        label="省份"
        name="provinceCode"
        initialValue={currentRow?.provinceCode}
      >
        <Select
          onChange={async (val: string, option: any) => {
            setSecondCity('');
            setDistrictVal('');
            await fetchGetCityData(val);
            setAreaNameField({ cityName: '', provinceName: option.label, districtName: '' });
          }}
          options={provinceData}
          key="provinceCode"
        />
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: '请选择！',
          },
        ]}
        label="城市"
        name="cityCode"
        initialValue={currentRow?.cityCode}
      >
        <Select
          onChange={async (val: string, option: any) => {
            setSecondCity(val);
            setDistrictVal('');
            setAreaNameField({
              provinceName: areaNameField?.provinceName,
              cityName: option.label,
              districtName: '',
            });
            fetchGetDistrictData(val);
          }}
          value={secondCity}
          options={cityData}
          key="provinceCode"
        />
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: '请选择！',
          },
        ]}
        label="城市"
        name="districtCode"
        initialValue={currentRow?.districtCode}
      >
        <Select
          allowClear
          onChange={(val: string, option: any) => {
            setDistrictVal(val);
            setAreaNameField({
              provinceName: areaNameField?.provinceName,
              cityName: areaNameField?.cityName,
              districtName: option.label,
            });
          }}
          value={districtVal}
          options={districtData}
        />
      </Form.Item>

      <ProFormTextArea
        initialValue={currentRow?.address}
        rules={[
          {
            required: true,
            message: '请输入详细地址！',
          },
        ]}
        name="address"
        label="详细地址"
        placeholder="请输入详细地址"
      />
    </ModalForm>
  );
};

export default ModalModifyForm;
