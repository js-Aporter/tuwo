import {Notice} from 'iview'

export default {
  install(Vue) {
    Vue.prototype.$preview = function (options) {
      if (typeof options === 'string') {
        options = {
          url: options,
          type: this.$fn.getFileType(options),
        }
      }
      const {url, type, show = true} = options;
      if (type === 'unknownType') {
        Notice.warning({
          title: '该文件不支持预览',
          desc: '未知类型文件'
        });
      } else {
        this.$store.commit('preview', {url, type, show});
      }
    }
  },

  store: {
    state: {
      preview: {
        url: '',
        type: '',
        show: false,
      }
    },
    mutations: {
      preview(state, options) {
        for (let key in options) {
          state.preview[key] = options[key];
        }
      }
    }
  }
}
