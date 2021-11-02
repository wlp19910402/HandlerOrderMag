import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import WorkOrderInfo from '@/pages/workOrder/components/WorkOrderInfo'
import { match } from 'react-router'
interface FinishProps {
  match: match<{}>
}
const DictionaryList: React.FC<FinishProps> = ({ match }) => {
  return (
    <PageContainer header={ {
      title: "",
      breadcrumb: {
        routes: [
          {
            path: '/',
            breadcrumbName: '首页',
          },
          {
            path: '/workOrder/patrol',
            breadcrumbName: '巡检工单',
          },
          {
            path: '/workOrder/patrol/info',
            breadcrumbName: '详情',
          }
        ],
      }
    } } >
      <WorkOrderInfo matchRoute={ match } orderType="xj" />
    </PageContainer>
  );
};

export default DictionaryList;