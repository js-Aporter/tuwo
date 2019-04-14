<template>
  <Card>
    <Form class="table-search-form">
      <FormItem label="查询">
        <Input v-model="searchForm.keyword" placeholder="客户名称"/>
      </FormItem>
      <FormItem>
        <Button type="primary" icon="search" @click="handleSearch">搜索</Button>
        <Button type="ghost" icon="close" @click="handleReset">取消</Button>
      </FormItem>
    </Form>

    <NavTabs v-model="status" :list="navTabs" @change="changeTabs"></NavTabs>
    <ActiveTable ref="table" :options="options"></ActiveTable>
    <Audit v-model="auditModal" :data="editdata" @submit="handleSearch"></Audit>
  </Card>
</template>

<script>
  import Audit from './Audit'

  let columns = {}
  export default {
    components: {Audit},
    data() {
      const commonColumn = [
        {title: '会员账号', key: 'username', minWidth: 120},
        {title: '领取资产类型', minWidth: 120,
          render: (h, {row}) => {
            return h('span', ['静态资产', '动态资产', '保本资产'][row.type])
          }
        },
        {title: '数字货币', key: 'coin_name', minWidth: 120},
        {title: '提取金', key: 'applyAmount', minWidth: 120},
        {title: '平台手续费', minWidth: 140,
          render: (h, {row}) => {
            return h('div', [
              h('p', `比例：${row.rate}`),
              h('p', `金额：${row.fee} USD`)
            ])
          }
        },
        {title: '天使基金', key: 'ts_fee', minWidth: 140,
          render: (h, {row}) => {
            return h('div', [
              h('p', `比例：${row.ts_rate}`),
              h('p', `金额：${row.ts_fee} USD`)
            ])
          }
        },
        {title: '最终提取金', key: 'amount', minWidth: 120},
        {title: '货币价格', key: 'real_coin_price', minWidth: 120},
        {title: '获得币数', key: 'coin_count', minWidth: 120},
        {title: '钱包地址', key: 'to_coin_address', minWidth: 150},
        {title: '备注', key: 'remark', minWidth: 150},
        {title: '提取时间', key: 'time', minWidth: 130}
      ];
      const actions = {
        title: '操作', minWidth: 100, render: (h, {row}) => {
          return h('div', {'class': 'table-btn-group'}, [
            h('Button', {
              props: {type: 'primary'},
              on: {
                click: () => {
                  this.editdata = row;
                  this.auditModal = true;
                }
              }
            }, '审批')
          ])
        }
      }
      const msg = {title: '审批信息', minWidth: 140,
        render: (h, {row}) => {
          return h('div', [
            h('p', `账号：admin`),
            h('p', `时间：2017-10-24 20:32`)
          ])
        }
      };
      const reason = {title: '未通过原因', key: 'reason', minWidth: 140};
      columns.columns1 = [
        ...commonColumn,
        actions
      ]
      columns.columns2 = [
        ...commonColumn,
        msg
      ]
      columns.columns3 = [
        ...commonColumn,
        reason,
        msg
      ]
      return {
        navTabs: [{label: '待审批', name: 0}, {label: '已通过', name: 1}, {label: '未通过', name: 2}],
        auditModal: false,
        editdata: {},
        status: 0,
        searchForm: {
          keyword: '',
          dateRange: []
        },
        options: {
          url: '/web/order/RemitList',
          columns: columns.columns1,
          params: () => ({
            query: this.searchForm.keyword,
            status: this.status
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
        this.options.columns = columns[`columns${tabData.name + 1}`];
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
