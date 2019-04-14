<template>
  <Modal :value="value" :loading="loading" title="添加">
    <Form :model="form" :rules="rules" ref="form" :label-width="100">
      <FormItem label="角色名称" prop="roleName">
        <Input v-model="form.roleName"></Input>
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
          roleName: ''
        },
        rules: {
          roleName: [{required: true, message: '请填写角色名称'}]
        }
      }
    },
    methods: {
      handleVisibleChange(state) {
        if (state && this.mode === 'edit') {
          const {form, data} = this;
          form.roleName = data.name;
        }
      },
      handleSubmit(resolve, reject) {
        const param = {
            roleid: this.data.roleid,
            name: this.form.roleName
        }
        this.$ajax({
            url: '/web/user/SaveRole',
            data: param,
            success: ({data}) => {
              this.$Message.success('操作成功');
              resolve()
            },
            fail: () => {
              reject()
            }
        })
      },
    }
  }
</script>

<style scoped>

</style>
