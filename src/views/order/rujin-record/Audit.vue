<template>
  <Modal :value="value" :loading="loading" title="回复" width="800">
    <Form :label-width="90" ref="form" :model="form" :rules="rules" label-position="left">
      <FormItem label="审批结果" prop="audit">
        <RadioGroup v-model="form.audit">
          <Radio :label="2">通过</Radio>
          <Radio :label="7">不通过</Radio>
      </RadioGroup>
      </FormItem>
      <FormItem v-if="form.audit == 7" label="不通过原因" prop="content">
        <Input v-model="form.content" type="textarea" :rows="4" />
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
  import ExternalModal from '@/libs/external-modal'
  import Editor from '@/components/tinymce/Index'

  export default {
    mixins: [ExternalModal],
    components: {Editor},
    props: {
      id: Number
    },
    data() {
      return {
        form: {
          audit: 2,
          content: ''
        },
        rules: {
          content: [{message: '请输入不通过原因'}]
        }
      }
    },
    methods: {
      handleOk() {
      },
      handleCancel() {
        this.$emit('input', false)
        this.$refs['form'].resetFields();
      },
      handleVisibleChange(state) {
      },
      handleSubmit(resolve, reject) {
        const params = {
          order_no: this.data.order_no,
          status: this.form.audit,
          reason: this.form.content
        }
        this.$ajax({
            url: '/web/order/AudtiRujin',
            data: params,
            success: ({data}) => {
                this.$Message.success('操作成功')
                this.handleCancel()
                this.$emit('submit')
            },
            error: (res) => {
                this.$Message.error(res.msg)
            }
        })
      },

      initEndSet () {
        this.init()
      },
      init () {
        if  (this.id) {
          this.getData()
        }
      },
      // 如果有id则查询数据，进行编辑
      getData () {
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
