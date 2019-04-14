<template>
  <Button
    @click="send"
    :size="size"
    type="text"
    class="verify-code-btn"
    :disabled="second >= 0"
    :loading="loading"
  >{{second >= 0 ? "已发送(" + second + ")" : "发送验证码"}}</Button>
</template>

<script>
// 验证手机号码
let phoneNumberRex = /^1\d{10}$/;

export default {
  props: {
    phoneNumber: [String, Number],
    size: String,
    type: String
  },
  data() {
    return {
      second: -1,
      loading: false
    };
  },
  methods: {
    // 开始计时
    send() {
      if (this.second < 0 && !this.loading) {
        // 验证一下手机号码
        let phoneNumber = this.phoneNumber,
          errorMessage =
            phoneNumber.length === 0
              ? "请输入手机号码"
              : !phoneNumberRex.test(phoneNumber)
              ? "手机号码格式不正确"
              : false;
        if (errorMessage) {
          return this.$Notice.warning({
            title: errorMessage
          });
        }
        this.loading = true;
        this.$ajax({
          url: "/api/system/getvcode",
          data: {
            mobile: phoneNumber
          },
          success: res => {
            this.$Notice.success({
              title: "验证码发送成功！"
            });
            this.changeSecond(60); // 开始 60 秒倒计时
          },
          complete: res => {
            if (res.code != 0) {
              this.end();
            }
            this.loading = false;
          }
        });
      }
    },

    // 计时
    changeSecond(second) {
      this.second = second--;
      if (second > -2) {
        this.timer = setTimeout(() => {
          this.changeSecond(second);
        }, 1000);
      }
    },

    // 结束倒计时
    end() {
      clearTimeout(this.timer);
      this.second = -1;
    }
  }
};
</script>

<style scoped>
</style>
