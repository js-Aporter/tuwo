<template>
  <div class="upload-file-wrapper">
    <div class="file-upload-list" v-for="(item,index) in fileList">
      <template v-if="item.status === 'finished'">
        <img v-if="item.type == 'image'" :src="item.url">
        <Icon v-else-if="item.type == 'video'" type="social-youtube" class="simple-icon"></Icon>
        <Icon v-else type="ios-help-empty" class="simple-icon"></Icon>
        <div class="file-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="$previewMedia(item)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload
      ref="upload"
      v-show="fileList.length < max"
      :show-upload-list="false"
      :default-file-list="defaultFileList"
      :on-success="handleSuccess"
      :on-error="handleError"
      :format="fileTypes[fileType].format"
      :accept="fileTypes[fileType].accept"
      :max-size="maxSize"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :multiple="multiple"
      :data="data"
      :action="action"
      type="drag"
    >
      <div class="add-btn">
        <Icon type="plus" size="26"></Icon>
      </div>
    </Upload>
  </div>
</template>
<script>

  import Emitter from '@/libs/emitter';

  let testVideo = /\.mp4$/,
    imageFromat = ['jpg', 'jpeg', 'png'],
    imageAccept = 'image/jpg, image/jpeg, image/png',
    videoFromat = ['mp4'],
    videoAccept = 'video/mp4',
    fileTypes = {
      image: {
        format: imageFromat,
        accept: imageAccept
      },
      video: {
        format: videoFromat,
        accept: videoAccept
      },
      both: {
        format: imageFromat.concat(videoFromat),
        accept: imageAccept + ", " + videoAccept
      }
    };

  function getFileType(url) {
    return testVideo.test(url) ? "video" : "image";
  }

  function getItem(item) {
    return {
      url: item.url,
      status: 'finished',
      type: item.type || getFileType(item.url)
    }
  }

  export default {
    mixins: [Emitter],
    props: {
      multiple: Boolean,
      data: Object,

      // 文件类型，图片和视频
      fileType: {
        type: String,
        default: "image"    // video | both
      },

      // 文件最大数量限制
      max: {
        type: [Number, String],
        default: 1
      },

      // 双向绑定的数据对象
      value: {
        type: Array,
        default: []
      },

      // 提交地址
      action: {
        type: String,
        default: "/home/UploadFile"
      },

      // 文件上传的 key 值
      name: {
        type: String,
        default: "file"
      },

      // 最大容量限制
      maxSize: {
        type: [Number, String],
        default: 5120
      }
    },

    data() {
      let defaultFileList = [];
      this.value.some((item, index) => {
        if (index < this.max) {
          defaultFileList.push(getItem(item))
        } else {
          return true;
        }
      });
      return {
        fileTypes,
        defaultFileList,
        fileList: []
      }
    },

    watch: {
      value(value) {
        this.fileList = this.$refs.upload.fileList = value.map(getItem);
      }
    },

    methods: {
      handleRemove(index) {
        this.fileList.splice(index, 1);
        this.updateValue();
      },
      updateValue() {
        let files = this.fileList.map(item => {
          return {
            url: item.url
          }
        });
        this.$emit("input", files);
        this.$emit('change', files);
        this.dispatch('FormItem', 'on-form-change', files);
      },
      handleSuccess(res, file) {
        if (res.code == 0) {
          let url = res.data.url;
          file.url = url;
          file.type = getFileType(url);
          this.updateValue();
        } else {
          this.$Notice.warning({
            title: '系统错误'
          });
        }
      },
      handleError() {
        this.$Notice.warning({
          title: '文件上传失败'
        });
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: '文件格式错误',
          desc: `文件 ${file.name} 错误, 请选择 jpg、png 的图片或者 mp4 视频`
        });
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: '文件超过限制',
          desc: `文件 ${file.name} 太大了, 请选择小于 ${parseFloat(this.maxSize / 1024).toFixed(2)}M 的文件`
        });
      },
      handleBeforeUpload() {
        const check = this.fileList.length < this.max;
        if (!check) {
          this.$Notice.warning({
            title: `最多可上传 ${this.max} 个文件`
          });
        }
        return check;
      },
      resetUploadFile() {
        this.fileList = []
      }
    },
    mounted() {
      this.fileList = this.$refs.upload.fileList;
    }
  }
</script>
<style lang="less">

  @width: 60px;
  @height: @width;

  .upload-file-wrapper {
    line-height: 0;

    & > .ivu-upload {
      display: inline-block;
    }

    .add-btn {
      width: @width - 2;
      height: @height - 2;
      line-height: @height;
    }

    .ivu-icon {
      line-height: inherit;
    }

    .simple-icon {
      font-size: 26px;
    }
  }

  .file-upload-list {
    display: inline-block;
    width: @width;
    height: @height;
    text-align: center;
    line-height: @height;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;

    img {
      width: 100%;
      height: 100%;
    }

    &:hover .file-upload-list-cover {
      display: block;
    }
  }

  .file-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);

    i {
      color: #fff;
      font-size: 26px;
      cursor: pointer;
      margin: 0 2px;
    }
  }

</style>
