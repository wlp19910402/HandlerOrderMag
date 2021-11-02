import { Card, Descriptions, Divider, notification, Timeline, Spin, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import { infoOrder, logOrder } from '@/pages/workOrder/service';
import { WorkOrderInfoDataType, orderStatusData, orderTypeMatchInfo, WorkOrderWrokLogDataType } from '@/pages/workOrder/data.d';
import { match } from 'react-router';
import WorkOrderInfoConsumableList from '@/pages/workOrder/components/WorkOrderInfoConsumableList'
import WorkOrderInfoProtolioConsumableList from '@/pages/workOrder/components/WorkOrderInfoProtolioConsumableList'
import WorkOrderInfoProtolioPartList from '@/pages/workOrder/components/WorkOrderInfoProtolioPartList'
import ImageFlatList from '@/components/common/ImageFlatList'
import { pickerDateFormat } from '@/utils/parameter'
import NullInfo from '@/components/common/NullInfo'
interface WorkOrderFinishProps {
  matchRoute: match<{}>;
  orderType: string;
}

const DictionaryList: React.FC<WorkOrderFinishProps> = ({ orderType = 'wx', matchRoute }) => {
  const [ currentRow, setCurrentRow ] = useState<WorkOrderInfoDataType | undefined>();
  const [ logs, setLogs ] = useState<WorkOrderWrokLogDataType[]>([]);
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ hideNullPage, setHideNullPage ] = useState<boolean>(true)
  let routeParams: any = matchRoute.params
  const fetchQueryCurrentOrderInfo = async () => {
    console.log("执行了哦")
    const response = await infoOrder(routeParams.id);
    if (!response) {
      setCurrentRow(undefined)
      setLoading(false)
      setHideNullPage(false)
      return
    }
    let data = response.data
    await setCurrentRow(data)
    setLoading(false)
  };
  const fetchLogsOrder = async () => {
    let response = await logOrder(routeParams.id)
    if (!response) {
      setCurrentRow(undefined)
      return
    }
    setLogs(response.data)
  }
  const openNotification = async () => {
    const args = {
      message: '工单日志',
      description:
        <Timeline style={ { maxHeight: "400px", overflow: "auto" } }>
          { logs.map((item: WorkOrderWrokLogDataType) => (
            <Timeline.Item key={ item.id } color={ orderStatusData.find(it => it.value === item.operationType)?.color }>
              <p />
              <p>操作：{ orderStatusData.find(it => it.value === item.operationType)?.label }</p>
              <p>日志：{ item.operationLog }</p>
              <p>操作人：{ item.createUsername }</p>
              <p>时间：{ item.createTime }</p>
            </Timeline.Item>
          )) }
        </Timeline>,
      duration: 0,
    };
    notification.open(args);
  };
  useEffect(() => {
    fetchQueryCurrentOrderInfo();
    fetchLogsOrder();
  }, [])
  return (
    <Spin spinning={ loading }>
      {hideNullPage &&
        <>
          <Card title="工单详情" style={ { marginBottom: "20px" } } extra={ <a onClick={ () => { openNotification() } }>查看日志</a> } bordered={ false } >
            <Divider orientation="left">基本信息</Divider>
            <Descriptions bordered size="small"
              column={ { xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 } }
              labelStyle={ { width: "120px", padding: "8px" } }
            >
              <Descriptions.Item label="工单编号" >{ currentRow?.orderNo }</Descriptions.Item>
              <Descriptions.Item label="单位名称" >{ currentRow?.company }</Descriptions.Item>
              <Descriptions.Item label="工程师姓名">{ currentRow?.engineerName }</Descriptions.Item>
              <Descriptions.Item label="支持人员">{ currentRow?.supporterNames }</Descriptions.Item>
              <Descriptions.Item label="接单时间">{ currentRow?.receivingTime }</Descriptions.Item>
              <Descriptions.Item label="工单状态">
                <Typography.Text type={ orderStatusData.find(item => item.value === currentRow?.status)?.textType }> { orderStatusData.find(item => item.value === currentRow?.status)?.label }</Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="工单来源">{ currentRow?.sourceType }</Descriptions.Item>
              <Descriptions.Item label="工单类型">{ orderTypeMatchInfo(currentRow?.orderType)?.label }</Descriptions.Item>
              <Descriptions.Item label="是否绑定档案" >{ currentRow?.portfolioId !== "" ? "已绑定" : "未绑定" }</Descriptions.Item>
              <Descriptions.Item label="工单描述" >{ currentRow?.workDescription }</Descriptions.Item>
              <Descriptions.Item label="创建人员" >{ currentRow?.createUserName }</Descriptions.Item>
              <Descriptions.Item label="创建时间" >{ currentRow?.createTime }</Descriptions.Item>
              <Descriptions.Item label="工单图片" span={ 2 } ><ImageFlatList imageUrls={ currentRow?.orderImgUrls } /></Descriptions.Item>
              {
                currentRow?.status === "wc" &&
                <>
                  <Descriptions.Item label="结单人员">{ currentRow?.subUsername }</Descriptions.Item>
                  <Descriptions.Item label="结单时间">{ currentRow?.subTime }</Descriptions.Item>
                  <Descriptions.Item label="结单备注" span={ 2 }> { currentRow?.subRemark }</Descriptions.Item>
                  <Descriptions.Item label="结单图片" span={ 2 }><ImageFlatList imageUrls={ currentRow?.subImgUrls } /></Descriptions.Item>
                </>
              }
            </Descriptions>
            {
              currentRow?.portfolioId !== "" && currentRow?.status === "wc" &&
              <>
                <Divider orientation="left">更换耗材信息</Divider>
                { currentRow?.workConsumables && currentRow?.workConsumables.length > 0 ?
                  <WorkOrderInfoConsumableList dataList={ currentRow?.workConsumables } /> :
                  <WorkOrderInfoConsumableList dataList={ [] } /> }
              </>
            }
          </Card >
          {
            currentRow?.portfolioId !== "" &&
            <Card title="档案信息" bordered={ false }>
              <Divider orientation="left">基本信息</Divider>
              <Descriptions bordered size="small"
                column={ { xs: 2, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 } }
                labelStyle={ { width: "120px", padding: "8px" } }
              >
                <Descriptions.Item label="单位名称">{ currentRow?.portfolio.companyName }</Descriptions.Item>
                <Descriptions.Item label="单位编号">{ currentRow?.portfolio.companyNo }</Descriptions.Item>
                <Descriptions.Item label="单位联系人">{ currentRow?.portfolio.contactUser }</Descriptions.Item>
                <Descriptions.Item label="单位联系电话">{ currentRow?.portfolio.contactMobile }</Descriptions.Item>
                <Descriptions.Item label="设备名称">{ currentRow?.portfolio.deviceName }</Descriptions.Item>
                <Descriptions.Item label="设备编号">{ currentRow?.portfolio.deviceNo }</Descriptions.Item>
                <Descriptions.Item label="设备类型">{ currentRow?.portfolio.typeName }</Descriptions.Item>
                <Descriptions.Item label="设备品牌">{ currentRow?.portfolio.brandName }</Descriptions.Item>
                <Descriptions.Item label="设备型号">{ currentRow?.portfolio.modelName }</Descriptions.Item>
                <Descriptions.Item label="档案编号">{ currentRow?.portfolio.no }</Descriptions.Item>
                <Descriptions.Item label="安装位置">{ currentRow?.portfolio.installLocation }</Descriptions.Item>
                <Descriptions.Item label="安装日期">{ pickerDateFormat(currentRow?.portfolio.installTime) }</Descriptions.Item>
                <Descriptions.Item label="保修周期">{ currentRow?.portfolio.warrantyPeriod }个月</Descriptions.Item>
                <Descriptions.Item label="二维码编号" span={ 2 }>{ currentRow?.portfolio.qrCodde }</Descriptions.Item>
                <Descriptions.Item label="设备图片" span={ 3 }><ImageFlatList imageUrls={ currentRow?.portfolio.imgUrls } /></Descriptions.Item>
              </Descriptions>
              <Divider orientation="left">耗材信息</Divider>
              { currentRow?.consumables && currentRow?.consumables.length > 0 ?
                <WorkOrderInfoProtolioConsumableList dataList={ currentRow?.consumables } /> :
                < WorkOrderInfoProtolioConsumableList dataList={ [] } /> }
              <Divider orientation="left">备件信息</Divider>
              { currentRow?.parts && currentRow?.parts.length > 0 ?
                <WorkOrderInfoProtolioPartList dataList={ currentRow?.parts } /> :
                <WorkOrderInfoProtolioPartList dataList={ [] } /> }
            </Card>
          }
        </> }
      {!hideNullPage && <NullInfo /> }
    </Spin>
  );
};

export default DictionaryList;
