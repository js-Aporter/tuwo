<template>
  <Modal :value="value" :loading="loading" title="添加">
    <Form :model="form" :rules="rules" ref="form" :label-width="100">
      <FormItem label="登录账号" prop="username">
        <Input v-model="form.username"></Input>
      </FormItem>

      <FormItem label="登录密码" prop="password">
        <Input v-model="form.password"></Input>
      </FormItem>

      <FormItem label="重复密码" prop="comfirmPassword">
        <Input v-model="form.comfirmPassword"></Input>
      </FormItem>

      <FormItem label="姓名" prop="name">
        <Input v-model="form.name"></Input>
      </FormItem>

      <FormItem label="手机号码" prop="phone">
        <Input v-model="form.phone"></Input>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
  import ExternalModal from '@/libs/external-modal'

  export default {
    mixins: [ExternalModal],
    data() {
      return {
        form: {
          username: '',
          password: '',
          comfirmPassword: '',
          name: '',
          phone: '',
        },
        rules: {
          username: [{required: true, message: '请填写登录账号'}],
          password: [{required: true, message: '请填写登录密码'}],
          comfirmPassword: [{required: true, message: '请再次填写登录密码'}, {
            validator: (rule, value, callback) => {
              if (value === this.form.password) {
                callback();
              } else {
                callback(new Error('两次输入密码不一致'))
              }
            },
            trigger: 'blur'
          }],
          name: [{required: true, message: '请填写用户名称'}],
          phone: [{required: true, message: '请填写用户手机号码'}],
        }
      }
    },
    methods: {
      handleCancel() {
        this.$emit('input', false)
        this.$refs['form'].resetFields();
      },
      handleVisibleChange(state) {
        if (state && this.mode === 'edit') {
          const {form, data} = this;
          form.roleName = data.$;
        }
      },
      handleSubmit(resolve, reject) {
        // setTimeout(resolve, 1000)
        const params = {
          ...this.form,
          usid: this.data.usid || ''
        }
        this.$ajax({
            url: '/web/user/Save',
            data: params,
            success: ({data}) => {
                this.$Message.success('添加成功')
                this.handleCancel()
                this.$emit('submit')
            },
            error: (res) => {
                this.$Message.error(res.msg)
            }
        })
      },
    }
  }
</script>

<style scoped>

</style>
