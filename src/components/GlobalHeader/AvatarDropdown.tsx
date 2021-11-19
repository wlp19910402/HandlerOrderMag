import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import type { ConnectProps } from 'umi';
import { history, connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { UserStateType } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import notLoginAvatar from '@/assets/images/header-avatar.png'
import inLoginAvatar from '@/assets/images/resumeHeader.jpg'

export type GlobalHeaderRightProps = {
  currentUser?: UserStateType;
  isLogin?: boolean;
} & Partial<ConnectProps>

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => {
    const { key } = event;
    if (key === 'logout') {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'user/logout',
        });
        dispatch({
          type: 'menu/clearMenu'
        })
      }
      return;
    }
    history.push(`/account/${key}`);
  };

  render(): React.ReactNode {
    const {
      currentUser,
      isLogin = false
    } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {/* {isLogin && (
          <Menu.Item key="center">
            <UserOutlined />
            个人中心
          </Menu.Item>
        ) }
        {isLogin && (
          <Menu.Item key="settings">
            <SettingOutlined />
            个人设置
          </Menu.Item>
        ) }
        {isLogin && <Menu.Divider /> } */}
        {isLogin && (
          <Menu.Item key="logout">
            <LogoutOutlined />
            退出登录
          </Menu.Item>
        )}
        {!isLogin && (
          <Menu.Item key="logout">
            <LogoutOutlined />
            去登录
          </Menu.Item>
        )}
      </Menu>
    );
    return currentUser && currentUser.username ? (
      <HeaderDropdown overlay={menuHeaderDropdown} >
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={isLogin ? inLoginAvatar : notLoginAvatar} alt="avatar" />
          <span style={{ marginLeft: '10px' }} className={`${styles.name} anticon`}>{isLogin ? currentUser.username : "游客"}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
  isLogin: !!user.currentUser?.mobile
}))(AvatarDropdown);
