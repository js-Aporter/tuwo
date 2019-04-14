<template>
  <Modal :value="value" :loading="loading" title="资产确认" width="800">
    <Form :label-width="120" ref="form" :model="form" :rules="rules" label-position="left">
      <FormItem label="确认结果">
        <RadioGroup v-model="form.audit">
            <Radio :label="8">已入金</Radio>
            <Radio :label="9">未入金</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem v-show="form.audit == 9" label="原因" prop="content">
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
          audit: 8,
          price: null,
          content: ''
        },
        rules: {
          content: [{ message: '请输入不通过原因'}],
          price: [{ required: true, message: '请输入打款时货币价格'}],
        }
      }
    },
    methods: {
      handleOk() {
      },
      handleCancel() {
        this.$emit('input', false)
        this.$refs['form'].resetFields();
        this.form.audit = 8;
      },
      handleVisibleChange(state) {
      },
      handleSubmit(resolve, reject) {
        const params = {
          order_no: this.data.order_no,
          status: this.form.audit,
          reason: this.form.content,
          rujin_auditer: this.$store.state.user.user
        }
        this.$ajax({
            url: '/web/order/Rujin',
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
