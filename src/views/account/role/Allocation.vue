<template>
  <Modal :value="value" :loading="loading" title="分配权限">
    <Form ref="form">
      <Tree ref="tree" :data="treedata" show-checkbox @on-check-change="handleCheckChange"></Tree>
    </Form>
  </Modal>
</template>

<script>
  import ExternalModal from '@/libs/external-modal'
  import {appRouter} from '@/router/router'

  // 获取权限节点树，
  // checked 选项必须定义
  function getTree(list) {
    return list.map(({name, title, children = [], meta: {roles = []} = {}}) => {
      let obj = {name, title, checked: false};
      children = children.concat(roles);
      if (children.length) {
        obj.children = getTree(children);
      }
      return obj
    })
  }


  // 跟随选择，‘查看’ 的项目必须要选中
  // function followCheck(list) {
  //   list.forEach(({indeterminate, children}) => {
  //     if (children) {
  //       let firstChild = children[0];
  //       if (indeterminate && firstChild.follow && !firstChild.checked) {
  //         firstChild.checked = true;
  //       }
  //       followCheck(children)
  //     }
  //   })
  // }


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
    mixins: [ExternalModal],
    data() {
      return {
        accessData: [],
        treedata: getTree(appRouter)
      }
    },
    methods: {
      handleCheckChange(evt) {
        // followCheck(this.treedata);
        const treeList = getValue(this.$refs.tree.getCheckedNodes());
        this.accessData = treeList.map(item => ({name: item}))
      },
      handleOk() {
      },
      handleCancel() {
        this.treedata = getTree(appRouter);
        this.accessData = [];
      },
      handleVisibleChange(state) {
        if(state && this.data.rights){
          const list = JSON.parse(this.data.rights);
          let acList = list.map(item => item.name);
          setValue(this.treedata, acList);
          this.accessData = list;
        }
      },
      handleSubmit(resolve, reject) {
        const params = {
            roleid: this.data.roleid,
            rights: this.accessData
        };
        this.$ajax({
            url: '/web/user/SetRights',
            data: params,
            success: () => {
                this.$Message.success('操作成功');
                this.accessData = [];
                this.handleCancel();
                resolve()
            },
            error: () => {
              reject()
            }
        })
      },
    }
  }
</script>

<style scoped>

</style>
