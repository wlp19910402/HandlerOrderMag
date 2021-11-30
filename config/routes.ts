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
                    path: '/admin/menu',
                    name: '菜单管理',
                    component: './admin/Menu',
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
                    path: '/workOrder/addOrder/success',
                    name: '操作成功',
                    component: './workOrder/AddOrder/success',
                  },
                  {
                    path: '/workOrder/maintain',
                    name: '维修工单',
                    routes: [
                      {
                        path: '/workOrder/maintain/',
                        redirect: '/workOrder/maintain/list',
                      },
                      {
                        path: '/workOrder/maintain/list',
                        name: '列表',
                        component: './workOrder/Maintain/List',
                      },
                      {
                        path: '/workOrder/maintain/info/:id',
                        name: '详情',
                        component: './workOrder/Maintain/Info',
                      },
                      {
                        path: '/workOrder/maintain/finish/:no',
                        name: '结单',
                        component: './workOrder/Maintain/Finish',
                      },
                      {
                        path: '*',
                        component: './404',
                      },
                    ],
                  },
                  {
                    path: '/workOrder/patrol',
                    name: '巡检工单',
                    routes: [
                      {
                        path: '/workOrder/patrol/',
                        redirect: '/workOrder/Patrol/list',
                      },
                      {
                        path: '/workOrder/patrol/list',
                        name: '列表',
                        component: './workOrder/Patrol/List',
                      },
                      {
                        path: '/workOrder/patrol/info/:id',
                        name: '详情',
                        component: './workOrder/Patrol/Info',
                      },
                      {
                        path: '/workOrder/patrol/finish/:no',
                        name: '结单',
                        component: './workOrder/Patrol/Finish',
                      },
                    ],
                  },
                  {
                    path: '/workOrder/install',
                    name: '安装工单',
                    routes: [
                      {
                        path: '/workOrder/install/',
                        redirect: '/workOrder/Install/list',
                      },
                      {
                        path: '/workOrder/install/list',
                        name: '列表',
                        component: './workOrder/Install/List',
                      },
                      {
                        path: '/workOrder/install/info/:id',
                        name: '详情',
                        component: './workOrder/Install/Info',
                      },
                      {
                        path: '/workOrder/install/finish/:no',
                        name: '结单',
                        component: './workOrder/Install/Finish',
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
                path: '/monitor',
                name: '监控管理',
                icon: 'smile',
                routes: [
                  {
                    path: '/monitor/consumable/',
                    redirect: '/monitor/consumable/list',
                  },
                  {
                    path: '/monitor/consumable/list',
                    name: '耗材监控',
                    component: './monitor/consumable/List/index',
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
