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
          url: '/web/order/BuyAcCodeList',
          columns: [
            {title: '订单编号', key: 'order_no', minWidth: 120},
            {title: '会员账号', key: 'username', minWidth: 120},
            {title: '邀请码费用', key: 'price', minWidth: 120},
            {title: '购买数量', key: 'count', minWidth: 120},
            {title: '总费用', key: 'payamount', minWidth: 120},
            {title: '备注', key: 'remark', minWidth: 120},
            {title: '购买时间', key: 'time', minWidth: 120}
          ],
          params: () => ({
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
      }
    },
    mounted() {
      this.handleSearch();
    }
  }
</script>

<style scoped>

</style>
