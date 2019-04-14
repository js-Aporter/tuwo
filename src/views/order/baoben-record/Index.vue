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

    <ActiveTable ref="table" :options="options"></ActiveTable>
  </Card>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        searchForm: {
          keyword: '',
          type: '',
          dateRange: []
        },
        options: {
          url: '/client/order/BaobenZichanList',
          columns: [
            {title: '订单编号', key: 'order_no', minWidth: 120},
            {title: '会员账号', key: 'username', minWidth: 120},
            {title: '入金资产', key: 'payamount', minWidth: 120},
            {title: 'PV值', key: 'p_rate', minWidth: 120},
            {title: '保本资产占比', key: 'bb_rate', minWidth: 120},
            {title: '矿工费', minWidth: 120,
              render: (h, {row}) => {
                return h('div', [
                  h('p', `比例：${row.g_rate}`),
                  h('p', `金额：${row.g_fee} USD`)
                ])
              }
            },
            {title: '实际保本资产', key: 'actual_amount', minWidth: 120},
            // {title: '合约开始时间', key: 'time', minWidth: 120},
            // {title: '合约结束时间', key: 'time', minWidth: 120},
            {title: '资产解冻时间', key: 'frozen_time', minWidth: 120}
          ],
          params: () => ({
            query: this.searchForm.keyword,
            starttime: this.$fn.toDateString(this.searchForm.dateRange[0]),
            endtime: this.$fn.toDateString(this.searchForm.dateRange[1]),
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
      }
    },
    mounted() {
      this.handleSearch();
    }
  }
</script>

<style scoped>

</style>
