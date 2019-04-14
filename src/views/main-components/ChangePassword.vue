<template>
  <Modal :value="value" :loading="loading" title="修改密码">
    <Form :label-width="100" ref="form" :model="form" :rules="rules">
      <FormItem label="旧密码" prop="oldPassword">
        <Input type="password" v-model="form.oldPassword"/>
      </FormItem>

      <FormItem label="新密码" prop="newPassword">
        <Input type="password" v-model="form.newPassword"/>
      </FormItem>

      <FormItem label="确认新密码" prop="confirmPassword">
        <Input type="password" v-model="form.confirmPassword"/>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
  import mixin from '@/libs/external-modal'

  export default {
    mixins: [mixin],
    data() {
      return {
        form: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        },
        rules: {
          oldPassword: [{required: true, message: '请输入旧密码'}],
          newPassword: [{required: true, message: '请输入新密码'}],
          confirmPassword: [{required: true, message: '请再次输入密码'},{
            validator: (rule, value, callback) => {
              if (value === this.form.newPassword) {
                callback();
              } else {
                callback(new Error('两次输入密码不一致'))
              }
            },
            trigger: 'blur'
          }]
        }
      }
    },

    methods: {
      handleSubmit(resolve, reject) {
        const form = this.form;
        this.$ajax({
          url: '/web/user/UpdatePassword',
          data: {
            usid: this.$store.state.user.userId,    // 必选	int	用户ID
            old_password: form.oldPassword,    // 必选	string	旧密码
            password: form.newPassword    // 必选	string	新密码
          },
          success: (res) => {
            this.$Notice.success({title: '密码修改成功'});
            resolve(res);
          },
          error: reject,
          fail: reject
        })
      }
    }
  }
</script>

<style scoped>

</style>
