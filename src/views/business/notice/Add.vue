<template>
  <Modal :value="value" :loading="loading" title="新增" width="800">
    <Form :label-width="60" ref="form" :model="form" :rules="rules" label-position="left">
      <FormItem label="标题" prop="title" required>
        <Input v-model="form.title"></Input>
      </FormItem>
      <FormItem label="图片" prop="pic" required>
        <UploadFile v-model="form.pic"></UploadFile>
      </FormItem>
      <FormItem label="内容" prop="content" required>
        <Editor
              :config="{'height': 300}"
              ref="editor"
              @initEnd="initEndSet"
              v-model="form.content"
          ></Editor>
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
    data() {
      const content = (rule, value, callback) => {
        if (value === '' || value === null) {
          callback(new Error('请输入内容'));
        } else {
          callback();
        }
      };
      const pic = (rule, value, callback) => {
        if (value === '' || value === null || !value.length) {
          callback(new Error('请上传图片'));
        } else {
          callback();
        }
      };
      return {
        form: {
          title: '',
          content: '',
          pic: []
        },
        rules: {
          title: [{required: true, message: '请输入标题'}],
          pic: [{validator: pic, message: '请上传图片', trigger: 'change'}],
          content: [{validator: content, message: '请输入内容'}]
        }
      }
    },
    methods: {
      handleOk() {
      },
      handleCancel() {
        this.$emit('input', false)
        this.$refs['form'].resetFields();
        this.$refs.editor.setContent('');
      },
      handleVisibleChange(state) {
        if(state){
          if(this.data.title){
            this.form.title = this.data.title;
            this.form.content = this.data.content;
            this.$refs.editor.setContent(this.data.content);
            this.form.pic = [{url: this.data.logo}];
          }
        }
      },
      handleSubmit(resolve, reject) {
        const params = {
          nid: this.data.nid || '',
          title: this.form.title,
          logo: this.form.pic[0].url,
          content: this.form.content
        }
        this.$ajax({
            url: '/web/Notice/Save',
            data: params,
            success: ({data}) => {
                this.$Message.success('保存成功')
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
