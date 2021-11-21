import type { Reducer, Effect } from 'umi';
import { queryMenuTree, saveMenu, queryCurrentMenu, fetchDelMenu } from '@/services/menu';
import { message } from 'antd';
import type { MenuDataType } from '@/pages/admin/Menu/data.d';
const localMenuList = [
  {
    id: 17,
    parentId: 0,
    name: '系统管理',
    url: '/admin',
    code: 'sys:manage',
    seq: 1,
    icon: 'icon-2jichumokuai',
    type: 1,
    children: [
      {
        id: 18,
        name: '用户管理',
        parentId: 17,
        seq: 1,
        children: [],
        icon: 'fa fa-users',
        type: 1,
        url: '/admin/user',
        code: 'sys:user',
      },
      {
        id: 23,
        name: '角色管理',
        parentId: 17,
        seq: 1,
        children: [],
        icon: 'fa fa-user-secret',
        type: 1,
        url: '/role/list',
        code: 'sys:role',
      },
      {
        id: 28,
        name: '权限管理',
        parentId: 17,
        seq: 1,
        children: [],
        icon: 'fa fa-cog',
        type: 1,
        url: '/perm/list',
        code: 'sys:permission',
      },
    ],
  },
  {
    id: 33,
    parentId: 0,
    name: '工单管理',
    url: '#',
    code: 'workorder:manage',
    seq: 0,
    icon: 'icon-03zibiaobiaodan',
    type: 1,
    children: [],
  },
];
export type MenuModelState = {
  currentMenu: MenuDataType[] | [];
  menuTree: MenuDataType[] | [];
  flatMenuData: MenuDataType[] | [];
  // localMenuList: MenuDataType[] | [];
};
const welcome = {
  children: [],
  icon: 'icon-gift2',
  id: 118,
  name: '欢迎页',
  orderNum: 1,
  parentId: 0,
  perms: '',
  type: 1,
  url: '/welcome',
};
const defaulState = {
  currentMenu: [],
  menuTree: [],
  flatMenuData: [],
};
const fetchFaltMenuData: any = (menuData: MenuDataType[] | []) => {
  const tmpArr: any = [];
  const fn = (data: MenuDataType[]) => {
    if (data.length > 0) {
      data.forEach((item: any) => {
        tmpArr.push(item);
        if (item.children?.length > 0) {
          fn(item.children);
        }
      });
    }
  };
  fn(menuData);
  return tmpArr;
};
export type MenuModelType = {
  namespace: string;
  state: MenuModelState;
  effects: {
    fetchMenuTree: Effect;
    saveMenu: Effect;
    fetctCurrentMenu: Effect;
    delMenu: Effect;
    clearMenu: Effect;
  };
  reducers: {
    changeCurrentMenu: Reducer<MenuModelState>;
    changeMenuTree: Reducer<MenuModelState>;
  };
};

const Model: MenuModelType = {
  namespace: 'menu',
  state: defaulState,
  effects: {
    // 获取菜单列表
    *fetchMenuTree({ callback }, { call, put }) {
      const response = yield call(queryMenuTree);
      if (!response) return;
      yield put({
        type: 'changeMenuTree',
        payload: response.data,
      });
      const menuData = [
        {
          icon: 'icon-FolderOpen',
          name: '目录',
          id: 0,
          url: '#',
          type: 0,
          perms: '',
          orderNum: 0,
          parentId: 0,
          children: response.data,
        },
      ];
      const flatMenuData = fetchFaltMenuData(menuData);
      if (callback) callback(menuData, flatMenuData);
    },
    // 保存菜单
    *saveMenu({ payload, callback }, { call }) {
      const response = yield call(saveMenu, payload);
      if (!response) return;
      if (callback) callback(response);
      message.success('保存成功！');
    },
    *delMenu({ payload, callback }, { call }) {
      const response = yield call(fetchDelMenu, payload);
      if (!response) return;
      if (callback) callback(response);
      message.success('删除成功！');
    },
    // 当前用户菜单
    *fetctCurrentMenu(_, { put, call }) {
      yield put({
        type: 'changeCurrentMenu',
        payload: [welcome, ...localMenuList],
      });
      // const response = yield call(queryCurrentMenu);
      // if (!response) {
      //   yield put({
      //     type: 'changeCurrentMenu',
      //     payload: [welcome],
      //   });
      //   return;
      // }
      // const menuData = response.data;
      // yield put({
      //   type: 'changeCurrentMenu',
      //   payload: [welcome, ...menuData],
      // });
    },
    *clearMenu(_, { put }) {
      yield put({
        type: 'changeCurrentMenu',
        payload: [],
      });
      yield put({
        type: 'changeMenuTree',
        payload: [],
      });
    },
  },
  reducers: {
    changeCurrentMenu(state = defaulState, { payload }) {
      return {
        ...state,
        currentMenu: payload,
      };
    },
    changeMenuTree(state = defaulState, { payload }) {
      return {
        ...state,
        menuTree: payload,
      };
    },
  },
};

export default Model;
