<template>
  <Modal :value="value" :loading="loading" title="打款" width="800">
    <Form :label-width="120" ref="form" :model="form" :rules="rules" label-position="left">
      <FormItem label="打款结果">
        <RadioGroup v-model="form.audit">
            <Radio :label="1">打款成功</Radio>
            <Radio :label="0">打款失败</Radio>
        </RadioGroup>
      </FormItem>
      <div v-show="form.audit == 1">
        <FormItem label="最终提取金">
          3600 USD
        </FormItem>
        <FormItem label="钱包地址">
          钱包地址
        </FormItem>
        <FormItem label="打款时的货币价格" prop="price">
          <InputNumber :min="0" v-model="form.price" style="width: 130px;" /> USD
        </FormItem>
        <FormItem label="实际打款币数">
          3600
        </FormItem>
      </div>

      <FormItem  v-show="form.audit == 0" label="打款失败原因" prop="content">
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
          audit: 1,
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
