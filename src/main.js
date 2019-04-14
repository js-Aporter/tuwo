import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import {appRouter} from './router/router';
import store from './store';
import App from './App';
// import VueI18n from 'vue-i18n';
// import '@/locale';
import './styles/style.less'

// 自定义功能
/*************************************/
import tools from './libs/tools'
import ajax from './libs/ajax'
import activeTableComponent from './components/ActiveTable'
import previewGroupComponent from './components/PreviewGroup'
import uploadFileComponent from './components/UploadFile'
import tabsComponent from './components/NavTabs'
import asyncButtonComponent from './components/AsyncButton'
import regionComponent from './components/Region'

import './libs/mock'    // 生产环境请关闭这个引用

Vue.component('ActiveTable', activeTableComponent);
Vue.component('NavTabs', tabsComponent);
Vue.component('PreviewGroup', previewGroupComponent);
Vue.component('UploadFile', uploadFileComponent);
Vue.component('AsyncButton', asyncButtonComponent);
Vue.component('Region', regionComponent);

// Vue.directive('autoSize', {
//
// });
Vue.use(tools);
Vue.use(ajax);
/*************************************/

// Vue.use(VueI18n);
Vue.use(iView);

new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App),
  data: {
    currentPageName: ''
  },
  mounted() {
    this.currentPageName = this.$route.name;
    // 显示打开的页面的列表
    this.$store.commit('setOpenedList');
    this.$store.commit('initCachepage');
    // 权限菜单过滤相关
    this.$store.commit('updateMenulist');
  },
  created() {
    let tagsList = [];
    appRouter.map((item) => {
      if (item.children.length <= 1) {
        tagsList.push(item.children[0]);
      } else {
        tagsList.push(...item.children);
      }
    });
    this.$store.commit('setTagsList', tagsList);
  }
});
