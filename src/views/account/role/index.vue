<template>
  <Card>
    <Form class="table-search-form">
      <FormItem>
        <Button type="success" icon="plus" @click="showAddModel('add')">新增</Button>
      </FormItem>
    </Form>

    <ActiveTable ref="table" :options="options"></ActiveTable>
    <Allocation v-model="showAllocation" :data="addRole.data" @success="handleSearch"></Allocation>
    <AddRole v-model="addRole.show" :data="addRole.data" :mode="addRole.mode" @success="handleSearch"></AddRole>
  </Card>
</template>

<script>
  import Allocation from './Allocation'
  import AddRole from './Add'

  export default {
    components: {Allocation, AddRole},
    data() {
      return {
        showAddRole: false,
        showAllocation: false,
        addRole: {
          show: false,
          mode: 'add',
          data: {}
        },
        searchForm: {
          keyword: ''
        },
        options: {
          url: '/web/user/RoleList',
          columns: [
            {title: '角色名称', key: 'name'},
            {title: '创建时间', key: 'time'},
            {
              title: '操作', width: 260, render: (h, {row}) => {
                return h('div', {'class': 'table-btn-group'}, [
                  h('Button', {
                    props: {type: 'success'},
                    on: {
                      click: () => {
                        this.addRole.data = row;
                        this.showAllocation = true;
                      }
                    }
                  }, '分配权限'),
                  h('Button', {
                    props: {type: 'primary'},
                    on: {
                      click: () => {
                        this.addRole.data = row;
                        this.showAddModel('edit')
                      }
                    }
                  }, '编辑'),
                  h('Button', {
                    props: {type: 'error'},
                    on: {
                      click: () => {
                        this.$Modal.confirm({
                          content: '确定要删除该角色吗？',
                          onOk: () => {
                            this.$ajax({
                                url: '/web/user/DelRole',
                                data: {roleid: row.roleid},
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
      },
      showAddModel(mode) {
        this.addRole.mode = mode;
        this.addRole.show = true;
      }
    },
    mounted() {
      this.handleSearch();
    }
  }
</script>

<style scoped>

</style>
