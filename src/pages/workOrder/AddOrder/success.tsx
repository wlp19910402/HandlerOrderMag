import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ResultSuccess from '@/components/common/ResultSuccess'

const DictionaryList: React.FC<{}> = () => {
  return (
    <PageContainer header={ {
      title: "", breadcrumb: {
        routes: [
          {
            path: '/',
            breadcrumbName: '首页',
          },
          {
            path: '/workOrder/addOrder',
            breadcrumbName: '新增工单',
          },
          {
            path: '/workOrder/addOrder/success',
            breadcrumbName: '保存成功',
          }
        ],
      }
    } }>
      <ResultSuccess />
    </PageContainer>
  );
};

export default DictionaryList;
