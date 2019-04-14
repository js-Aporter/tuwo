<template>
  <Card>
    <Form class="table-search-form">
      <FormItem label="查询">
        <Input v-model="searchForm.query" placeholder="标题"/>
      </FormItem>
      <FormItem>
        <Button type="primary" icon="search" @click="handleSearch">搜索</Button>
        <Button type="ghost" icon="close" @click="handleReset">取消</Button>
      </FormItem>
    </Form>

    <NavTabs v-model="searchForm.type" :list="navTabs" @change="changeTabs"></NavTabs>
    <ActiveTable ref="table" :options="options"></ActiveTable>
    <Reply v-model="replyModal" :data="editdata"></Reply>
  </Card>
</template>

<script>
  import Reply from './Reply'

  let columns = {}
  export default {
    components: {Reply},
    data() {
      const commonColumn = [
        {title: '标题', key: 'title', minWidth: 180},
        {title: '咨询内容', key: 'content', minWidth: 350},
        {title: '相关文件', minWidth: 200, 
          render: (h, {row}) => {
            return h('PreviewGroup', {
              props: {
                urls: row.pics || []
              }
            })
          }
        }
      ];
      const createdon = {title: '创建时间', key: 'time', minWidth: 150};
      const actions = {
        title: '操作', minWidth: 100, render: (h, {row}) => {
          return h('div', {'class': 'table-btn-group'}, [
            h('Button', {
              props: {type: 'primary'},
              on: {
                click: () => {
                  this.editdata = row;
                  this.replyModal = true;
                }
              }
            }, '回复')
          ])
        }
      }
      const reply = [
        {title: '回复内容', key: 'reply', minWidth: 350},
        {title: '回复时间', key: 'replytime', minWidth: 150}
      ]
      columns.columns1 = [
        ...commonColumn,
        createdon,
        actions
      ]
      columns.columns2 = [
        ...commonColumn,
        ...reply,
        createdon
      ]
      return {
        navTabs: [{label: '待回复', name: 0}, {label: '已回复', name: 1}],
        replyModal: false,
        editdata: {},
        searchForm: {
          query: '',
          type: 0
        },
        options: {
          url: '/client/ask/List',
          columns: columns.columns1,
          params: () => ({
            is_reply: this.searchForm.type,
            query: this.searchForm.query
          })
        }
      }
    },
    methods: {
      handleSearch() {
        this.$refs.table.request();
      },
      handleReset() {
        this.$refs.table.reset(this.searchForm);
      },
      // 切换tab
      changeTabs(tabData){
        if(tabData.name == 0){
          this.options.columns = columns.columns1;
        } else {
          this.options.columns = columns.columns2;
        }
        this.handleSearch();
      },
    },
    mounted() {
      this.handleSearch();
    }
  }
</script>

<style scoped>

</style>
