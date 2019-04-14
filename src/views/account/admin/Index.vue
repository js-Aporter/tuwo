<template>
  <Card>
    <Form class="table-search-form">
      <FormItem label="查询">
        <Input v-model="searchForm.query" placeholder="登录账号/姓名/手机号码"/>
      </FormItem>
      <FormItem>
        <Button type="primary" icon="search" @click="handleSearch">搜索</Button>
        <Button type="ghost" icon="close" @click="handleReset">取消</Button>
      </FormItem>
      <FormItem>
        <Button type="success" icon="plus" @click="showAdd = true">新增</Button>
      </FormItem>
    </Form>

    <ActiveTable ref="table" :options="options"></ActiveTable>
    <AddAccount v-model="showAdd" :data="editAccount.data" @submit="handleSearch"></AddAccount>
    <EditAccount v-model="editAccount.show" :data="editAccount.data" @submit="handleSearch"></EditAccount>
    <SetRole v-model="setRole.show" :data="setRole.data"></SetRole>
  </Card>
</template>

<script>
  import AddAccount from './Add'
  import EditAccount from './Edit'
  import SetRole from './SetRole'

  export default {
    components: {AddAccount, EditAccount, SetRole},
    data() {
      return {
        showAdd: false,
        setRole: {
          show: false,
          data: {}
        },
        editAccount: {
          show: false,
          data: {}
        },
        searchForm: {
          query: ''
        },
        options: {
          url: '/web/user/List',
          columns: [
            {title: '登录账号', key: 'username'},
            {title: '姓名', key: 'name'},
            {title: '手机号码', key: 'phone'},
            {title: '创建时间', key: 'time'},
            {
              title: '操作', render: (h, {row}) => {
                return h('div', {'class': 'table-btn-group'}, [
                  h('Button', {
                    props: {type: 'success'},
                    on: {
                      click: () => {
                        this.setRole.data = row;
                        this.setRole.show = true;
                      }
                    }
                  }, '设置角色'),
                  h('Button', {
                    props: {type: 'primary'},
                    on: {
                      click: () => {
                        this.editAccount.data = row;
                        this.editAccount.show = true;
                      }
                    }
                  }, '编辑'),
                  h('Button', {
                    props: {type: 'error'},
                    on: {
                      click: () => {
                        this.$Modal.confirm({
                          content: '确定要删除该用户吗？',
                          onOk: () => {
                            this.$ajax({
                                url: '/web/user/DelUser',
                                data: {usid: row.usid},
                                success: ({data}) => {
                                    this.$Message.success('删除成功');
                                    this.handleSearch();
                                }
                            })
                          }
                        })
                      }
                    }
                  }, '删除')
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
      }
    },
    mounted() {
      this.handleSearch();
    }
  }
</script>

<style scoped>

</style>
