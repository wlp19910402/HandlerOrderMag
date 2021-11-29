/**
 * 网点详情和编辑
 */
import React, { useState } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import type { SiteDataType } from '../data';
import { saveWebsiteArea } from '../service';
import { Form, Input, message, Button, Card, Collapse, Select } from 'antd';
import { getAreaData } from '../service';

type DrawerDetailAndEditDataProps = {
  currentRow: SiteDataType | undefined;
  actionRef: React.MutableRefObject<ActionType | undefined>;
  provinceData: selectLableType[]
};
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
type selectLableType = { label: string; value: string | number };
const WebsiteInfoEdit: React.FC<DrawerDetailAndEditDataProps> = (props) => {
  const { currentRow, actionRef, provinceData } = props;
  const [ cityData, setCityData ] = useState<selectLableType[]>([]);
  const [ secondCity, setSecondCity ] = useState<string>('');
  const [ districtData, setDistrictData ] = useState<selectLableType[]>([]);
  const [ districtVal, setDistrictVal ] = useState<string>('');
  const [ streetCommunityData, setStreetCommunityData ] = useState<selectLableType[]>([]);
  const [ streetCommunityVal, setStreetCommunityVal ] = useState<string>('');
  const [ nameObj, setNameObj ] = useState<object>({})
  const onSaveWebsiteAreaInfo = async (values: any) => {
    let response = await saveWebsiteArea({ siteId: currentRow?.id, ...values, ...nameObj });
    if (!response) return;
    actionRef.current && actionRef.current.reload();
    message.success(`${currentRow?.id !== undefined ? '修改' : '添加'}成功`);
  };
  const validateMessages = {
    required: '${label} 是必填项!',
  };
  const fetchGetCityData = async (code: string) => {
    setCityData([]);
    setDistrictData([]);
    setStreetCommunityData([])
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
    setStreetCommunityData([])
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
  //获取街道
  const fetchGetStreetCommunityData = async (code: string) => {
    setStreetCommunityData([])
    if (code !== null && code !== undefined) {
      const response = await getAreaData(code);
      if (!response) return;
      await setStreetCommunityData(
        response.data.map((item: any) => ({
          label: item.areaName,
          value: item.areaCode,
        })),
      );
    }
  };
  return (
    <div>
      <Collapse defaultActiveKey={ [ '1' ] }>
        <Collapse.Panel header="新增服务区域" key="1">
          <Form
            { ...layout }
            name="nest-messages"
            onFinish={ onSaveWebsiteAreaInfo }

            validateMessages={ validateMessages }
          >
            <Form.Item label="省份" name="provinceCode">
              <Select
                allowClear
                onChange={ async (val: string, option: any) => {
                  setSecondCity('');
                  setDistrictVal('');
                  setStreetCommunityVal('')
                  setNameObj({ provinceName: option.label, cityName: '', districtName: '', streetCommunityName: '' })
                  await fetchGetCityData(val);
                } }
                options={ provinceData }
                key="provinceCode"
              />
            </Form.Item>
            <Form.Item label="城市" name="cityCode">
              <Select
                allowClear
                onChange={ async (val, option: any) => {
                  setSecondCity(val);
                  setDistrictVal('');
                  setStreetCommunityVal('')
                  setNameObj({ ...nameObj, cityName: option.label, districtName: '', streetCommunityName: '' })
                  await fetchGetDistrictData(val);
                } }
                value={ secondCity }
                options={ cityData }
                key="label"
              />
            </Form.Item>
            <Form.Item label="区域" name="districtCode">
              <Select
                allowClear
                onChange={ async (val, option: any) => {
                  setDistrictVal(val);
                  setStreetCommunityVal('')
                  setNameObj({ ...nameObj, districtName: option.label, streetCommunityName: '' })
                  await fetchGetStreetCommunityData(val);
                } }
                value={ districtVal }
                options={ districtData }
                key="label"
              />
            </Form.Item>
            <Form.Item label="街道" name="streetCommunityCode">
              <Select
                allowClear
                onChange={ (val, option: any) => {
                  setStreetCommunityVal(val)
                  setNameObj({ ...nameObj, streetCommunityName: option.label })
                } }
                value={ streetCommunityVal }
                options={ streetCommunityData }
                key="label"
              />
            </Form.Item>
            <Form.Item wrapperCol={ { ...layout.wrapperCol, offset: 6 } }>
              <Button type="primary" htmlType="submit">
                新增
              </Button>
            </Form.Item>
          </Form>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default WebsiteInfoEdit;
