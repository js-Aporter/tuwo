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

    <NavTabs v-model="type1" :list="navTabs" @change="changeTabs"></NavTabs>
    <ActiveTable ref="table" :options="options"></ActiveTable>
  </Card>
</template>

<script>
  const columns = [];
  export default {
    components: {},
    data() {
      const common = [
        {title: '订单编号', key: 'order_no', minWidth: 120},
        {title: '分红会员账号', key: 'username', minWidth: 120}
      ];
      const level = {title: '会员级别', key: 'from_level', minWidth: 120,
        render: (h, {row}) => {
          return h('span', ['', '初级', '高级']);
        }
      };
      const fhRatio = {title: '分红比例', key: 'rate', minWidth: 120};
      const fh = {title: '分红金额', key: 'trade_amount', minWidth: 120};
      const create = {title: '创建时间', key: 'time', minWidth: 120};
      const account1 = {title: '增资会员账号', key: 'from_uername', minWidth: 120};
      const amount = {title: '新增注册资产值', key: 'bus_amount', minWidth: 120};
      const reason = {title: '奖励原因', key: 'content', minWidth: 120};
      // 推荐奖
      columns.columns1 = [
        ...common,
        {title: '实际入金值', key: 'bus_amount', minWidth: 120},
        level,
        fhRatio,
        fh,
        {title: '被推荐会员账号', key: 'from_uername', minWidth: 120},
        create
      ]
      // 分享奖
      columns.columns2 = [
        ...common,
        account1,
        amount,
        {title: '新增静态资产值', key: 'bus_amount', minWidth: 120},
        level,
        fhRatio,
        fh,
        create
      ]
      // 福利奖
      columns.columns3 = [
        ...common,
        {title: '小区业绩(USD)', key: 'bus_amount', minWidth: 120},
        reason,
        fh,
        create
      ]
      // 分红奖
      columns.columns4 = [
        ...common,
        account1,
        amount,
        {title: '小区业绩状态', key: 'content', minWidth: 120},
        fhRatio,
        fh,
        create
      ]
      // 董事奖
      columns.columns5 = [
        ...common,
        account1,
        {title: '小区业绩(USD)', key: 'bus_amount', minWidth: 120},
        reason,
        fhRatio,
        fh,
        create
      ]
      return {
        typeList: [],
        navTabs: [
          {label: '推荐奖', name: 3}, 
          {label: '分享奖', name: 4}, 
          {label: '福利奖', name: 5},
          {label: '分红奖', name: 6},
          {label: '董事奖', name: 7}
        ],
        type1: 3,
        searchForm: {
          keyword: '',
          type: '',
          dateRange: []
        },
        options: {
          url: '/client/order/DynamicProfitList',
          columns: columns.columns1,
          params: () => ({
            type: this.type1,
            query: this.searchForm.keyword,
            symbol: this.searchForm.type,
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
        this.searchForm.type1 = 3;
      },
      // 切换tab
      changeTabs(tabData){

        this.options.columns = columns[`columns${tabData.name - 2}`];
        this.handleSearch();
      },
      getTypeList(){
        this.$ajax({
            url: '/common/coin/List',
            data: {},
            success: ({data}) => {
                this.typeList = data.list;
            },
            error: (res) => {
                this.$Message.error(res.msg)
            }
        })
      }
    },
    mounted() {
      this.getTypeList();
      this.handleSearch();
    }
  }
</script>

<style scoped>

</style>
