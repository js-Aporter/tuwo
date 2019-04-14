<template>
  <div class="tabs-wrapper">
    <ul>
      <li
        v-for="(item,index) in list"
        :key="index"
        :class="{active: index === activeIndex}"
        @click="handleClick(index, item)"
      >
        <span>{{item.label}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      value: [String, Number],
      list: {
        type: Array,
        required: true
      }
    },
    data() {
      const {list, value} = this;
      const activeIndex = list.findIndex(item => item.name === value);
      return {
        activeIndex: activeIndex < 0 ? 0 : activeIndex
      }
    },
    methods: {
      handleClick(index, item) {
        if (index !== this.activeIndex) {
          this.activeIndex = index;
          this.$emit('input', item.name);
          this.$emit('change', item, index);
        }
      }
    }
  }
</script>

<style lang="less">

  @color: #2d8cf0;

  .tabs-wrapper {
    ul {
      display: flex;
      border-bottom: 2px solid #eee;
      margin: 10px 0;
      list-style: none;
    }

    li {
      padding: 10px 20px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;

      &:hover {
        color: @color;
      }

      &.active {
        color: @color;
        border-bottom-color: @color;
      }
    }
  }
</style>
