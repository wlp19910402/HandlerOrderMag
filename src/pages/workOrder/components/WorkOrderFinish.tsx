import { Button, Form, Card, Input, Row, Col, Descriptions, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { FooterToolbar } from '@ant-design/pro-layout';
import { queryList } from '@/pages/workOrder/service';
import { OrderListType, orderStatusData, orderTypeMatchInfo } from '@/pages/workOrder/data.d';
import { history } from 'umi';
import { match } from 'react-router';
import WorkOrderFinishConsumableEdit from '@/pages/workOrder/components/WorkOrderFinishConsumableEdit'
import UploadImage from '@/components/Upload/index'
import { submitOrder } from '@/pages/workOrder/service'
import ImageFlatList from '@/components/common/ImageFlatList'
import { setUploadUrlImage } from '@/components/Upload/service'
import NullInfo from '@/components/common/NullInfo'
interface WorkOrderFinishProps {
  matchRoute: match<{}>;
  orderType: string;
}
const DictionaryList: React.FC<WorkOrderFinishProps> = ({ orderType = 'wx', matchRoute }) => {
  const [ currentRow, setCurrentRow ] = useState<OrderListType>();
  const [ portfolioId, setPortfolioId ] = useState<React.Key>();
  const [ consumableUpdate, setConsumableUpdate ] = useState<any[]>([])
  const [ uploadImages, setUploadImages ] = useState<string[]>([])
  const [ hideNullPage, setHideNullPage ] = useState<boolean>(true)
  const fetchQueryCurrentOrderInfo = async () => {
    let routeParams: any = matchRoute.params
    const response = await queryList({ current: 1, pageSize: 1, orderNo: routeParams.no });
    if (!response) {
      setCurrentRow(undefined)
      setHideNullPage(false)
      return
    }
    if (response.data.records.length === 0) {
      setCurrentRow(undefined)
      message.error("当前工单不存在")
      setHideNullPage(false)
      return
    }
    let data = response.data.records[ 0 ]
    setCurrentRow(data)
    setPortfolioId(data.portfolioId)
  };
  useEffect(() => {
    fetchQueryCurrentOrderInfo();
    setUploadUrlImage(uploadImages, setUploadImages)
  }, [])
  const [ form ] = Form.useForm();
  const onFinish = async (values: { [ key: string ]: any }) => {
    let params = {
      "consumables": consumableUpdate,
      "orderId": currentRow?.id,
      "subImgUrls": uploadImages.filter((item: any) => item !== ''),
      "subRemark": values.subRemark
    }
    let response = await submitOrder(params)
    if (!response) return
    let orderTypeInfo = orderTypeMatchInfo(orderType)
    message.success(`结单成功,即将跳转 "${orderTypeInfo?.label}列表" 页面`, 4)
    setTimeout(() => {
      if (orderTypeInfo) history.push(orderTypeInfo.listPath);
    }, 1000);
  }
  return (
    <>
      {hideNullPage && <>
        <Card title="工单信息" style={ { marginBottom: "20px" } } bordered={ false }>
          <Descriptions bordered size="small"
            column={ { xs: 2, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 } }
            labelStyle={ { width: "120px", padding: "8px" } }
          >
            <Descriptions.Item label="工单编号" >{ currentRow?.orderNo }</Descriptions.Item>
            <Descriptions.Item label="单位名称">{ currentRow?.company }</Descriptions.Item>
            <Descriptions.Item label="工程师姓名">{ currentRow?.engineerName }</Descriptions.Item>
            <Descriptions.Item label="支持人员">{ currentRow?.supporterNames }</Descriptions.Item>
            <Descriptions.Item label="工单状态">{ orderStatusData.find(item => item.value === currentRow?.status)?.label }</Descriptions.Item>
            <Descriptions.Item label="工单描述">{ currentRow?.workDescription }</Descriptions.Item>
            <Descriptions.Item label="工单来源">{ currentRow?.sourceType }</Descriptions.Item>
            <Descriptions.Item label="工单类型">{ orderTypeMatchInfo(currentRow?.orderType)?.label }</Descriptions.Item>
            <Descriptions.Item label="设备名称">{ currentRow?.deviceName }</Descriptions.Item>
            {/* <Descriptions.Item label="设备类型">{ currentRow?.deviceTypeName }</Descriptions.Item> */ }
            <Descriptions.Item label="是否绑定档案">{ currentRow?.portfolioId !== "" ? "已绑定" : "未绑定" }</Descriptions.Item>
            <Descriptions.Item label="工单图片"><ImageFlatList imageUrls={ currentRow?.imgUrls } /></Descriptions.Item>
          </Descriptions>
        </Card>
        { portfolioId !== undefined && portfolioId !== "" &&
          <Card title="耗材信息" style={ { marginBottom: "20px" } } bordered={ false }>
            <WorkOrderFinishConsumableEdit
              portfolioId={ portfolioId }
              setConsumableUpdate={ setConsumableUpdate }
              consumableUpdate={ consumableUpdate }
            />
          </Card>
        }
        <Form
          form={ form }
          onFinish={ onFinish }
        >
          <Card title="绑定档案信息信息" bordered={ false }>
            <Form.Item
              label='结单说明'
              name="subRemark"
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
            <Form.Item extra="外观图片（最多上传六张）带“删除”按钮" label="结单图片" valuePropName="checked">
              <Row gutter={ [ 16, 16 ] } >
                { uploadImages.map((item, index) => {
                  return <Col key={ index }><UploadImage uploadId={ `uploadImagesId_${index}` } value={ item } onChange={ (url) => { setUploadUrlImage(uploadImages, setUploadImages, url, index) } } /></Col>
                }) }
              </Row>
            </Form.Item>
          </Card>
          <FooterToolbar>
            <Button type="primary" onClick={ () => { form?.submit() } } loading={ false }>结单</Button>
          </FooterToolbar>
        </Form>
      </> }
      {!hideNullPage && <NullInfo /> }
    </>
  );
};

export default DictionaryList;
