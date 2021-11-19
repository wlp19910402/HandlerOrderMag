import { Button, Result } from 'antd';
import React from 'react';
import {  Link } from 'umi';

const NoFoundPage: React.FC<{}> = () => (
  <Result
    status="403"
    title="403"
    style={ {
      background: 'none',
    } }
    subTitle="抱歉！禁止访问,没有权限"
    extra={
      <Link to="/">
        <Button type="primary">返回首页</Button>
      </Link>
    }
  />
);

export default NoFoundPage;
