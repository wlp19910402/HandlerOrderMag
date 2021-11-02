import { Card, Form, Select, Descriptions, Button, Row, Col, Input, InputNumber, DatePicker, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { FooterToolbar } from '@ant-design/pro-layout';
import type { PortfolioListDataType, PortfolioSaveDataType } from '@/pages/archive/portfolio/data.d';
import { findCompanyByName } from '@/pages/archive/Company/service'
import { queryDeviceList } from '@/pages/device/Device/service'
import { DeviceListDataType } from '@/pages/device/Device/data.d'
import { CompanyListDataType } from '@/pages/archive/Company/data.d'
import { saveProtfolio } from '@/pages/archive/portfolio/service'
import { history } from 'umi'
import { pickerDateFormat, pickerInitialValue } from '@/utils/parameter'
import getErrorInfo, { ErrorField } from '@/components/common/ErrorForm'
interface ModifyFormTypeProps {
  currentRow?: PortfolioListDataType
}
const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 16 },
  },
};
const colProps = { xs: 24, sm: 24, md: 12, lg: 12, xl: 8, xxl: 8 };
const DictionaryList: React.FC<ModifyFormTypeProps> = ({ currentRow }) => {
  const [ companyNameOptions, setCompanyNameOptions ] = useState<any[]>([])
  const [ selectCompanyData, setSelectCompanyData ] = useState<CompanyListDataType>()
  const [ deviceNameOptions, setDeviceNameOptions ] = useState<any[]>([])
  const [ selectDeviceData, setSelectDeviceData ] = useState<DeviceListDataType>()
  const [ error, setError ] = useState<ErrorField[]>([]);
  const searchCompany = async (name?: string) => {
    return findCompanyByName(name).then(async (res) => {
      let arr = []
      if (res) {
        arr = res.data.map((item: any) => ({
          ...item,
          label: item.company,
          value: item.id
        }))
      }
      await setCompanyNameOptions(arr)
      return arr
    }).catch(err => {
      return false
    })
  }
  const companyChange = async (val: any) => {
    setSelectCompanyData(companyNameOptions.find(item => item.id === val))
  }
  const searchDevice = (name: string = "") => {
    return queryDeviceList({
      pageSize: 10,
      current: 1,
      name: name
    }).then(res => {
      let arr = []
      if (res) {
        arr = res.data.records.map((item: any) => ({
          ...item,
          label: item.name,
          value: item.id
        }))
      }
      setDeviceNameOptions(arr)
      return arr
    }).catch(err => {
      return false
    })
  }
  const deviceChange = (val: any) => {
    setSelectDeviceData(deviceNameOptions.find(item => item.id === val))
  }
  const initFetchData = async () => {
    searchCompany(currentRow?.companyName).then(res => {
      if (res && currentRow?.id !== undefined) {
        setSelectCompanyData(res.find((item: any) => item.company === currentRow?.companyName))
      }
    });
    searchDevice(currentRow?.deviceName).then(res => {
      if (res && currentRow?.id !== undefined) {
        setSelectDeviceData(res.find((item: any) => item.name === currentRow?.deviceName))
      }
    });
  }
  useEffect(() => {
    initFetchData()
  }, [])
  const [ form ] = Form.useForm();
  const onFinish = async (values: { [ key: string ]: any }) => {
    setError([]);
    let params: PortfolioSaveDataType = {
      id: currentRow?.id,
      brand: selectDeviceData?.brand,
      companyId: selectCompanyData?.id,
      companyName: selectCompanyData?.company,
      companyNo: selectCompanyData?.no,
      deviceId: selectDeviceData?.id,
      deviceName: selectDeviceData?.name,
      deviceNo: selectDeviceData?.no,
      installLocation: values.installLocation,
      installTime: pickerDateFormat(values.installTime),
      qrCodde: values.qrCodde,
      warrantyPeriod: values.warrantyPeriod.toString(),
      model: selectDeviceData?.model,
      type: selectDeviceData?.type
    }
    let response = await saveProtfolio(params)
    if (!response) { return }
    message.success("保存成功")
    history.replace('/archive/portfolio/list');
  }
  const onFinishFailed = (errorInfo: any) => {
    setError(errorInfo.errorFields);
  }
  return (
    <Form
      form={ form }
      onFinish={ onFinish }
      onFinishFailed={ onFinishFailed }
    >
      <Card title="单位信息" style={ { marginBottom: "20px" } } bordered={ false }>
        <Form.Item label="单位名称" name="companyName"
          rules={ [ { required: true, message: '请输入单位名称' } ] }
          initialValue={ currentRow?.companyName }>
          <Select
            showSearch
            style={ { width: "240px" } }
            size="large"
            placeholder="检索单位名称"
            optionFilterProp="children"
            onChange={ companyChange }
            onSearch={ searchCompany }
            disabled={ currentRow?.id !== undefined }
          >
            { companyNameOptions?.map((item: any) => <Select.Option key={ item.value } value={ item.value } >{ item.label }</Select.Option>) }
          </Select>
        </Form.Item>
        <Descriptions bordered size="small"
          column={ { xs: 2, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 } }
          labelStyle={ { width: "80px", padding: "8px" } }
        >
          <Descriptions.Item label="单位名称">{ selectCompanyData?.company ? selectCompanyData.company : "" }</Descriptions.Item>
          <Descriptions.Item label="单位编号">{ selectCompanyData?.no ? selectCompanyData.no : "" }</Descriptions.Item>
          <Descriptions.Item label="联系人">{ selectCompanyData?.contactUser ? selectCompanyData.contactUser : "" }</Descriptions.Item>
          <Descriptions.Item label="联系电话">{ selectCompanyData?.contactMobile ? selectCompanyData.contactMobile : "" }</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="设备信息" style={ { marginBottom: "20px" } } bordered={ false }>
        <Form.Item label="设备名称" rules={ [ { required: true, message: '请输入设备名称' } ] } name="deviceName" initialValue={ currentRow?.deviceName }>
          <Select
            showSearch
            style={ { width: "240px" } }
            size="large"
            placeholder="检索设备名称"
            optionFilterProp="children"
            onChange={ deviceChange }
            onSearch={ searchDevice }
            disabled={ currentRow?.id !== undefined }
          >
            { deviceNameOptions?.map((item: any) => <Select.Option key={ item.value } value={ item.value } >{ item.label }</Select.Option>) }
          </Select>
        </Form.Item>
        <Descriptions bordered size="small"
          column={ { xs: 2, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 } }
          labelStyle={ { width: "80px", padding: "8px" } }
        >
          <Descriptions.Item label="设备名称">{ selectDeviceData?.name ? selectDeviceData?.name : "" }</Descriptions.Item>
          <Descriptions.Item label="设备编号">{ selectDeviceData?.no ? selectDeviceData?.no : "" }</Descriptions.Item>
          <Descriptions.Item label="设备类型">{ selectDeviceData?.typeName ? selectDeviceData?.typeName : "" }</Descriptions.Item>
          <Descriptions.Item label="设备品牌">{ selectDeviceData?.brandName ? selectDeviceData?.brandName : "" }</Descriptions.Item>
          <Descriptions.Item label="设备型号">{ selectDeviceData?.modelName ? selectDeviceData?.modelName : "" }</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="档案基本信息" bordered={ false }>
        <Row gutter={ 10 } >
          <Col { ...colProps }>
            <Form.Item
              { ...formItemLayout }
              label='安装位置'
              name="installLocation"
              rules={ [ { required: true, message: '请输入安装位置' } ] }
              initialValue={ currentRow?.installLocation }
            >
              <Input placeholder="请输入名称" />
            </Form.Item>
          </Col>
          <Col { ...colProps }>
            <Form.Item
              { ...formItemLayout }
              label='安装日期'
              name="installTime"
              rules={ [ { required: true, message: '请输入安装日期' } ] }
              initialValue={ pickerInitialValue(currentRow?.installTime) }
            >
              <DatePicker
                picker="date"
                format="YYYY-MM-DD"
                placeholder="请输入安装日期"
                style={ { width: "100%" } }
              />
            </Form.Item>
          </Col>
          <Col { ...colProps }>
            <Form.Item
              { ...formItemLayout }
              label='二维码编号'
              name="qrCodde"
              rules={ [ {required: true,  message: '请输入二维码编号' } ] }
              initialValue={ currentRow?.qrCodde }
            >
              <Input placeholder="请输入二维码编号" />
            </Form.Item>
          </Col>
          <Col { ...colProps }>
            <Form.Item
              { ...formItemLayout }
              label='保修周期(月)'
              name="warrantyPeriod"
              rules={ [ { required: true, message: '请输入保修周期' } ] }
              initialValue={ currentRow?.warrantyPeriod }
            >
              <InputNumber style={ { width: "100%" } } min={ 1 } max={ 100000 } />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <FooterToolbar>
        { getErrorInfo(error) }
        <Button type="primary" onClick={ () => { form?.submit() } } loading={ false }>
          保存
        </Button>
      </FooterToolbar>
    </Form>
  );
};

export default DictionaryList;