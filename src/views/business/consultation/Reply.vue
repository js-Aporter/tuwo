<template>
  <Modal :value="value" :loading="loading" title="回复" width="800">
    <Form :label-width="80" ref="form" :model="form" :rules="rules" label-position="left">
      <FormItem label="标题">
        {{detail.title}}
      </FormItem>
      <FormItem label="咨询内容">
        {{detail.content}}
      </FormItem>
      <FormItem label="相关文件">
        <PreviewGroup :urls="detail.pics || []" />
      </FormItem>
      <FormItem label="回复内容" prop="content" required>
        <Input v-model="form.content" type="textarea" :rows="4" placeholder="请输入回复内容" />
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
        detail: {},
        form: {
          content: ''
        },
        rules: {
          content: [{required: true, message: '请输入内容'}]
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
        if(state){
          this.detail = this.data;
          // this.detail.pics = this.detail.pics.map(item => {url})
        }
      },
      handleSubmit(resolve, reject) {
        const params = {
          aid: this.data.aid,
          content: this.form.content
        }
        this.$ajax({
            url: '/web/ask/reply',
            data: params,
            success: ({data}) => {
                this.$Message.success('回复成功')
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
