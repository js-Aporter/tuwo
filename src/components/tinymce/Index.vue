<template>
  <textarea  :id="elementId"></textarea>
</template>

<script>
  import '@/../static/tinymce/tinymce.min.js'

  export default {
    data() {
      return {
        elementId: 'editor' + Date.now(),
        Editor: null,
        DefaultConfig: {

          // CONFIG: ContentStyle 这块很重要， 在最后呈现的页面也要写入这个基本样式保证前后一致， `table`和`img`的问题基本就靠这个来填坑了
          content_css: '/static/tinymce/content.css',

          insert_button_items: 'image link | inserttable',

          // CONFIG: Paste
          paste_retain_style_properties: 'all',
          paste_word_valid_elements: '*[*]',        // word需要它
          paste_data_images: true,                  // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
          paste_convert_word_fake_lists: false,     // 插入word文档需要该属性
          paste_webkit_styles: 'all',
          paste_merge_formats: true,
          nonbreaking_force_tab: false,
          paste_auto_cleanup_on_paste: false,

          // CONFIG: StyleSelect
          style_formats: [
            {
              title: '首行缩进',
              block: 'p',
              styles: {'text-indent': '2em'}
            },
            {
              title: '行高',
              items: [
                {title: '1', styles: {'line-height': '1'}, inline: 'span'},
                {title: '1.5', styles: {'line-height': '1.5'}, inline: 'span'},
                {title: '2', styles: {'line-height': '2'}, inline: 'span'},
                {title: '2.5', styles: {'line-height': '2.5'}, inline: 'span'},
                {title: '3', styles: {'line-height': '3'}, inline: 'span'}
              ]
            }
          ],

          // Image
          imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions'
        }
      }
    },

    props: {
      value: {
        default: '',
        type: String
      },
      config: {
        type: Object,
        default: () => {
          return {
            theme: 'modern',
            height: 400
          }
        }
      },

      // 图片上传接口
      url: {
        default: '/home/UploadFile',
        type: String
      },

      accept: {
        default: 'image/jpeg, image/png,image/jpg, image/gif',
        type: String
      },

      maxSize: {
        default: 2097152, // 图片上传容量最大限制
        type: Number
      },

      withCredentials: {
        default: false,
        type: Boolean
      }
    },

    mounted() {
      this.init()
    },

    // 销毁tinymce
    beforeDestroy() {
      this.$emit('on-destroy');
      window.tinymce.remove(`${this.elementId}`)
    },

    methods: {
      setContent(val) {
        window.tinymce.get(`${this.elementId}`).setContent(val);
      },

      init() {

        this.$nextTick(() => {
          const self = this;

          // 解决tinymce.min.js路径问题
          window.tinymce.baseURL = '/static/tinymce';
          window.tinymce.suffix = '.min';

          this.Editor = window.tinymce.init({

            // 默认配置
            ...this.DefaultConfig,

            // prop内传入的的config
            ...this.config,

            selector: '#' + this.elementId,
            mode: "textareas",
            branding: false,
            elementpath: false,
            language: 'zh_CN',
            menubar: 'edit insert view format table tools',
            plugins: [
              'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
              'searchreplace visualblocks visualchars code',
              'insertdatetime media nonbreaking save table contextmenu directionality',
              'emoticons paste textcolor colorpicker textpattern imagetools codesample'
            ],
            toolbar: 'newnote print preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
            autosave_interval: '20s',
            image_advtab: true,
            table_default_styles: {
              width: '100%',
              borderCollapse: 'collapse'
            },

            // 初始化完成后再开始设置内容
            init_instance_callback: (editor) => {
              this.$emit('initEnd')
            },

            setup: function (editor) {

              // 抛出 'on-ready' 事件钩子
              editor.on('init', () => {
                self.loading = false;
                self.$emit('on-ready');
                editor.setContent(self.value);
              });

              // 抛出 'input' 事件钩子，同步value数据
              editor.on('input change undo redo', () => {
                self.$emit('input', editor.getContent())
              });
            },

            // 图片上传
            images_upload_handler: function (blobInfo, success, failure) {

              if (blobInfo.blob().size > self.maxSize) {
                failure('图片过大,建议2M以下')
              }

              if (self.accept.indexOf(blobInfo.blob().type) >= 0) {
                uploadPic()
              } else {
                failure('图片格式错误')
              }

              function uploadPic() {
                const xhr = new XMLHttpRequest();
                const formData = new FormData();
                xhr.withCredentials = self.withCredentials;
                xhr.open('POST', self.url);
                xhr.onload = function () {

                  if (xhr.status !== 200) {

                    // 抛出 'on-upload-fail' 钩子
                    self.$emit('on-upload-fail');
                    failure('上传失败: ' + xhr.status);
                    return
                  }
                  const json = JSON.parse(xhr.responseText);

                  if (!json.data || false) {
                    self.$Message.error('无图片连接，请重新上传');
                    return;
                  }

                  // 抛出 'on-upload-success' 钩子
                  // 添加图片到区域中
                  self.$emit('on-upload-complete', [
                    json, success(json.data.url), failure
                  ])
                };
                formData.append('type', 4);
                formData.append('file', blobInfo.blob());
                xhr.send(formData)
              }
            }
          });
        });
      }
    }
  }
</script>
