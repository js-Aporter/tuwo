<template>
  <Card>
    <Row style="text-align: center;padding: 10px 0 20px;">
      <Col span="6">
        <p><span class="font40">{{data.recharge_balance}}</span>USD</p>
        <p>入金资产值</p>
      </Col>
      <Col span="6">
        <p><span class="font40">{{data.static_balance}}</span>USD</p>
        <p>静态资产值</p>
      </Col>
      <Col span="6">
        <p><span class="font40">{{data.dynamic_balance}}</span>USD</p>
        <p>动态资产值</p>
      </Col>
      <Col span="6">
        <p><span class="font40">{{data.baoben_balance}}</span>USD</p>
        <p>保本资产值</p>
      </Col>
    </Row>
    <ActiveTable ref="table" :options="options" @success="handleSucess"></ActiveTable>
  </Card>
</template>

<script>
  export default {
    data() {
      return {
        data: {},
        options: {
          url: '/web/Statis/Assets',
          columns: [
            {title: '会员账号', key: 'username', minWidth: 120},
            {title: '入金资产值', key: 'recharge_balance', minWidth: 120},
            {title: '静态资产值', key: 'static_balance', minWidth: 120},
            {title: '动态资产值', key: 'dynamic_balance', minWidth: 120},
            {title: '保本资产值', key: 'baoben_balance', minWidth: 120},
            {title: '注册时间', key: 'time', minWidth: 120}
          ],
          params: () => ({})
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
      handleSucess({data}){
        this.data = data;
        console.log(data)
      }
    },
    mounted() {
      this.handleSearch();
    }
  }
</script>

<style scoped>
.font40 {
    font-size: 40px;
  }
</style>
