export default {
  HANDLER_ORDER_MAG: '/handler/login',
  HANDLER_ORDER_CODE: '/handler/code/image/base64',
  USER_CURRENT: '/handler/sys/current/user/info',
  // 用户管理接口
  // USER_LOGIN: '/api/sys/login',
  // USER_CURRENT: "/api/user/current",

  USER_LOGOUT: "/api/sys/logout",
  USER_AUTHORITY: '/api/user/authorization',
  USER_LIST: '/api/user/list',
  USER_ADD: '/api/user/add',
  USER_DELETE: '/api/user/del',/// user/del/{id}
  USER_STATUS: '/api/user/status',/// user/status/{id}
  USER_ROLE_ID: '/api/user/role',/// user/role/{id}
  USER_EDIT: '/api/user/edit',// 用户编辑
  USER_NOT_BIND_WX: '/api/user/not-bind-wx',//未绑定管理员用户
  USER_EDIT_PWD: "/api/user/edit-pwd",//修改密码
  // 角色管理接口
  ROLE_LIST: '/api/sys/role/list',
  ROLE_USERID_CHECKID: '/api/sys/role/list',// 角色列表标记指定用户拥有的权限/sys/role/list/{userId}
  ROLE_SAVE: '/api/sys/role/save',
  ROLE_BIND: '/api/sys/role/bind',
  ROLE_GET_MENU: '/api/sys/role/menu',// 绑定权限回显/sys/role/menu/{id}
  ROLE_INFO: '/api/sys/role/detail',/// sys/role/detail/{id}
  ROLE_DELETE: '/api/sys/role/del',// 角色删除/sys/role/del/{id}
  // 菜单管理接口
  MENU_TREE: '/api/sys/menu/tree',// 当前用户菜单【用于用户登录后菜单加载】
  MENU_SAVE: '/api/sys/menu/save',// 添加或编辑菜单
  MENU_CURRENT_TREE: '/api/sys/menu/current/tree',// 当前用户菜单【用于用户登录后菜单加载】
  MENU_DELETE: '/api/sys/menu/del',/// sys/menu/del/{id}
  // 字典管理接口
  DICTIONARY_LIST: '/api/sys/dic/list',
  DICTIONARY_SAVE: '/api/sys/dic/save',
  DICTIONARY_DELETE: '/api/sys/dic/del',/// sys/dic/del/{id}
  DICTIONARY_TYPE: '/api/sys/dic/list',/// sys/dic/list/{type}字典类型查询该字典的数据
  DICTIONARY_PARENT_ID: '/api/sys/dic/childs',//sys/dic/childs/{parentId}//父级id查询子集的内容
  // 上传文件的接口
  UPLOAD_OSS_SIGN: '/api/oss/upload-sign',// 获取上传签名信息
  UPLOAD_FILE: '/api/oss/upload-file',// 文件直传服务
  UPLOAD_STS_SIGN: '/api/oss/sts-sign',// 获取STS签名
  //设备管理-设备管理接口
  DEVICE_LIST: '/api/device/list',
  DEVICE_INFO: '/api/device/info',/// device/info/{id}
  DEVICE_DELETE: '/api/device/del',/// device/del/{id}
  DEVICE_SAVE: '/api/device/save',
  // 耗材管理-设备管理接口
  COMSUMABLE_LIST: '/api/consumable/list',
  COMSUMABLE_INFO: '/api/consumable/info',/// consumable/info/{id}
  COMSUMABLE_DELETE: '/api/consumable/del',/// consumable/del/{id}
  COMSUMABLE_SAVE: '/api/consumable/save',
  // 备件管理-设备管理接口
  PART_LIST: '/api/part/list',
  PART_INFO: '/api/part/info',/// part/info/{id}
  PART_DELETE: '/api/part/del',/// part/del/{id}
  PART_SAVE: '/api/part/save',
  // 安装单位管理-设备档案管理接口
  COMPANY_LIST: '/api/company/list',
  COMPANY_INFO: '/api/company/info',/// company/info/{id}
  COMPANY_DELETE: '/api/company/del',/// company/del/{id}
  COMPANY_SAVE: '/api/company/save',
  COMPANY_FIND_BY_NAME: "/api/company/find-by-name",
  // 档案列表管理-设备档案管理接口
  PORTFOLIO_LIST: '/api/portfolio/list',//档案列表查询
  PORTFOLIO_SAVE: '/api/portfolio/add',//
  PORTFOLIO_INFO: '/api/portfolio/info',/// portfolio/info/{id}
  PORTFOLIO_DELETE: '/api/portfolio/del',/// portfolio/del/{id}
  //档案耗材管理-设备档案管理接口
  PORTFOLIO_ADD_CONSUMABLE: '/api/portfolio/add-consumable',//档案耗材新增
  PORTFOLIO_LIST_CONSUMABLE: "/api/portfolio/consumable-list",///portfolio/consumable-list/{id} 档案耗材列表
  PORTFOLIO_DELETE_CONSUMABLE: '/api/portfolio/move-consumable',///portfolio/move-consumable/{portfolioConsumableId} 移除档案耗材
  PORTFOLIO_UPDATE_CONSUMABLE: '/api/portfolio/update-consumable',///portfolio/update-consumable//修改档案耗材
  //档案备件管理-设备档案管理接口
  PORTFOLIO_ADD_PART: '/api/portfolio/add-part',//档案耗材新增
  PORTFOLIO_LIST_PART: "/api/portfolio/part-list",///portfolio/part-list/{id} 档案耗材列表
  PORTFOLIO_DELETE_PART: '/api/portfolio/move-part',///portfolio/move-part/{portfolioPartId} 移除档案耗材
  PORTFOLIO_UPDATE_PART: '/api/portfolio/update-part',///portfolio/update-part//修改档案耗材
  //工单管理
  WORK_ORDER_ADD: '/api/work-order/sys-add',//新增工单
  WORK_ORDER_LIST: "/api/work-order/list",//工单列表
  WORK_ORDER_SEND_ORDERS: '/api/work-order/send-orders',//派单
  WORK_ORDER_BIND_PROTFOLIO: '/api/work-order/bind-portfolio',//绑定档案
  WORK_ORDER_CANCEL: "/api/work-order/cancel",//撤单
  WORK_ORDER_INFO: '/api//work-order/info',//详情
  WORK_ORDER_SUBMIT: "/api/work-order/submit",//结单
  WORK_ORDER_LOGS: '/api/work-order/logs',//工单操作日志/work-order/logs/{id}
  //工程师管理
  ENGINEER_LIST: "/api/wx/engineers", //工程师管理列表
  WX_USER_LIST: "/api/wx/list", //工程师管理列表
  WX_BIND_ADMIN: "/api/wx/bind-admin",//绑定管理员
  // 监控管理
  MONITOR_CONSUMABLE_LIST: '/api/monitor/consumables',//耗材监控列表
  WORK_ORDER_QUICK_CREATE: "/api/work-order/quick-create",//快捷创建工单
}