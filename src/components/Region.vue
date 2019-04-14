<template>
  <Cascader :value="value" :data="data" :change-on-select="changeOnSelect" :load-data="handleLoadData" @on-change="handleChange"></Cascader>
</template>

<script>
  import areadata from '@/../static/area-data'

  function filter(list, level, withChildren) {
    return list.map(({value, label, children = []}) => {
      const obj = {value, label, level};
      obj.__children = children;
      if (withChildren && children.length) {
        obj.children = [];
        obj.loading = false;
      }
      return obj;
    })
  }

  export default {
    props: {
      value: Array,
      changeOnSelect: Boolean,
      level: {
        type: [String, Number],
        default: 3
      },
    },
    data() {
      return {
        data: []
      }
    },
    methods: {
      handleLoadData(item, callback) {
        const level = item.level + 1;
        item.children = filter(item.__children, level, level < this.level);
        callback();
      },
      handleChange(value, selectedData) {
        this.$emit('change', value, selectedData);
        this.$emit('input', value);
      }
    },
    mounted() {
      this.data = filter(areadata, 1, this.level > 1);
    }
  }
</script>

<style scoped>

</style>
