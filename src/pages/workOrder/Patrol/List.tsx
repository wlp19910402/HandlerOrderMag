import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import WorkOrderList from '@/pages/workOrder/components/WorkOrderList'

const DictionaryList: React.FC<{}> = () => {
  return (
    <PageContainer header={ { title: "" } } >
      <WorkOrderList orderType="xj" />
    </PageContainer>
  );
};

export default DictionaryList;