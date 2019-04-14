import Cookies from 'js-cookie';
import axios from "axios";

const user = {
  state: {
    userId: '',
    user: ''
  },
  mutations: {
    logout(state, vm) {
      // Cookies.remove('user');
      // Cookies.remove('password');
      // Cookies.remove('access');

      // let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      // if(keys) {
      //   for(var i = keys.length; i--;){
      //     Cookies.remove(keys[i]);
      //   }
      // }
      // sessionStorage.clear();
      // localStorage.clear();

      let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if(keys) {
        for(var i = keys.length; i--;){
          Cookies.remove(keys[i]);
        }
      }
      sessionStorage.clear();
      localStorage.clear();
      

      // 恢复默认样式
      // let themeLink = document.querySelector('link[name="theme"]');
      // themeLink.setAttribute('href', '');
      // 清空打开的页面等数据，但是保存主题数据
      // let theme = '';
      // if (localStorage.theme) {
      //   theme = localStorage.theme;
      // }
      // localStorage.clear();
      // if (theme) {
      //   localStorage.theme = theme;
      // }
    },
    setUser(state, id) {
      Cookies.set('user', id, {expires: 7});
      state.user = id;
    },
    setToken(state, token) {
      Cookies.set('token', token, {expires: 7});
      state.token = token;
    },
    updateUser(state) {
      state.user = Cookies.get('user') || '';
    },

    setUserId(state, id) {
      Cookies.set('userId', id, {expires: 7});
      state.userId = id;
    },
    updateUserId(state) {
      state.userId = Cookies.get('userId') || '';
    },
  }
};

export default user;
