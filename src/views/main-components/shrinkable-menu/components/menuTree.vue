<template>
  <div>
    <template v-for="(item, index) in list">
      <template v-if="item.children && item.children.length > 0">
        <Submenu :name="item.name">
          <template slot="title">{{item.title}}</template>
          <menuTree :list="item.children" :icon-size="iconSize"></menuTree>
        </Submenu>
      </template>
      <MenuItem v-else :name="item.name">
        {{item.title}}
      </MenuItem>
    </template>
  </div>
</template>

<script>
  export default {
    name: "menuTree",
    props: {
      list: Array,
      iconSize: Number
    }
  }
</script>
