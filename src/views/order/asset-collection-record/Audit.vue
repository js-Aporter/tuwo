<template>
  <Modal :value="value" :loading="loading" title="回复" width="800">
    <Form :label-width="90" ref="form" :model="form" :rules="rules" label-position="left">
      <FormItem label="审批结果" prop="status">
        <RadioGroup v-model="form.status">
          <Radio :label="1">通过</Radio>
          <Radio :label="2">不通过</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem v-if="form.status == 2" label="不通过原因" prop="reason">
        <Input v-model="form.reason" type="textarea" :rows="4"/>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import ExternalModal from '@/libs/external-modal'
import Editor from '@/components/tinymce/Index'

export default {
  mixins: [ExternalModal],
  components: { Editor },
  props: {
    id: Number
  },
  data() {
    return {
      form: {
        status: 1,
        reason: ''
      },
      rules: {
        reason: [{ message: '请输入不通过原因' }]
      }
    }
  },
  methods: {
    handleOk() {
      const { reason, status } = this.form
      const { remit_no } = this.data
      const data = {
        remit_no,
        status,
        reason,
        auditer: this.$store.state.user.user
      }
      this.$ajax({
        url: '/web/order/AudtiRemit',
        btnLoading: true,
        data,
        success: ({ data }) => {
          this.$Message.success('审批成功')
          this.handleCancel()
          this.$emit('submit')
        },
        error: (res) => {
          this.$Message.error(res.msg)
        }
      })
    },
    handleCancel() {
      this.$emit('input', false)
      this.$refs['form'].resetFields();
    },
    handleVisibleChange(state) {
    },
    handleSubmit(resolve, reject) {
      const params = {
        content: this.form.content
      }
      // this.$ajax({
      //     url: '/web/article/save',
      //     btnLoading: true,
      //     data: params,
      //     success: ({data}) => {
      //         this.$Message.success('添加成功')
      //         this.handleCancel()
      //         this.$emit('submit')
      //     },
      //     error: (res) => {
      //         this.$Message.error(res.msg)
      //     }
      // })
    },

    initEndSet() {
      this.init()
    },
    init() {
      if (this.id) {
        this.getData()
      }
    },
    // 如果有id则查询数据，进行编辑
    getData() {
      // this.$ajax({
      //   url: '/web/article/info',
      //   data: {aid: this.id},
      //   success: ({data}) => {
      //     this.formData.name = data.name;
      //     this.formData.pic = data.pic;
      //     this.formData.content = data.content;
      //   },
      //   fail: (err) =>{
      //     console.log(err);
      //   }
      // })
    },
  }
}
</script>

<style scoped>
</style>
