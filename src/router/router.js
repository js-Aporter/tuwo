import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
const separateRouters = [
  {
    path: '/login',
    name: 'Login',
    meta: {title: '途窝文旅 - 登录'},
    component: () => import('@/views/login/Index.vue')
  },
  {
    path: '/*',
    name: 'Error404',
    meta: {title: '404-页面不存在'},
    component: () => import('@/views/error-page/404.vue')
  },
  {
    path: '/403',
    meta: {title: '403-权限不足'},
    name: 'Error403',
    component: () => import('@/views/error-page/403.vue')
  },
  {
    path: '/500',
    meta: {title: '500-服务端错误'},
    name: 'Error500',
    component: () => import('@/views/error-page/500.vue')
  }
];

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/home',
  component: Main,
  children: [
    {
      path: 'home',
      title: {i18n: 'home'},
      name: 'home_index',
      component: () => import('@/views/home/Index')
    },
    {
      path: 'member-detail',
      title: '会员详情',
      name: 'MemberDetail',
      component: () => import('@/views/member/detail/Index')
    }
  ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/member',
    name: 'Member',
    title: '会员管理',
    component: Main,
    children: [
      {
        path: 'index',
        name: 'MemberIndex',
        title: '会员管理',
        component: () => import('@/views/member/member/Index')
      }
    ]
  },
  {
    path: '/business',
    name: 'Business',
    title: '业务处理',
    component: Main,
    children: [
      {
        path: 'setting',
        name: 'Setting',
        title: '配置管理',
        component: () => import('@/views/business/setting/Index')
      },
      {
        path: 'notice',
        name: 'Notice',
        title: '公告管理',
        component: () => import('@/views/business/notice/Index')
      },
      {
        path: 'consultation',
        name: 'Consultation',
        title: '咨询管理',
        component: () => import('@/views/business/consultation/Index')
      }
    ]
  },
  {
    path: '/order',
    name: 'Order',
    title: '订单记录',
    component: Main,
    children: [
      {
        path: 'asset-collection-record',
        name: 'AssetCollectionRecord',
        title: '资产领取记录',
        component: () => import('@/views/order/asset-collection-record/Index')
      },
      {
        path: 'rujin-record',
        name: 'RujinRecord',
        title: '入金值记录',
        component: () => import('@/views/order/rujin-record/Index')
      },
      {
        path: 'asset-transfer-record',
        name: 'AssetTransferRecord',
        title: '资产互转记录',
        component: () => import('@/views/order/asset-transfer-record/Index')
      },
      {
        path: 'baoben-record',
        name: 'BaobenRecord',
        title: '保本资产记录',
        component: () => import('@/views/order/baoben-record/Index')
      },
      {
        path: 'activation-code-purchase',
        name: 'ActivationCodePurchase',
        title: '邀请码购买记录',
        component: () => import('@/views/order/activation-code-purchase/Index')
      },
      {
        path: 'DigitalCurrencyAddress',
        name: 'digital-currency-address',
        title: '数字货币地址记录',
        component: () => import('@/views/order/digital-currency-address/Index')
      }
    ]
  },
  {
    path: '/finance',
    name: 'Finance',
    title: '财务管理',
    component: Main,
    children: [
      {
        path: 'asset-pay-record',
        name: 'AssetPayRecord',
        title: '资产打款记录',
        component: () => import('@/views/finance/asset-pay-record/Index')
      },
      {
        path: 'fund-asset',
        name: 'FundAsset',
        title: '入金资产确认',
        component: () => import('@/views/finance/fund-asset/Index')
      },
      {
        path: 'assets-statistics',
        name: 'AssetsStatistics',
        title: '各类型资产统计',
        component: () => import('@/views/finance/assets-statistics/Index')
      },
      // {
      //   path: 'digital-currency-statistics',
      //   name: 'DigitalCurrencyStatistics',
      //   title: '数字货币资产统计',
      //   component: () => import('@/views/finance/digital-currency-statistics/Index')
      // }
      {
        path: 'DynamicAssetsBonus',
        name: 'dynamic-assets-bonus',
        title: '动态资产分红记录',
        component: () => import('@/views/order/dynamic-assets-bonus/Index')
      }
    ]
  },
  {
    path: '/account',
    name: 'Account',
    title: '账号管理',
    component: Main,
    children: [
      {
        path: 'admin',
        name: 'Admin',
        title: '后台账号',
        component: () => import('@/views/account/admin/Index')
      },
      {
        path: 'role',
        name: 'Role',
        title: '角色管理',
        component: () => import('@/views/account/role/Index')
      }
    ]
  },
];


// 指向第一个子路由
appRouter.forEach(item => {
  const {path, children} = item;
  item.redirect = path + '/' + children[0].path;
});


// 所有上面定义的路由都要写在下面的routes里
export const routes = [
  otherRouter,
  ...appRouter,
  ...separateRouters
];


// 检查定义的路由名称和权限名称是否有重复的项
// 生产环境请注释以下相关代码:
// const filterRouterNames = [];
//
// function checkRouters(list) {
//   list.forEach(({name, children, meta: {roles} = {}}) => {
//     if (filterRouterNames[name]) {
//       console.error('路由或者权限名称重复：' + name);
//     } else {
//       filterRouterNames[name] = true;
//     }
//     checkRouters((children || []).concat(roles || []));
//   })
// }
//
// checkRouters(routers);
// console.error('已开启路由和权限名称防止重复定义检查，生产环境请务必注释相关源代码');
