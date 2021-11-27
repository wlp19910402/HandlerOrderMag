import React, { useEffect } from 'react';
import { Inspector } from 'react-dev-inspector';
import type { ConnectState } from '@/models/connect';
// import { Spin } from 'antd';
import type { Dispatch, ConnectProps } from 'umi';
import { connect } from 'umi';

const InspectorWrapper = process.env.NODE_ENV === 'development' ? Inspector : React.Fragment;
type BlankLayout = {
  children: React.ReactNode;
  isLogin: boolean;
  dispatch: Dispatch;
  // token: string | undefined;
  mobile: string | undefined;
} & ConnectProps;

const BlankLayoutCmp: React.FC<BlankLayout> = ({ children, dispatch, mobile }) => {
  useEffect(() => {
    if (!mobile && dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
        callback: (res: boolean) => {
          res &&
            dispatch({
              type: 'menu/fetctCurrentMenu',
            });
          !res &&
            dispatch({
              type: 'user/logout',
            });
        },
      });
    }
  }, []);
  return <InspectorWrapper>{children}</InspectorWrapper>;
};

export default connect(({ user }: ConnectState) => ({
  mobile: user.currentUser?.mobile,
}))(BlankLayoutCmp);
