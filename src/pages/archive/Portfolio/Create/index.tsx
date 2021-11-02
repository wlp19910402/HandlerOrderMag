import { Card, Form, Select, Descriptions, Button, Row, Col, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { PortfolioListDataType } from '../data';
import BasicModifyForm from '../components/BasicModifyForm'

const DictionaryList: React.FC<PortfolioListDataType> = () => {
  return (
    <PageContainer
      header={ {
        title: "",
        breadcrumb: {
          routes: [
            {
              path: '/',
              breadcrumbName: '首页',
            },
            {
              path: '/archive/portfolio/list',
              breadcrumbName: '设备档案管理',
            },
            {
              path: '/archive/portfolio/edit',
              breadcrumbName: '新增',
            }
          ],
        }
      } }
    >
      <BasicModifyForm />
    </PageContainer>
  );
};

export default DictionaryList;
