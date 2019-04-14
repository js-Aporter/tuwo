<template>
  <Modal :value="value" :loading="loading" title="编辑">
    <Form :model="form" :rules="rules" ref="form" :label-width="100">
      <FormItem label="登录账号">
        <p>{{data.username}}</p>
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
          phone: '', name: ''
        },
        rules: {
          phone: [{required: true, message: '请填写用户手机号码', trigger: 'blur'}],
          name: [{required: true, message: '请填写用户名称', trigger: 'blur'}]
        }
      }
    },
    methods: {
      handleCancel() {
        this.$emit('input', false)
        this.$refs['form'].resetFields();
      },
      handleVisibleChange(state) {
        if (state) {
          const {form, data} = this;
          form.name = data.name;
          form.phone = data.phone;
        }
      },
      handleSubmit(resolve, reject) {
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
