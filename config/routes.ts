export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: '登录',
            path: '/user/login',
            component: './Login',
          },
          {
            path: '*',
            component: './404',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            routes: [
              {
                path: '/',
                redirect: '/welcome',
              },
              {
                path: '/welcome',
                name: '欢迎页',
                icon: 'smile',
                component: './Welcome',
              },
              {
                path: '/admin',
                name: '系统管理',
                icon: 'smile',
                routes: [
                  {
                    path: '/admin/user',
                    name: '用户列表',
                    component: './admin/UserList',
                  },
                  {
                    path: '/admin/role',
                    name: '角色管理',
                    component: './admin/Role',
                  },
                  {
                    path: '/admin/dic',
                    name: '产品品类管理',
                    component: './admin/Dic',
                  },
                  {
                    path: '/admin/website',
                    name: '网点管理',
                    component: './admin/Website',
                  },
                  {
                    path: '*',
                    component: './404',
                  },
                ],
              },
              {
                path: '/workorder',
                name: '工单管理',
                icon: 'smile',
                routes: [
                  {
                    path: '/workorder/list/',
                    name: '工单列表',
                    component: './workOrder/OrderList',
                  },

                  {
                    path: '*',
                    component: './404',
                  },
                ],
              },

              {
                name: 'exception',
                path: '/exception',
                routes: [
                  {
                    path: '/index.html',
                    redirect: '/exception/403',
                    exact: true,
                  },
                  {
                    path: '/',
                    redirect: '/exception/403',
                    exact: true,
                  },
                  {
                    name: '403',
                    path: '/exception/403',
                    component: './exception/403',
                    exact: true,
                  },
                  {
                    name: '404',
                    path: '/exception/404',
                    component: './exception/404',
                    exact: true,
                  },
                  {
                    name: '500',
                    path: '/exception/500',
                    component: './exception/500',
                    exact: true,
                  },
                  {
                    path: '*',
                    component: './404',
                  },
                ],
              },
              {
                path: '*',
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
