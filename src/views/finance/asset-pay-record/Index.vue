<template>
  <Card>
    <Form class="table-search-form">
      <FormItem label="查询">
        <Input v-model="searchForm.keyword" placeholder="会员账号"/>
      </FormItem>
      <FormItem label="时间段">
        <DatePicker :editable="false" type="daterange" v-model="searchForm.dateRange" placeholder="请选择"></DatePicker>
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
        {title: '资产类型', key: 'type', minWidth: 120,
          render: (h, {row}) => {
            return h('span', ['静态资产', '动态资产', '保本资产'][row.type])
          }
        },
        {title: '数字货币', key: 'coin_name', minWidth: 120},
        {title: '最终提取金', key: 'amount', minWidth: 120},
        {title: '钱包地址', key: 'to_coin_address', minWidth: 150},
        {title: '备注', key: 'remark', minWidth: 120},
        {title: '提取时间', key: 'time', minWidth: 120}
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
            }, '打款')
          ])
        }
      }
      const success = [
        {title: '打款时的货币价格', key: 'real_coin_price', minWidth: 120},
        {title: '实际打款币数', key: 'coin_count', minWidth: 120},
        {title: '打款时间', key: 'time', minWidth: 120}
      ]
      const fail = [
        {title: '审批账号', key: '$', minWidth: 120},
        {title: '未通过原因', key: 'reason', minWidth: 120},
        {title: '审批时间', key: '$', minWidth: 120}
      ]

      columns.columns1 = [
        ...commonColumn,
        actions
      ]
      columns.columns2 = [
        ...commonColumn,
        ...success
      ]
      columns.columns3 = [
        ...commonColumn,
        ...fail
      ]
      return {
        navTabs: [{label: '未打款', name: 1}, {label: '打款成功', name: 3}, {label: '打款失败', name: 4}],
        auditModal: false,
        editdata: {},
        status: 1,
        searchForm: {
          keyword: '',
          dateRange: []
        },
        options: {
          url: '/web/order/RemitList',
          columns: columns.columns1,
          params: () => ({
            status: this.status,
            query: this.searchForm.keyword,
            starttime: this.$fn.toDateString(this.searchForm.dateRange[0]),
            endtime: this.$fn.toDateString(this.searchForm.dateRange[1])
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
        if(tabData.name == 1){
          this.options.columns = columns.columns1;
        } else if(tabData.name == 3){
          this.options.columns = columns.columns2;
        } else if(tabData.name == 4){
          this.options.columns = columns.columns3;
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
