import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import {routes, otherRouter, appRouter} from './router';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
  // mode: 'history',
  routes: routes
};

export const router = new VueRouter(RouterConfig);
const otherRouterList = []
otherRouter.children.map((item) => {
  otherRouterList.push(item.name)
})

const unCheckRouter = ['Login', ...otherRouterList, 'Error403'] // 不需要校验权限的页面

// 简单校验能否访问该路由
function checkAccess (to, from, next) {
  let status = true
  const accessData = JSON.parse(localStorage.getItem('accessData')) || [];
  const userName = Cookies.get("user")
  let unCheckRoute = unCheckRouter.find((i) => {return to.name == i})

  // 在不需要校验的路由下才进行控制
  if (!unCheckRoute) {
    // 输入的路由没有访问权限时，跳转到登录
    if (userName != 'admin') {
      let check = accessData.find((item) => {return to.name == item.name})
      if (!check) {
          status =  false
      }
    }
  }
  return status
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  Util.title(to.meta.title);

  // 控制路由权限，禁止手动输入的无权限路由，自动跳转到403页面
  if (!checkAccess(to, from, next)) {
    next({
        replace: true,
        name: 'Error403'
    });
  }

  if (Cookies.get('locking') === '1' && to.name !== 'locking') { // 判断当前是否是锁定状态
    next({
      replace: true,
      name: 'locking'
    });
  } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
    next(false);
  } else {
    
    if (!Cookies.get('user') && to.name !== 'Login') { // 判断是否已经登录且前往的页面不是登录页
      next({
        name: 'Login'
      });
    } else if (Cookies.get('user') && to.name === 'Login') { // 判断是否已经登录且前往的是登录页
      Util.title();
      next({
        name: 'home_index'
      });
    } else {
      const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name);
      if (curRouterObj && curRouterObj.access !== undefined) { // 需要判断权限的路由
        if (curRouterObj.access === parseInt(Cookies.get('access'))) {
          Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next); // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
        } else {
          next({
            replace: true,
            name: 'error-403'
          });
        }
      } else { // 没有配置权限的路由, 直接通过
        Util.toDefaultPage([...routes], to.name, router, next);
      }
    }
  }
  next()
});

router.afterEach((to) => {
  // Util.openNewPage(router.app, to.name, to.params, to.query);
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});
