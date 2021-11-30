/**
 * 网点详情和编辑
 */
import React, { useState, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { SiteDataType } from '../data';
import ProTable from '@ant-design/pro-table';
import { saveWebsiteArea, getAreaData, getAreaDataByWebsite } from '../service';
import { Form, Tag, message, Button, Card, Collapse, Select } from 'antd';

type DrawerDetailAndEditDataProps = {
  currentRow: SiteDataType | undefined;
  actionRef: React.MutableRefObject<ActionType | undefined>;
  provinceData: selectLableType[];
  siteId: number | undefined;
};
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
type selectLableType = { label: string; value: string | number };
const WebsiteInfoEdit: React.FC<DrawerDetailAndEditDataProps> = (props) => {
  const { currentRow, actionRef, provinceData, siteId } = props;
  const [cityData, setCityData] = useState<selectLableType[]>([]);
  const [secondCity, setSecondCity] = useState<string>('');
  const [districtData, setDistrictData] = useState<selectLableType[]>([]);
  const [districtVal, setDistrictVal] = useState<string>('');
  const [streetCommunityData, setStreetCommunityData] = useState<selectLableType[]>([]);
  const [streetCommunityVal, setStreetCommunityVal] = useState<string>('');
  const [nameObj, setNameObj] = useState<object>({});
  const onSaveWebsiteAreaInfo = async (values: any) => {
    let response = await saveWebsiteArea({ siteId, ...values, ...nameObj });
    if (!response) return;
    actionRef.current && actionRef.current.reload();
    message.success(`${currentRow?.id !== undefined ? '修改' : '添加'}成功`);
  };
  const validateMessages = {
    required: '${label} 是必填项!',
  };
  const actionRefCur = useRef<ActionType>();
  const columns: ProColumns<any>[] = [
    {
      title: '省份名称',
      dataIndex: 'provinceName',
      width: 120,
    },
    {
      title: '城市名称',
      dataIndex: 'cityName',
      key: 'cityName',
    },
    {
      title: '区县名称',
      dataIndex: 'districtName',
      key: 'districtName',
    },
    {
      title: '街道/社区名称',
      key: 'streetCommunityName',
      dataIndex: 'streetCommunityName',
    },
  ];
  const fetchGetCityData = async (code: string) => {
    setCityData([]);
    setDistrictData([]);
    setStreetCommunityData([]);
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
    setStreetCommunityData([]);
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
    setStreetCommunityData([]);
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
  const fetchQueryUserListBySiteId = async (params: any) => {
    const response = await getAreaDataByWebsite({ ...params, siteId });
    if (!response) return { data: [] };
    const { data } = response;
    return { ...data, data: data.records };
  };
  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="新增服务区域" key="1">
          <Form
            {...layout}
            name="nest-messages"
            onFinish={onSaveWebsiteAreaInfo}
            validateMessages={validateMessages}
          >
            <Form.Item label="省份" name="provinceCode">
              <Select
                allowClear
                onChange={async (val: string, option: any) => {
                  setSecondCity('');
                  setDistrictVal('');
                  setStreetCommunityVal('');
                  setNameObj({
                    provinceName: option.label,
                    cityName: '',
                    districtName: '',
                    streetCommunityName: '',
                  });
                  await fetchGetCityData(val);
                }}
                options={provinceData}
                key="provinceCode"
              />
            </Form.Item>
            <Form.Item label="城市" name="cityCode">
              <Select
                allowClear
                onChange={async (val, option: any) => {
                  setSecondCity(val);
                  setDistrictVal('');
                  setStreetCommunityVal('');
                  setNameObj({
                    ...nameObj,
                    cityName: option.label,
                    districtName: '',
                    streetCommunityName: '',
                  });
                  await fetchGetDistrictData(val);
                }}
                value={secondCity}
                options={cityData}
                key="label"
              />
            </Form.Item>
            <Form.Item label="区域" name="districtCode">
              <Select
                allowClear
                onChange={async (val, option: any) => {
                  setDistrictVal(val);
                  setStreetCommunityVal('');
                  setNameObj({ ...nameObj, districtName: option.label, streetCommunityName: '' });
                  await fetchGetStreetCommunityData(val);
                }}
                value={districtVal}
                options={districtData}
                key="label"
              />
            </Form.Item>
            <Form.Item label="街道" name="streetCommunityCode">
              <Select
                allowClear
                onChange={(val, option: any) => {
                  setStreetCommunityVal(val);
                  setNameObj({ ...nameObj, streetCommunityName: option.label });
                }}
                value={streetCommunityVal}
                options={streetCommunityData}
                key="label"
              />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
              <Button type="primary" htmlType="submit">
                新增
              </Button>
            </Form.Item>
          </Form>
        </Collapse.Panel>

        <Collapse.Panel header="区域列表" key="2">
          <ProTable
            bordered={true}
            size="small"
            actionRef={actionRefCur}
            rowKey="id"
            pagination={{
              pageSize: 10,
            }}
            style={{ marginTop: '30px' }}
            toolBarRender={false}
            search={false}
            request={async (params, sorter, filter) =>
              await fetchQueryUserListBySiteId({ ...params, sorter, filter })
            }
            columns={columns}
            rowSelection={false}
          />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default WebsiteInfoEdit;
