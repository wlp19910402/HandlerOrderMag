/**
 * 网点详情和编辑
 */
import React, { useState, useRef, useEffect } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { SiteDataType } from '../data';
import ProTable from '@ant-design/pro-table';
import {
  saveWebsiteArea,
  getAreaData,
  getAreaDataByWebsite,
  deleteAreaByWebsiteId,
} from '../service';
import { Form, Space, message, Button, Alert, Collapse, Select, Popconfirm, Row, Col } from 'antd';
import { FormInstance } from 'antd/es/form';

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
  const [ cityData, setCityData ] = useState<selectLableType[]>([]);
  const [ districtData, setDistrictData ] = useState<selectLableType[]>([]);
  const [ streetCommunityData, setStreetCommunityData ] = useState<selectLableType[]>([]);
  const [ nameObj, setNameObj ] = useState<object>({});
  const onSaveWebsiteAreaInfo = async (values: any) => {
    let response = await saveWebsiteArea({ siteId, ...values, ...nameObj });
    if (!response) return;
    actionRefCur.current && actionRefCur.current.reload();
    message.success(`添加成功`);
    formRef.current!.resetFields();
  };
  const validateMessages = {
    required: '${label} 是必填项!',
  };
  const actionRefCur = useRef<ActionType>();

  const formRef = React.createRef<FormInstance>();
  const tiggerDeleteAreaByWebsiteId = async (id: number) => {
    const response = await deleteAreaByWebsiteId(id);
    if (!response) return;
    actionRefCur.current && actionRefCur.current.reloadAndRest?.();
    message.success('删除成功');
  };
  const columns: ProColumns<any>[] = [
    {
      title: '省份',
      dataIndex: 'provinceName',
      width: 120,
    },
    {
      title: '城市',
      dataIndex: 'cityName',
      key: 'cityName',
    },
    {
      title: '区县',
      dataIndex: 'districtName',
      key: 'districtName',
    },
    {
      title: '街道/社区',
      key: 'streetName',
      dataIndex: 'streetName',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      key: 'option',
      width: '120px',
      align: 'center',
      fixed: 'right',
      render: (_, record) => [
        <Popconfirm
          key="delete"
          title="确认删除吗?"
          onConfirm={ () => {
            tiggerDeleteAreaByWebsiteId(record?.id);
          } }
        >
          <a> 删除</a>
        </Popconfirm>,
      ],
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

  useEffect(() => {
    formRef.current!.resetFields();
  }, []);
  return (
    <Space direction="vertical" style={ { width: '100%' } } size={ 20 }>
      <Alert message={ '网点名称:' + currentRow?.siteName } type="info" />
      <Form
        { ...layout }
        ref={ formRef }
        name="nest-messages"
        onFinish={ onSaveWebsiteAreaInfo }
        validateMessages={ validateMessages }
      >
        <Collapse defaultActiveKey={ [ '1' ] }>
          <Collapse.Panel
            header="新增服务区域"
            key="1"
            extra={
              <Button
                type="primary"
                htmlType="submit"
                onClick={ (event) => {
                  event.stopPropagation();
                } }
              >
                新增
              </Button>
            }
          >
            <Row>
              <Col span={ 12 }>
                <Form.Item
                  label="省份"
                  name="provinceCode"
                  rules={ [
                    {
                      required: true,
                      message: '请请选择省份！',
                    },
                  ] }
                >
                  <Select
                    onChange={ async (val: string, option: any) => {
                      formRef?.current?.setFieldsValue({
                        cityCode: '',
                        districtCode: '',
                        streetCode: '',
                      });
                      setNameObj({
                        provinceName: option.label,
                        cityName: '',
                        districtName: '',
                        streetName: '',
                      });
                      await fetchGetCityData(val);
                    } }
                    options={ provinceData }
                    key="provinceCode"
                  />
                </Form.Item>
              </Col>
              <Col span={ 12 }>
                <Form.Item
                  label="城市"
                  name="cityCode"
                  rules={ [
                    {
                      required: true,
                      message: '请选择城市！',
                    },
                  ] }
                >
                  <Select
                    onChange={ async (val: any, option: any) => {
                      formRef?.current?.setFieldsValue({
                        districtCode: '',
                        streetCode: '',
                      });
                      setNameObj({
                        ...nameObj,
                        cityName: option.label,
                        districtName: '',
                        streetName: '',
                      });
                      await fetchGetDistrictData(val);
                    } }
                    options={ cityData }
                    key="label"
                  />
                </Form.Item>
              </Col>
              <Col span={ 12 }>
                <Form.Item
                  label="区域"
                  name="districtCode"
                  rules={ [
                    {
                      required: true,
                      message: '请选择区域！',
                    },
                  ] }
                >
                  <Select
                    onChange={ async (val: any, option: any) => {
                      formRef?.current?.setFieldsValue({
                        streetCode: '',
                      });
                      setNameObj({
                        ...nameObj,
                        districtName: option.label,
                        streetName: '',
                      });
                      await fetchGetStreetCommunityData(val);
                    } }
                    options={ districtData }
                    key="label"
                  />
                </Form.Item>
              </Col>
              <Col span={ 12 }>
                <Form.Item label="街道" name="streetCode">
                  <Select
                    onChange={ (val: any, option: any) => {
                      setNameObj({ ...nameObj, streetName: option.label });
                    } }
                    options={ streetCommunityData }
                    key="label"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Collapse.Panel>
        </Collapse>
      </Form>
      <Collapse defaultActiveKey={ [ '2' ] }>
        <Collapse.Panel
          header="区域列表"
          key="2"
          extra={
            <Button
              type="primary"
              onClick={ (event) => {
                actionRefCur.current && actionRefCur.current.reload();
                event.stopPropagation();
              } }
            >
              刷新
            </Button>
          }
        >
          <ProTable
            bordered={ true }
            size="small"
            actionRef={ actionRefCur }
            rowKey="id"
            pagination={ {
              pageSize: 10,
            } }
            toolBarRender={ false }
            search={ false }
            request={ async (params, sorter, filter) =>
              // console.log(sorter, filter)
              await fetchQueryUserListBySiteId({ ...params })
            }
            columns={ columns }
            rowSelection={ false }
          />
        </Collapse.Panel>
      </Collapse>
    </Space>
  );
};

export default WebsiteInfoEdit;
