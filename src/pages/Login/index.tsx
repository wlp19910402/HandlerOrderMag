import { LockTwoTone, SafetyCertificateTwoTone, UserOutlined } from '@ant-design/icons';
import { Image, Row, Col } from 'antd';
import React, { useState, useEffect } from "react";
import ProForm, { ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import styles from './index.less';
import { getCodeImage } from './service'

type LoginProps = {
  dispatch: Dispatch;
  submitting?: boolean;
}
const Login: React.FC<LoginProps> = (props) => {
  const { submitting, dispatch } = props;
  // const [ timestamp, setTimestamp ] = useState((new Date()).valueOf())
  const [ codeImageUrl, setCodeImageUrl ] = useState<String>();
  const handleSubmit = (values: any) => {
    dispatch({
      type: 'user/login',
      payload: { ...values },
      callback: async () => {
        await dispatch({
          type: 'user/fetchCurrent'
        })
      }
    });
  };
  useEffect(() => {
    fetchCodeImage()
  }, []);
  // const fetchTimestamp = () => {
  //   setTimestamp((new Date()).valueOf())
  // }

  // const fetchUserRoleId = async (record: UserListDataType) => {
  //   setCurrentRow(record);
  //   record.id !== undefined && getUserRoleId(record.id?.toString()).then(
  //     async (response) => {
  //       if (!response) return
  //       setInitialRoleIds(response.data);
  //       await fetchRoleListData();
  //       handleModalAuthifyVisible(true);
  //     })
  // }

  const fetchCodeImage = async () => {
    getCodeImage().then(
      (res) => {
        if (res.code == 0) {
          setCodeImageUrl(res.data.base64Img)
        }
      }
    )
  }
  return (
    <div className= { styles.main } >
    <ProForm
        submitter={
    {
      render: (_, dom) => dom.pop(),
        submitButtonProps: {
        loading: submitting,
          size: 'large',
            style: {
          width: '100%',
            },
      },
    }
  }
  onFinish = { async (values) => {
  handleSubmit(values);
} }
      >
  <>
  <ProFormText
            name="username"
fieldProps = { {
  size: 'large',
    prefix: <UserOutlined className={ styles.prefixIcon } />,
} }
placeholder = "请输入用户名"
rules = {
  [
  {
    required: true,
    message: "请输入用户名!"
  },
            ] }
  />
  <ProFormText.Password
            name="password"
fieldProps = { {
  size: 'large',
    prefix: <LockTwoTone className={ styles.prefixIcon } />,
} }
placeholder = '请输入密码'
rules = {
  [
  {
    required: true,
    message: "请输入密码！"
  },
            ] }
  />
  <Row>
  <Col span={ 16 }>
    <ProFormText
                name="imageCode"
fieldProps = { {
  size: 'large',
    prefix: <SafetyCertificateTwoTone className={ styles.prefixIcon } />,
} }
placeholder = "请输入图片验证码"
rules = {
  [
  {
    required: true,
    message: "请输入图片验证码!"
  },
                ] }
  /> </Col>
  < Col span = { 7 } offset = { 1 } onClick = { fetchCodeImage } style = { { backgroundColor: "white", height: "40px" } }>
    <Image
                style={ { width: "100%" } }
preview = { false }
src = { `data:image/png;base64,${codeImageUrl}` }
height = { 40 }

  />
  </Col>
  < /Row>
  < />
  < div
style = { {
  marginBottom: 24,
          } }
        >
  <ProFormCheckbox noStyle name = "autoLogin" >
    自动登录
    < /ProFormCheckbox>
    < a
style = { {
  float: 'right',
            } }
          >
  忘记密码
  < /a>
  < /div>
  < /ProForm>
  < /div>
  );
};

export default connect(({ loading }: ConnectState) => ({
  submitting: loading.effects[ 'user/login' ]
}))(Login);
