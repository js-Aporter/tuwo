<template>
  <Card>
    <ActiveTable ref="table" :options="options"></ActiveTable>
    <Modal v-model="modal" :type="type"></Modal>
  </Card>
</template>

<script>
  import Modal from './modal'
  const title = ['会员等级', '静态投资', '动态投资', '总控盘', '提现机制', '资产电子地址管理']
  export default {
    components: {Modal},
    data() {
      return {
        modal: false,
        type: null,
        searchForm: {
          keyword: '',
          dateRange: []
        },
        options: {
          url: '/web/config/list',
          columns: [
            {title: '标题', key: 'name', minWidth: 500,
              render: (h, {row}) => {
                return h('span', title[row.type]);
              }
            },
            {title: '更新时间', key: 'createdon', minWidth: 150},
            {
              title: '操作', minWidth: 150, render: (h, {row}) => {
                return h('div', {'class': 'table-btn-group'}, [
                  h('Button', {
                    props: {type: 'primary'},
                    on: {
                      click: () => {
                        this.type = row.type;
                        this.modal = true;
                      }
                    }
                  }, '设置')
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
      showAdd(mode) {
        this.addMode = mode;
        this.showAddModal = true;
      }
    },
    mounted() {
      this.handleSearch();
    }
  }
</script>

<style scoped>

</style>
