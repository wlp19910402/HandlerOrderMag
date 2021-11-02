import { Button, Result } from 'antd';
import React from 'react';
import { Link } from 'umi';

const NoFoundPage: React.FC<{}> = () => (
  <Result
    status="500"
    title="500"
    style={ {
      background: 'none',
    } }
    subTitle="抱歉！服务器发生错误，请检查服务器。"
    extra={
      <Link to="/">
        <Button type="primary">返回首页</Button>
      </Link>
    }
  />
);

export default NoFoundPage;
