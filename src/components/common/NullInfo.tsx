import { Button, Result, Card } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage: React.FC<{}> = () => (
  <Card>
    <Result
      title="访问的内容不存在"
      style={ {
        background: 'none',
      } }
      subTitle="抱歉！您访问的地址内容不存在，请核实在进行访问"
      extra={
        <Button type="primary" onClick={ () => history.goBack() }>返回</Button>
      }
    />
  </Card>
);

export default NoFoundPage;
