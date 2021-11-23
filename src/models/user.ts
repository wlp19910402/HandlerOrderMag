import { stringify } from 'querystring';
import type { Reducer, Effect } from 'umi';
import { history } from 'umi';
import { fakeAccountLogin, fackAccountInfo, fackLogout } from '@/services/user';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
import localforage from 'localforage';

export type UserStateType = {
  id?: number;
  // email?: string;
  username?: string;
  nickName?: string;
  // permissions?: []
  // state?: number;
  mobile?: string;
  // realname?: string;
  // token?: string;
}
export type UserModelState = {
  currentUser?: UserStateType;
}
export type LoginModelType = {
  namespace: string;
  state: UserModelState;
  effects: {
    login: Effect;
    logout: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    changeCurrentUser: Reducer<UserModelState>;
    clearUser: Reducer<UserModelState>;
  };
}

const Model: LoginModelType = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    // 登录
    *login ({ payload, callback }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      if (!response) return
      // yield put({
      //   type: 'changeCurrentUser',
      //   payload: response.data,
      // });
      localforage.setItem('token', response.data.accessToken)
      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      message.success('🎉 🎉 🎉  登录成功！');
      let { redirect } = params as { redirect: string };
      callback(response)
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf('#') + 1);
            if (redirect.indexOf('/user/login') !== -1) redirect = "/welcome";
          } else {
            history.replace('/welcome');
          }
        } else {
          history.replace('/welcome');
          return;
        }
      }
      history.replace(redirect || '/welcome');
    },
    // 使用token获取用户信息
    *fetchCurrent ({ callback }, { call, put }) {
      const response = yield call(fackAccountInfo);
      // console.log(response, 3333)
      if (!response || response.code !== 0) {
        callback(false)
        return
      }
      yield put({
        type: 'changeCurrentUser',
        payload: response.data,
      });
      // localforage.setItem('token', response.data.token)
      if (window.location.hash.indexOf('/user/login') !== -1) {
        history.replace('/')
      }
      callback(true)
    },
    // 退出
    *logout (_, { put, call }) {
      yield call(fackLogout);
      yield put({
        type: 'clearUser'
      });
      localforage.removeItem('token')
      history.replace('/user/login')
    }
  },
  reducers: {
    changeCurrentUser (state, { payload }) {
      return {
        ...state,
        currentUser: payload || {},
      };
    },
    clearUser () {
      return {
        currentUser: {}
      }
    }
  },
};

export default Model;
