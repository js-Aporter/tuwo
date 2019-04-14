<template>
  <Card>
    <Tree ref="tree" :data="data" show-checkbox @on-check-change="handleCheckChange"></Tree>
    <h3>roles: {{roles}}</h3>
  </Card>
</template>

<script>
  import {appRouter} from '@/router/router.js'

  // 获取权限节点树，
  // checked 选项必须定义
  function getTree(list) {
    return list.map(({name, title, children = [], meta: {roles = []} = {}}) => {
      let obj = {name, title, checked: false};
      children = children.concat(roles);
      if (children.length) {
        obj.children = getTree(children);
        if (roles.length) {
          obj.children.unshift({
            name,
            title: '查看',
            follow: true,
            checked: false
          })
        }
      }
      return obj
    })
  }

  // 跟随选择，‘查看’ 的项目必须要选中
  function followCheck(list) {
    list.forEach(({indeterminate, children}) => {
      if (children) {
        let firstChild = children[0];
        if (indeterminate && firstChild.follow && !firstChild.checked) {
          firstChild.checked = true;
        }
        followCheck(children)
      }
    })
  }

  // 设置 value，默认的选择的项目
  function setValue(list, values) {
    list.forEach(item => {
      let children = item.children;
      if (!children && values.indexOf(item.name) >= 0) {
        item.checked = true;
      }
      if (children) {
        setValue(children, values)
      }
    })
  }

  // 获取 value，得到 names 集合
  function getValue(checkNodes) {
    let values = [];
    checkNodes.forEach(({name, children}) => {
      if (!children) {
        values.push(name)
      }
    });
    return values
  }

  export default {
    data() {
      return {
        roles: [],
        data: getTree(appRouter)
      }
    },

    methods: {
      handleCheckChange(evt) {
        followCheck(this.data);
        this.roles = getValue(this.$refs.tree.getCheckedNodes());
      }
    },

    mounted() {

    }
  }
</script>
