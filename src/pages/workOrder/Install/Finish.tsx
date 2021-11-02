import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import WorkOrderFinish from '@/pages/workOrder/components/WorkOrderFinish'
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
            path: '/workOrder/install',
            breadcrumbName: '安装工单',
          },
          {
            path: '/workOrder/install/finish',
            breadcrumbName: '结单',
          }
        ],
      }
    } } >
      <WorkOrderFinish matchRoute={ match } orderType="az" />
    </PageContainer>
  );
};

export default DictionaryList;