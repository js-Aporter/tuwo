<template>
  <Modal v-model="visible" class="preview-modal" @on-visible-change="handleVisibleChange" class-name="preview-modal-wrap">

    <img
      v-if="type === 'image'"
      v-auto-size
      :src="url"
      :style="imageStyle"
      ref="image"
      class="image-picker"
      alt="加载失败!"
      draggable="false"
      @mousedown="handleDragStart"
    >

    <div v-else class="media-wrapper">
      <video v-if="type === 'video'" :src="url" controls ref="video"></video>
      <audio v-if="type === 'audio'" :src="url" controls ref="audio"></audio>
    </div>

    <div slot="footer" v-show="type === 'image'">
      <Tooltip content="还原" placement="top">
        <Button @click="handleReset">
          <Icon type="ios-arrow-thin-left"></Icon>
        </Button>
      </Tooltip>

      <Tooltip content="放大" placement="top">
        <Button @click="image.scale *= 1.2">
          <Icon type="ios-plus-empty"></Icon>
        </Button>
      </Tooltip>

      <Tooltip content="缩小" placement="top">
        <Button @click="image.scale /= 1.2">
          <Icon type="ios-minus-empty"></Icon>
        </Button>
      </Tooltip>

      <Tooltip content="旋转" placement="top">
        <Button @click="image.angle += 90">
          <Icon type="ios-refresh-empty"></Icon>
        </Button>
      </Tooltip>
    </div>
  </Modal>
</template>

<script>

  export default {
    data() {
      return {
        visible: false,
        image: {
          x: 0,
          y: 0,
          angle: 0,
          scale: 1,
          dragging: false,
          startPosition: {
            x: 0,
            y: 0
          }
        }
      }
    },
    watch: {
      'preview.show'(value) {
        if (value) {
          this.visible = value;
        }
      }
    },
    computed: {
      preview() {
        return this.$store.state.system.preview;
      },
      type() {
        return this.preview.type;
      },
      url() {
        return this.preview.url;
      },
      imageStyle() {
        let image = this.image;
        return {
          transform: `translate(${image.x}px, ${image.y}px) scale(${image.scale}) rotate(${image.angle}deg)`
        }
      }
    },
    directives: {
      autoSize: {
        bind(element) {
          element.addEventListener('load', function () {
            const {style, naturalWidth, naturalHeight, parentNode: {clientWidth, clientHeight}} = this;
            if (clientWidth / clientHeight < naturalWidth / naturalHeight) {
              style.maxWidth = '100%';
            } else {
              style.maxHeight = '100%';
            }
            // style.display = 'inline-block';
          })
        }
      }
    },
    methods: {
      handleDragStart(evt) {
        const image = this.image;
        image.dragging = true;
        image.startPosition = {
          x: evt.clientX - image.x,
          y: evt.clientY - image.y
        };
      },
      handleReset() {
        const image = this.image;

        // 千万不要直接重置 image 的指向，因为在 mounted 拖拽事件中引用了它
        image.x = 0;
        image.y = 0;
        image.angle = 0;
        image.scale = 1;
        image.startPosition = {
          x: 0,
          y: 0
        };
      },
      handleVisibleChange(state) {
        if (!state) {
          const type = this.type;
          if (type === 'video' || type === 'audio') {
            this.$refs[type].pause();
          }
          if (type === 'image') {
            setTimeout(() => {
              this.handleReset();
            }, 300);
          }
          this.$store.commit('preview', {show: false});
        }
      }
    },
    mounted() {

      // 图片拖拽
      const image = this.image;
      document.addEventListener("mousemove", function (evt) {
        const startPosition = image.startPosition;
        if (image.dragging) {
          image.x = evt.clientX - startPosition.x;
          image.y = evt.clientY - startPosition.y;
        }
      }, false);

      document.addEventListener("mouseup", function () {
        if (image.dragging) {
          image.dragging = false;
        }
      }, false);
    }
  }
</script>

<style lang="less">

  @functionBtnSize: 40px;
  @closeBtnSize: 50px;
  @paddingWidth: 18px;

  .preview-modal {
    z-index: 2000;

    .ivu-modal {
      width: 100% !important;
      margin: 0 !important;
      height: 100%;
      top: 0;
      user-select: none;
    }

    .ivu-modal-content {
      border-radius: 0;
      height: 100%;
      overflow: hidden;
      background-color: transparent;
    }

    .ivu-modal-body {
      padding: @paddingWidth @paddingWidth 64px @paddingWidth;
      line-height: 0;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ivu-modal-footer {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 100%;
      border-top: none;
      text-align: center;

      .ivu-tooltip + .ivu-tooltip {
        margin-left: 10px;
      }

      .ivu-btn {
        width: @functionBtnSize;
        height: @functionBtnSize;
        border-radius: 100%;
        padding: 0;
        font-size: @functionBtnSize - 10;
        line-height: @functionBtnSize;
      }
    }

    .ivu-modal-close {
      right: @paddingWidth;
      top: @paddingWidth;
      z-index: 1;

      i {
        font-size: 80px;
        height: @closeBtnSize;
        width: @closeBtnSize;
        line-height: @closeBtnSize;
        text-align: center;
        color: #fff;
      }
    }

    .image-picker {
      /*display: none;*/
      cursor: move;
      line-height: 1.5;
      color: #fff;
    }

    .media-wrapper {
      width: 100%;
      max-width: 800px;

      video, audio {
        width: 100%;
      }
    }
  }
  .preview-modal .ivu-modal-mask, .preview-modal-wrap {
    z-index: 1001;
  }
</style>
