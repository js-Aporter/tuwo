//
// 关闭模态框loading
function closeLoading(_this) {
  _this.loading = false;
  _this.$nextTick(function () {
    _this.loading = true;
  })
}

// 模态框异步提交
function submitModal(_this, executor) {
  new Promise(executor).then(response => {
    _this.$emit('success', response);
    _this.$emit('input', false);
  }).catch((error) => {
    closeLoading(_this);
  })
}

export default {
  props: {
    value: Boolean,
    data: Object,
    mode: String    // 模式，状态，通过此标记判断事件处理
  },

  data() {
    return {
      loading: false
    }
  },

  mounted() {
    const {
      handleOk,
      handleCancel,
      handleVisibleChange,
      handleSubmit,
      $children: [modal]   // 取到 Modal 组件
    } = this;

    if (modal.$options.name === 'Modal') {

      // 为什么在这里监听这些事件？是因为他们是常用事件，常~~用
      // 既然是常用，就需要简单一点的调用方法，
      // 这样做，你只需要在 methods 里面定义指定的方法，无需再去手动绑定
      // 即使是异步提交表单，也是一气呵成，😎
      modal.$on('input', evt => {
        this.$emit('input', evt);             // 自动监听 input 事件
      });

      if (handleOk) {
        modal.$on('on-ok', handleOk);         // 监听 on-ok 事件
      }

      if (handleCancel) {
        modal.$on('on-cancel', handleCancel);                    // 监听 on-cancel 事件
      }

      if (handleVisibleChange) {
        modal.$on('on-visible-change', handleVisibleChange);     // 监听 on-visible-change 事件
      }

      // 监听异步提交表单事件，loading 自动跟随，不会重复提交
      // 使用 Promise API
      if (handleSubmit) {
        const form = this.$refs.form;
        this.loading = true;
        if (form && form.model) {
          modal.$on('on-ok', (evt) => {
            form.validate(valid => {
              if (valid) {
                submitModal(this, handleSubmit);
              } else {
                closeLoading(this);
              }
            })
          });
          modal.$on('on-cancel', () => {
            form.resetFields();   // 自动清空表单
          });
        } else {
          modal.$on('on-ok', (evt) => {
            submitModal(this, handleSubmit);
          });
        }
      }
    }
  }
}
