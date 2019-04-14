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
      <FormItem>
        <Button type="success" icon="plus" @click="editdata = {};showAddModal = true;">新增</Button>
      </FormItem>
    </Form>

    <ActiveTable ref="table" :options="options"></ActiveTable>
    <Add v-model="showAddModal" :data="editdata" @submit="handleSearch"></Add>
  </Card>
</template>

<script>
  import Add from './Add'

  export default {
    components: {Add},
    data() {
      return {
        showAddModal: false,
        editdata: {},
        addMode: 'add',
        searchForm: {
          query: '',
          dateRange: []
        },
        options: {
          url: '/client/Notice/list',
          columns: [
            {title: '标题', key: 'title', minWidth: 150},
            // {title: '内容', key: 'content', minWidth: 300,
            //   render: (h, {row}) => {
            //     return h('div', 
            //       {
            //         props: {
            //           'v-html': row.content
            //         }
            //       }
            //     )
            //   }
            // },
            {title: '创建时间', key: 'time', minWidth: 150},
            {
              title: '操作', minWidth: 250, render: (h, {row}) => {
                return h('div', {'class': 'table-btn-group'}, [
                  h('Button', {
                    props: {type: 'primary'},
                    on: {
                      click: () => {
                        this.editdata = row;
                        this.showAddModal = true;
                      }
                    }
                  }, '编辑'),
                  h('Button', {
                    props: {
                      type: 'error'
                    },
                    on: {
                      click: () => {
                        this.$Modal.confirm({
                          content: '确定要删除该公告？',
                          onOk: () => {
                            this.$ajax({
                                url: '/web/Notice/del',
                                data: {nid: row.nid},
                                success: ({data}) => {
                                    this.$Message.success('删除成功');
                                    this.handleSearch();
                                },
                                error: (res) => {
                                    this.$Message.error(res.msg)
                                }
                            })
                          }
                        })
                      }
                    }
                  }, '删除'),
                ])
              }
            }
          ],
          params: () => ({...this.searchForm})
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
    },
    mounted() {
      this.handleSearch();
    }
  }
</script>

<style scoped>

</style>
