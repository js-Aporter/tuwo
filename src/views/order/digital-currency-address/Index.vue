<template>
  <Card>
    <Form class="table-search-form">
      <FormItem label="查询">
        <Input v-model="searchForm.keyword" placeholder="会员账号"/>
      </FormItem>
      <FormItem>
        <Select v-model="searchForm.type" placeholder="请选择币种">
          <Option value="">全部币种</Option>
          <Option v-for="item in typeList" :key="item.symbol" :value="item.symbol">{{item.name}}</Option>
        </Select>
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
        typeList: [],
        searchForm: {
          keyword: '',
          type: '',
          dateRange: []
        },
        options: {
          url: '/client/coin/MyList',
          columns: [
            {title: '会员账号', key: 'username', minWidth: 120},
            {title: '数字货币', key: 'name', minWidth: 120},
            {title: '数字货币地址', key: 'address', minWidth: 400},
            {title: '添加时间', key: 'time', minWidth: 120}
          ],
          params: () => ({
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
