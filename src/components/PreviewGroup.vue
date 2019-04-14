<template>
  <div class="preview-group">
    <ul>
      <li
        v-for="(item, index) in datas"
        :key="index"
        :class="['item-' + item.type]"
        :title="item.type === 'unknownType' ? '未知的文件类型' : '点击预览'"
        @click="$preview(item)"
      >

        <img v-if="item.type === 'image'" v-auto-size :src="item.url" alt="加载失败!">

        <Icon v-if="item.type === 'audio'" type="music-note"></Icon>

        <Icon v-if="item.type === 'video'" type="ios-videocam"></Icon>

        <Icon v-if="item.type === 'unknownType'" type="help"></Icon>
      </li>
    </ul>
  </div>
</template>

<script>

  export default {
    props: {
      urls: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        hoverIndex: -1
      }
    },
    directives: {
      autoSize: {
        bind(element) {
          element.addEventListener('load', function () {
            const {style, naturalWidth, naturalHeight, parentNode: {clientWidth, clientHeight}} = this;
            if (clientWidth / clientHeight < naturalWidth / naturalHeight) {
              style.maxHeight = '100%';
            } else {
              style.maxWidth = '100%';
            }
            // style.display = 'inline-block';
          })
        }
      }
    },
    computed: {
      datas() {
        return this.urls.map(url => {
          return {
            url,
            type: this.$fn.getFileType(url)
          }
        })
      }
    }
  }
</script>

<style lang="less">
  @primary-color: #2d8cf0;
  @size: 60px;

  .preview-group {
    ul {
      display: flex;
      flex-wrap: wrap;
      list-style: none;
    }

    li {
      width: @size;
      height: @size;
      margin: 2px;
      position: relative;
      font-size: 30px;
      line-height: @size;
      overflow: hidden;
      cursor: pointer;

      &:hover {
        outline: 1px dashed @primary-color;
        color: @primary-color;
      }
    }

    img {
      /*display: none;*/
      line-height: 1.5;
      font-size: 12px;
    }
  }
</style>
