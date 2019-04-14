import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import system from './modules/system';
import access from './modules/access';

Vue.use(Vuex);
Vue.use(system);

const store = new Vuex.Store({
  state: {},
  mutations: {},
  getters: {},
  actions: {},
  modules: {
    app,
    user,
    system: system.store,
    access
  }
});

export default store;
