export default {
  HANDLER_ORDER_MAG: '/login',
  HANDLER_ORDER_CODE: '/code/image/base64',
  USER_CURRENT: '/user/current',
  USER_LIST: '/user/list', //获取用户列表
  MENU_CURRENT_TREE: '/current/perm/list', // 当前用户菜单【用于用户登录后菜单加载】
  USER_STATUS: '/user/update/status', /// //系统用户更改状态sys/update/status/{id}
  USER_ADD: '/user/invitation', //邀请用户
  USER_DELETE: '/user/cancel/', /// user/del/{id}//删除用户
  // ROLE_USERID_CHECKID: '/sys/user/role/list', //当前用户下所有的角色列表
  USER_LIST_BY_ROLE: '/user/list-by-role', //{ roleId }根据角色id查询用户
  PERM_LIST_BY_ROLE: '/sys/perm/union-role', //{ roleId }根据角色id查询所有权限
  GET_PERM_LIST_ALL: '/sys/perm/all', //查询所有的权限列表
  ROLE_LIST: '/sys/role/list',
  USER_BIND_ROLE_EDIT: '/sys/user/role/edit',

  CUR_USER_SITE_LIST: '/site/user/site/list', //当前用户的网点

  ROLE_EDIT: '/sys/role/edit', //角色编辑
  ROLE_CREATE: '/sys/role/add', //角色创建
  ROLE_DELETE: '/sys/role/delete', //del/{id}
  ROLE_BIND: '/sys/role/bind',

  //字典接口
  DIC_LIST_BY_TYPE: '/sys/dic/list', //{type}字典的类型
  DIC_SAVE: '/sys/dic/save', //保存字典
  DIC_UPDATE_STATUS: '/sys/dic/update/status', //修改字典的状态
  DIC_LIST_BY_PARENT_ID: '/sys/dic/children', //{parentId}根据父级的id查询字典列表
  DIC_DELETE_BY_ID: '/sys/dic/delete', //删除字典
  DIC_LIST_BY_PAGE: '/sys/dic/page', //字典分页查询

  //网点查询
  WEBSITE_LIST_BY_PAGE: '/site/page', //分页查询
  WEBSITE_SAVE: '/site/save', //编辑或新增网点
  WEBSITE_UPDATE_STATUS: '/site/update-status', //修改网点状态
  WEBSITE_DELETE_BY_ID: '/site/area-del', //服务区域【删除】
  WEBSITE_DETAIL_BY_ID: '/site/info', //网点详情
  WEBSITE_AREA_SAVE: '/site/area-save', //服务区域新增
  //查询行政区域
  GET_AREA_DATA: '/area/subsets', //获取行政区域
  USER_LIST_By_WEBSITE_ID: '/site/user/page', //根据网点id查询用户列表
  GET_AREA_DATA_BY_WEBSITE: '/site/area-page', //网点服务区域分页列表


  //工单
  ORDER_LIST_BY_PAGE: '/work-order/page',//工单分页列表查询
  USER_LOGOUT: '/logout',

};
