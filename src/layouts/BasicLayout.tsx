/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import type {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings
} from '@ant-design/pro-layout';
import ProLayout, {
  DefaultFooter,
} from '@ant-design/pro-layout';
import React, { useMemo, useRef } from 'react';
import type { Dispatch } from 'umi';
import { Link, connect, history } from 'umi';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import type { ConnectState } from '@/models/connect';
import { getMatchMenu } from '@umijs/route-utils';
// import logo from 'http://shouhouyi.oss-cn-hangzhou.aliyuncs.com/passport/19/20210929/64b37a766d334a1b89c2b9623e246f54.png';
import type { MenuDataType } from '@/pages/admin/Menu/data.d'
import { IconFont } from '@/components/common/IconFont'

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">登录</Link>
      </Button>
    }
  />
);
export type BasicLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
  currentMenu: MenuDataType[] | [];
} & ProLayoutProps
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: Record<string, MenuDataItem>;
};
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => menuList.map((item) => {
  const localItem = {
    icon: item.icon ? <IconFont type={item.icon.toString()} /> : undefined,
    name: item.name,
    path: item.url,
    parentKeys: [item.parentId.toString()],
    key: item.id.toString(),
    routes: item.children && item.children?.length ? menuDataRender(item.children) : undefined,
    children: item.children && item.children?.length ? menuDataRender(item.children) : undefined,
    hideChildrenInMenu: item.type === '2' || item.type === 2,
    hideInBreadcrumb: false
  };
  return Authorized.check(item.perms, localItem, null) as MenuDataItem;
});

const defaultFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()}e呼必应`}
    links={false}
  />
);
const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    currentMenu
  } = props;
  const menuDataRef = useRef<MenuDataItem[]>([]);
  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };
  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );
  return (
    <>
      {
        currentMenu.length > 0 && <ProLayout
          style={{ backgroundColor: '#1B90FF', }}
          // menuHeaderRender={(logo, title) => (
          //   <div
          //     id="customize_menu_header"
          //     onClick={() => {
          //       window.open('https://remaxjs.org/');
          //     }}
          //   >
          //     {/* {logo} */}
          //     {title}
          //   </div>
          // )}
          // siderWidth={1200}
          menuDataRender={() => menuDataRender(currentMenu)}
          logo={'logo.png'}
          {...props}
          {...settings}
          onCollapse={handleMenuCollapse}
          onMenuHeaderClick={() => history.push('/')}
          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.isUrl || !menuItemProps.path) {
              return defaultDom;
            }
            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
          breadcrumbRender={(routers = []) => {
            return [
              {
                path: '/',
                breadcrumbName: '首页'
              },
              ...routers,
            ]
          }}
          itemRender={(route, params, routes, paths) => {
            const first = routes.indexOf(route) === 0;
            return first ? (
              <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
            ) : (
              <span>{route.breadcrumbName}</span>
            );
          }}
          footerRender={() => defaultFooterDom}
          rightContentRender={() => <RightContent />}
        // postMenuData={(menuData) => {
        //   menuDataRef.current = menuData || [];
        //   return menuData || [];
        // }}
        >
          <Authorized authority={authorized!.authority} noMatch={noMatch}>
            {children}
          </Authorized>
        </ProLayout>
      }
    </>
  );
};

export default connect(({ global, settings, menu }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
  currentMenu: menu.currentMenu
}))(BasicLayout);
