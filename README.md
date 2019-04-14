# 基于 iview-admin-1.3.1 开发的后台管理系统

## 规范 (不强制，这完全只是一个方案)

+ 所有的组件名首字母大写
+ 所有路由的 `name` 属性首字母大写 (`home_index` 特殊，它关联了太多地方，不想改了)
+ 所有有异步请求的模态框，统一外置为组件
+ 所有的页面组件统一以 `Card` 标签包裹


## External Modal (外置模态框)
模态框外置是为了更好的处理业务逻辑，和管理代码
> 示例：
```html
<!-- MyModal.vue -->
<template>

  <!-- value 属性和 loading 属性是 external-modal.js 中定义的 -->
  <Modal :value="value" :loading="loading" title="这是一个标题">

    <!-- Form 组件的 ref 属性的值必须是 'form' -->
    <Form ref="form" :model="form" :rules="rules">
      <FormItem label="姓名" prop="username">
        <Input v-model="form.username"/>
      </FormItem>
      <FormItem label="电话" prop="phone">
        <Input v-model="form.phone"/>
      </FormItem>
    </Form>
  </Modal>
</template>
<script>

  // 必须要引入这个 mixin 文件，并注册到 mixins 中
  import ExternalModal from '@/libs/external-modal.js'

  export default {
    mixins: [ExternalModal],
    data() {
      return {
        form: {
          username: '',
          phone: ''
        },
        rules: {
          username: [{required: true, message: '请输入姓名'}]
          phone: [{required: true, message: '请输入手机号码'}]
        }
      }
    },

    methods: {

      /**
       * 以下事件无需手动绑定，只需在这里定义就行了
       * 所有的事件都不是必选的，只要你定义了才会去监听并触发
       * 名称也是固定的，不能变，记住，不~能~变
       */
      handleOk() {
        // 监听 on-ok 事件
      },
      handleCancel() {
        // 监听 on-cancel 事件
      },
      handleVisibleChange(state) {
        // 监听 on-visible-change 事件
      },
      handleSubmit(resolve, reject) {
        // 监听 on-ok 事件，但是它是异步的，
        // 它会让确认按钮显示loading，并且保证不会重复触发
        // resolve 和 reject 参数同 Promise
        // 如果你使用异步提交，就一定要有 Form，而且必须给它定义属性 ref='form'
      },
    }
  }
</script>
```
> 调用：
```html
<!-- Index.vue -->
<template>
  <Card>
    <!-- 调用的时候一定要使用 v-model，作用是否显示模态框 -->
    <!-- data 是传入组件数据的入口 -->
    <!-- mode 是用于判断当前模态框是编辑还是新增还是别的模式的标记 -->
    <MyModal v-model="showModal" :data="{data1: 1, data2: 2}" mode="edit"></MyModal>
  </Card>
</template>
<script>
  import MyModal from './MyModal.vue'

  export default {
    components: {MyModal},
    data() {
      return {
        showModal: false
      }
    },
  }
</script>

```

## Active Table (活动的表格)
为什么是活动的？因为它整合了请求数据和分页于一身，😎

同时也需要接口配合数据的格式，需要统一
```html
<!-- Index.vue -->
<template>
  <Card>
  
    <!-- 添加类 .table-search-form 会在行内显示表单， -->
    <!-- 跟 inline 基本一样，可是还是需要定义一些别的样式 -->
    <Form class="table-search-form">
      <FormItem label="查询">
        <Input v-model="searchForm.keyword" placeholder="请输入关键字"/>
      </FormItem>
      <FormItem>
        <Button type="primary" icon="search" @click="handleSearch">搜索</Button>
        <Button type="ghost" icon="close" @click="handleReset">取消</Button>
      </FormItem>
    </Form>

     <NavTabs :list="navTabs" @change="handleSearch"></NavTabs>

    <!-- 必须要给它定义一个 ref 属性，用于获取组件，名称不限制 -->
    <!-- 必须要给它设置 options 属性 -->
    <ActiveTable ref="table" :options="options"></ActiveTable>
  </Card>
</template>
<script>
  export default {
    data() {
      return {
        searchForm: {
          keyword: ''
        },
        navTabs: [
          {label: '苹果', name: 'apple'},
          {label: '小米', name: 'mi'},
          {label: '华为', name: 'huawei'}
        ],
        options: {
          
          // 请求数据的地址
          url: '/api/tabledata',
          
          // 表格的头部
          column: [
            {title: '品牌', key: 'name'},
            {title: '价格', key: 'price'},
            {title: '型号', key: 'model'}
          ],
          
          // params 可以是函数，也可以直接是个对象
          params(){
            return {
              id: 1,
              keyword: this.searchForm.keyword
            }
          }
        }
      }
    },
    methods: {
      
      // 开始请求/搜索
      handleSearch(){
        this.$refs.table.request();
      },
      
      // 清空
      handleReset(){
        this.$refs.table.reset(this.searchForm);
      }
    },
    mounted(){
      this.handleSearch();
    }
  }
</script>
```



