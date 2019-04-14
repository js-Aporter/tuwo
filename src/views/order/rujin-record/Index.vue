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
        {title: '订单编号', key: 'order_no', minWidth: 120},
        {title: '会员账号', key: 'username', minWidth: 120},
        {title: '投资方式', key: '$', minWidth: 120, 
          render: (h, {row}) => {
            return h('span', ['充值入金', '购买邀请码', '原点复投'][row.ordertype])
          }
        },
        {title: '数字货币', key: 'coin_name', minWidth: 120},
        {title: '充值金额', key: 'payamount', minWidth: 120},
        {title: '充值数量', key: 'coin_count', minWidth: 120},
        {title: 'PV值', key: 'p_rate', minWidth: 120},
        {title: '入金值占比', key: 'jj_rate', minWidth: 120},
        {title: '矿工费', key: '$', minWidth: 120,
          render: (h, {row}) => {
            return h('div', [
              h('p', `比例：${row.g_rate}%`),
              h('p', `金额：${row.g_fee} USD`)
            ])
          }
        },
        {title: '实际入金值', key: 'actual_amount', minWidth: 120},
        {title: '发币钱包地址', key: 'to_coin_address', minWidth: 120},
        {title: '备注', key: 'remark', minWidth: 120},
        {title: '充值凭证', minWidth: 120,
          render: (h, {row}) => {
            return h('PreviewGroup', {
              props: {
                urls: [row.pic]
              }
            })
          }
        },
        {title: '入金时间', key: 'time', minWidth: 120},
      ];
      const send = {title: '发币钱包地址', key: 'to_coin_address', minWidth: 130};
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
      const audit = [
        {title: '审批账号', key: 'auditer', minWidth: 120},
        {title: '审批时间', key: 'audit_time', minWidth: 120}
      ];
      const reason = {title: '未通过原因', key: 'reason', minWidth: 140};
      columns.columns1 = [
        ...commonColumn,
        actions
      ]
      columns.columns2 = [
        ...commonColumn,
        ...audit
      ]
      columns.columns3 = [
        ...commonColumn,
        ...audit,
        reason
      ]
      return {
        typeList: [],
        navTabs: [{label: '待审批', name: 1}, {label: '已通过', name: 2}, {label: '未通过', name: 7}],
        auditModal: false,
        editdata: {},
        status: 1,
        searchForm: {
          keyword: '',
          dateRange: []
        },
        options: {
          url: '/web/order/WebRujinList',
          columns: columns.columns1,
          params: () => ({
            status: this.status,
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
      // 切换tab
      changeTabs(tabData){
        if(tabData.name == 1){
          this.options.columns = columns.columns1;
        } else if(tabData.name == 2){
          this.options.columns = columns.columns2;
        } else if(tabData.name == 7){
          this.options.columns = columns.columns3;
        }
        // this.options.columns = columns[`columns${tabData.name + 1}`];
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
