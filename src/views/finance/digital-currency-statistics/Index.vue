<template>
  <Card>
    <NavTabs v-model="type" :list="navTabs" @change="changeTabs"></NavTabs>

    <Form class="table-search-form">
      <FormItem label="数字货币金额合计：">
        -1600 USD
      </FormItem>

      <FormItem label="数字货币数量合计：">
        -0.5
      </FormItem>

      <FormItem>
        <Select v-if="type == 0" v-model="searchForm.type">
          <Option value="">资产进出(全部)</Option>
          <Option :value="0">资产入金</Option>
          <Option :value="1">资产领取</Option>
        </Select>
      </FormItem>
      <FormItem>
        <DatePicker :editable="false" type="daterange" v-model="searchForm.dateRange" placeholder="请选择时间段"></DatePicker>
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
    data() {
      return {
        type: '',
        navTabs: [
          {label: '比特币BTC', name: 0}, 
          {label: '以太坊ETH', name: 1}, 
          {label: '莱特币LTC', name: 2},
          {label: '比特现金BCH', name: 3},
          {label: '瑞波币RIPPLE', name: 4},
          {label: '以太经典ETC', name: 5}
        ],
        searchForm: {
          keyword: '',
          dateRange: [],
          type: ''
        },
        options: {
          url: '/table',
          columns: [
            {title: '会员账号', key: '$', minWidth: 120},
            {title: '资产进出', key: '$', minWidth: 120},
            {title: '市场价格', key: '$', minWidth: 120},
            {title: '数字货币金额', key: '$', minWidth: 120},
            {title: '数字货币数量', key: '$', minWidth: 150},
            {title: '钱包地址', key: '$', minWidth: 120},
            {title: '操作时间', key: '$', minWidth: 120}
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
      // 切换tab
      changeTabs(tabData){
        if(tabData.name == 0){
          this.options.columns[1].title = "资产进出";
        } else {
          this.options.columns[1].title = "操作类型";
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
