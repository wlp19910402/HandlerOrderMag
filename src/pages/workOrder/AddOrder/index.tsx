import { Card, Form, Button, Row, Radio, Col, Input, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { OrderTypeType, orderTypeData, orderTypeMatchInfo } from '@/pages/workOrder/data.d';
import { addWorkOrder } from '@/pages/workOrder/service'
import UploadImage from '@/components/Upload/index'
import ModelBindProtolioAdd from '@/pages/workOrder/components/ModelBindProtolioAdd'
import { IRouteComponentProps } from 'umi'
import { PageContainer } from '@ant-design/pro-layout';
import { setUploadUrlImage } from '@/components/Upload/service'
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const DictionaryList: React.FC<IRouteComponentProps> = ({ location, history }) => {
  const [ uploadImages, setUploadImages ] = useState<string[]>([])
  const [ form ] = Form.useForm();
  const [ createModalVisible, handleModalVisible ] = useState<boolean>(false);
  const [ protolioInfo, setProtolioInfo ] = useState<any>({})
  const [ orderTypeParams, setOrderTypeParams ] = useState<string | string[] | null>(location.query.orderType || orderTypeData[ 0 ].value)
  const onFinish = async (values: { [ key: string ]: any }) => {
    setUploadUrlImage(uploadImages, setUploadImages)
    let params: OrderTypeType = {
      company: values?.company,
      customerMobile: values?.customerMobile,
      customerName: values?.customerName,
      orderType: values?.orderType,
      portfolioId: values?.portfolioId,
      workDescription: values?.workDescription,
      imgUrls: uploadImages.filter((item: any) => item !== '')
    }
    let response = await addWorkOrder(params)
    if (!response) { return }
    let orderTypeInfo = orderTypeMatchInfo(values.orderType)
    message.success(`保存成功,即将跳转 "${orderTypeInfo?.label}列表" 页面`, 4)
    setTimeout(() => {
      if (orderTypeInfo) history.push(orderTypeInfo.listPath);
    }, 1000);
  }
  const changeOptionType = (e: any) => {
    setOrderTypeParams(e.target.value)
  }
  useEffect(() => {
    setUploadUrlImage(uploadImages, setUploadImages)
  }, [])
  const bindProtolioInfo = (record: any) => {
    setProtolioInfo(record);
    form.setFieldsValue({ portfolioId: record.id, company: record.companyName })
  }
  const inputChangeCompany = (event: any) => {
    if (event.data !== protolioInfo) {
      form.setFieldsValue({ portfolioId: "" })
      setProtolioInfo({})
    }
  }
  return (
    <PageContainer header={ { title: "" } }>
      <Card bordered={ false } title="新增工单">
        <Form
          form={ form }
          onFinish={ onFinish }
          title="新增工单信息"
          { ...layout }
        >
          <div style={ { width: "480px", margin: "0 auto" } }>
            <Form.Item
              rules={ [ { required: true } ] }
              label="工单类型"
              initialValue={ orderTypeParams }
              name="orderType"
            >
              <Radio.Group onChange={ changeOptionType } optionType="button" options={ [ ...orderTypeData ] } />
            </Form.Item>
            <Form.Item
              label='客户姓名'
              name="customerName"
              rules={ [ { required: true, message: "请输入客户姓名！" } ] }
            >
              <Input placeholder="请输入客户姓名" />
            </Form.Item>
            <Form.Item
              label='客户电话'
              name="customerMobile"
              rules={ [
                { required: true, message: "请输入客户电话！" },
                { pattern: /^1\d{10}$/, message: "请输入正确的手机号" }
              ] }
            >
              <Input placeholder="请输入客户电话" />
            </Form.Item>
            <Form.Item
              label='报单单位'
              name="company"
              rules={ [ { required: true, message: "请输入报单单位！" } ] }
            >
              <Input onChange={ (event) => { inputChangeCompany(event.nativeEvent) } } placeholder="请输入报单单位" addonAfter={ orderTypeParams !== 'xj' ? <a onClick={ () => handleModalVisible(true) }>或去绑定档案</a> : false } />
            </Form.Item>
            { protolioInfo.id !== undefined && <>
              <Form.Item
                label='档案id'
                name="portfolioId"
                hidden
              >
                <Input disabled />
              </Form.Item>
              <Form.Item label='档案二维码'>
                <Input disabled value={ protolioInfo.qrCodde } />
              </Form.Item>
              <Form.Item
                label='安装位置'
              >
                <Input disabled value={ protolioInfo.installLocation } />
              </Form.Item>
            </> }
            <Form.Item
              label='工单描述'
              name="workDescription"
              extra="内容最多支持100个字符"
              rules={ [
                {
                  max: 100,
                  message: `内容最多支持100个字符!`,
                },
              ] }
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item extra="外观图片（最多上传六张）带“删除”按钮" label="图片上传" valuePropName="checked">
              <Row gutter={ [ 16, 16 ] } >
                { uploadImages.map((item, index) => {
                  return <Col key={ index }><UploadImage uploadId={ `uploadImagesId_${index}` } value={ item } onChange={ (url) => { setUploadUrlImage(uploadImages, setUploadImages, url, index) } } /></Col>
                }) }
              </Row>
            </Form.Item>
            <Form.Item wrapperCol={ { offset: 6, span: 18 } }>
              <Row>
                <Col span={ 6 }>
                  <Button type="default" onClick={ () => { form.resetFields(); setProtolioInfo({}); } }>重置</Button>
                </Col>
                <Col span={ 6 } offset={ 4 }>
                  <Button type="primary" onClick={ () => { form?.submit() } } loading={ false }>保存</Button>
                </Col>
              </Row>
            </Form.Item>
          </div>
          { createModalVisible && (
            <ModelBindProtolioAdd
              createModalVisible={ createModalVisible }
              handleModalVisible={ handleModalVisible }
              companyName={ form.getFieldValue("company") }
              bindProtolioInfo={ bindProtolioInfo }
            />
          ) }
        </Form >
      </Card >
    </PageContainer>
  );
};

export default DictionaryList;
