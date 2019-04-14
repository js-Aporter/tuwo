<template>
  <Modal :value="value" :loading="loading" title="设置角色">
    <Form :model="form" :rules="rules" ref="form" :label-width="100">
      <FormItem label="角色权限" prop="role">
        <Select v-model="form.role">
          <Option v-for="(item, index) in roleList" :key="item.roleid" :value="item.roleid">{{item.name}}</Option>
        </Select>
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
        roleList: [],
        form: {
          role: ''
        },
        rules: {
          role: [{required: true, message: '请选择角色'}]
        }
      }
    },
    methods: {
      handleOk() {
      },
      handleCancel() {
      },
      handleVisibleChange(state) {
        if (state) {
          const {form, data} = this;
          form.role = data.roleid
        }
      },
      handleSubmit(resolve, reject) {
        this.$ajax({
            url: '/web/user/SetRole',
            data: {
              usid: this.data.usid,
              roleid: this.form.role
            },
            success: ({data}) => {
              this.$Message.success('操作成功');
              resolve()
            },
            fail: () => {
              reject()
            }
        })
      },
      getRoleList(){
        this.$ajax({
            url: '/web/user/RoleList',
            data: {pageIndex: 1, pageSize: 99999999},
            success: ({data}) => {
                this.roleList = data.list;
            }
        })
      }
    },
    mounted() {
      this.getRoleList();
    },
  }
</script>

<style scoped>

</style>
