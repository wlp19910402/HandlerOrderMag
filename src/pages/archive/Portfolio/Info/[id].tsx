import { pickerDateFormat } from '@/utils/parameter'
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { infoProtfolio } from '@/pages/archive/portfolio/service'
import { match } from 'react-router'
import { Descriptions, Card, Button, Spin, Alert } from 'antd'
import { PortfolioInfoDataType } from '@/pages/archive/portfolio/data.d'
import ModelConsumableAdd from '@/pages/archive/portfolio/components/ModelConsumableAdd'
import ModelPartAdd from '@/pages/archive/portfolio/components/ModelPartAdd'
import PortfolioConsumableList from '@/pages/archive/portfolio/components/PortfolioConsumableList'
import PortfolioPartList from '@/pages/archive/portfolio/components/PortfolioPartList'
import { queryProtfolioConsumableList, queryProtfolioPartList } from '@/pages/archive/portfolio/service'
import ImageFlatList from '@/components/common/ImageFlatList'
import NullInfo from '@/components/common/NullInfo'
interface PortfolioEditProps {
  match: match
}
const DictionaryList: React.FC<PortfolioEditProps> = ({ match }) => {
  const [ currentRow, setCurrentRow ] = useState<PortfolioInfoDataType>({})
  const [ createModalVisible, handleModalVisible ] = useState<boolean>(false);
  const [ modalPartVisible, handleModalPartVisible ] = useState<boolean>(false);
  const [ dataConsumableList, setData ] = useState<any[]>([]);
  const [ dataPartList, setPartData ] = useState<any[]>([]);
  const [ Loading, setLoading ] = useState<boolean>(false)
  const [ hideNullPage, setHideNullPage ] = useState<boolean>(true)
  const routeParams: any = match.params
  const portfolioId = routeParams.id
  useEffect(() => {
    setLoading(true);
    initFun()
  }, [])
  const initFun = async () => {
    let response = await infoProtfolio(portfolioId)
    if (!response) { setLoading(false); setCurrentRow(undefined); setHideNullPage(false); return };
    setCurrentRow(response.data)
    await queryConsumableList()
    await queryPartList()
    setLoading(false)
  }
  const queryConsumableList = () => {
    queryProtfolioConsumableList(portfolioId).then(res => {
      if (!res) return
      setData(res.data)
    })
  }
  const queryPartList = () => {
    queryProtfolioPartList(portfolioId).then(res => {
      if (!res) return
      setPartData(res.data)
    })
  }
  return (
    <PageContainer
      header={ {
        title: "",
        breadcrumb: {
          routes: [
            {
              key: "1",
              path: '/',
              breadcrumbName: '首页',
            },
            {
              key: "2",
              path: '/archive/portfolio/list',
              breadcrumbName: '设备档案管理',
            },
            {
              key: "3",
              path: '/archive/portfolio/info/' + portfolioId,
              breadcrumbName: '详情',
            }
          ],
        }
      } }
    >
      <Spin spinning={ Loading }>
        { hideNullPage && <>
          <Card style={ { marginBottom: "20px" } } bordered={ false }>
            <Descriptions bordered size="small" title="档案基本信息"
              column={ { xs: 2, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 } }
              labelStyle={ { width: "120px", padding: "8px" } }
            >
              <Descriptions.Item label="单位名称">{ currentRow?.companyName }</Descriptions.Item>
              <Descriptions.Item label="单位编号">{ currentRow?.companyNo }</Descriptions.Item>
              <Descriptions.Item label="单位联系人">{ currentRow?.contactUser }</Descriptions.Item>
              <Descriptions.Item label="单位联系电话">{ currentRow?.contactMobile }</Descriptions.Item>
              <Descriptions.Item label="设备名称">{ currentRow?.deviceName }</Descriptions.Item>
              <Descriptions.Item label="设备编号">{ currentRow?.deviceNo }</Descriptions.Item>
              <Descriptions.Item label="设备类型">{ currentRow?.typeName }</Descriptions.Item>
              <Descriptions.Item label="设备品牌">{ currentRow?.brandName }</Descriptions.Item>
              <Descriptions.Item label="设备型号">{ currentRow?.modelName }</Descriptions.Item>
              <Descriptions.Item label="档案编号">{ currentRow?.no }</Descriptions.Item>
              <Descriptions.Item label="安装位置">{ currentRow?.installLocation }</Descriptions.Item>
              <Descriptions.Item label="安装日期">{ pickerDateFormat(currentRow?.installTime) }</Descriptions.Item>
              <Descriptions.Item label="保修周期">{ currentRow?.warrantyPeriod }个月</Descriptions.Item>
              <Descriptions.Item label="二维码编号">{ currentRow?.qrCodde }</Descriptions.Item>
              <Descriptions.Item label="">{ }</Descriptions.Item>
              {/*  <Descriptions.Item label="创建人">{ currentRow?.createUsername }</Descriptions.Item>
            <Descriptions.Item label="创建时间">{ currentRow?.createTime }</Descriptions.Item>
            <Descriptions.Item label="修改人">{ currentRow?.updateUsername }</Descriptions.Item>
            <Descriptions.Item label="修改时间">{ currentRow?.updateTime }</Descriptions.Item> */ }
              <Descriptions.Item label="设备图片"><ImageFlatList imageUrls={ currentRow?.imgUrls } /></Descriptions.Item>
            </Descriptions>
            <Alert
              style={ { fontSize: "12px", marginTop: "20px" } }
              message={
                `创建人：${currentRow?.createUsername}
               创建时间：${currentRow?.createTime}
              ${currentRow?.updateUsername ? '修改人：' + currentRow?.updateUsername + '修改时间：' + currentRow?.updateTime : ""}
               `
              } type="info" showIcon />
          </Card>
          { createModalVisible && (
            <ModelConsumableAdd
              createModalVisible={ createModalVisible }
              handleModalVisible={ handleModalVisible }
              portfolioId={ portfolioId }
              queryConsumableList={ queryConsumableList }
            />
          ) }
          <Card title="耗材信息"
            style={ { marginBottom: "20px" } }
            extra={ <Button type="primary" onClick={ () => handleModalVisible(true) }>新增</Button> }>
            <PortfolioConsumableList
              queryConsumableList={ queryConsumableList }
              dataConsumableList={ dataConsumableList }
            />
          </Card>
          { modalPartVisible && (
            <ModelPartAdd
              createModalVisible={ modalPartVisible }
              handleModalVisible={ handleModalPartVisible }
              portfolioId={ portfolioId }
              queryPartList={ queryPartList }
            />
          ) }
          <Card title="备件信息" extra={ <Button type="primary" onClick={ () => handleModalPartVisible(true) }>新增</Button> }>
            <PortfolioPartList
              queryPartList={ queryPartList }
              dataPartList={ dataPartList }
            />
          </Card>
        </> }
        { !hideNullPage && <NullInfo /> }
      </Spin>
    </PageContainer>
  );
};

export default DictionaryList;
