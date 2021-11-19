import { Result, Button } from 'antd';
import React from 'react';
import { history } from 'umi'

interface ResultProps {
  title?: string;
  subTitle?: string;
}
const SearchSelect: React.FC<ResultProps> = ({ title = "操作成功", subTitle = "恭喜您，操作成功" }) => {
  return (
    <Result
      status="success"
      title={ title }
      subTitle={ subTitle }
      extra={ [
        <Button onClick={ () => { history.goBack() } } key="buy">返回</Button>,
      ] }
    />
  )
};

export default SearchSelect