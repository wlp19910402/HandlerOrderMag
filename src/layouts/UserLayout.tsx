import type { MenuDataItem } from '@ant-design/pro-layout';
import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import type { ConnectProps, Dispatch } from 'umi';
import { SelectLang, useIntl, connect } from 'umi';
import React from 'react';
import type { ConnectState } from '@/models/connect';
import logo from '../assets/images/logo.png';
import styles from './UserLayout.less';

export type UserLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  dispatch: Dispatch;
  isLogin: boolean;
} & Partial<ConnectProps>;
const UserLayout: React.FC<UserLayoutProps> = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className={styles.container}>
        {/* <div className={ styles.lang }>
          <SelectLang />
        </div> */}
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <img alt="logo" className={styles.logo} src={logo} />
              {/* e呼必应 */}
            </div>
            {/* <div className={ styles.desc }>
              工单设备管理端
            </div> */}
          </div>
          {children}
        </div>
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings, user }: ConnectState) => ({
  ...settings,
  isLogin: !!user.currentUser?.mobile,
}))(UserLayout);
