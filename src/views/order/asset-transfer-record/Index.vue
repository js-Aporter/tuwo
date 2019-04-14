<template>
  <Card>
    <Form class="table-search-form">
      <FormItem label="查询">
        <Input v-model="searchForm.keyword" placeholder="转出会员账号"/>
      </FormItem>
      <FormItem>
        <Input v-model="searchForm.keyword1" placeholder="转入会员账号"/>
      </FormItem>
      <FormItem>
        <Select v-model="searchForm.type" placeholder="请选择资产类型">
          <Option value="">全部资产类型</Option>
          <!-- <Option :value="0">入金资产</Option> -->
          <Option :value="1">静态资产</Option>
          <Option :value="2">动态资产</Option>
          <!-- <Option :value="3">保本资产</Option> -->
        </Select>
      </FormItem>
      <!-- <FormItem>
        <Select v-model="searchForm.type1" placeholder="请选择转入资产类型">
          <Option value="">全部转出资产类型</Option>
          <Option :value="0">静态资产</Option>
          <Option :value="1">动态资产</Option>
          <Option :value="2">基金资产</Option>
          <Option :value="3">复投资产</Option>
        </Select>
      </FormItem> -->
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
          keyword1: '',
          type: '',
          type1: '',
          dateRange: []
        },
        options: {
          url: '/client/Member/TransferList',
          columns: [
            {title: '订单编号', key: 'order_no', minWidth: 120},
            {title: '转出会员账号', key: 'from_uername', minWidth: 120},
            {title: '资产类型', key: 'to_username', minWidth: 120,
              render: (h, {row}) => {
                return h('span', ['','静态资产', '动态资产' , '保本资产'][row.obj_type]);
              }
            },
            {title: '转入会员账号', key: 'to_username', minWidth: 120},
            {title: '转出资产金额', key: 'trade_amount', minWidth: 120},
            {title: '手续费比例', key: 'rate', minWidth: 120},
            {title: '手续费', key: 'fee', minWidth: 120},
            {title: '实际到账金额', key: 'real_amount', minWidth: 120},
            {title: '备注', key: 'remark', minWidth: 120},
            {title: '操作时间', key: 'time', minWidth: 120}
          ],
          params: () => ({
            from_uername: this.searchForm.keyword,
            to_username: this.searchForm.keyword1,
            obj_type: this.searchForm.type,
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
