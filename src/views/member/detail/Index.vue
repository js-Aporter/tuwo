<template lang="html">
  <Card class="">
    <div class="">
      <Row>
        <Col span="3">
          <img class="logo" @click="$previewMedia(userData.headpic)" :src="userData.headpic" alt="">
        </Col>
        <Col span="5">
          <p class="item">用户名：{{userData.username}}</p>
          <p class="item">性别：{{userData.gender ? '女' : '男'}}</p>
          <p class="item">会员级别：{{['注册会员', '初级', '高级'][userData.level]}}</p>
        </Col>

        <Col span="5">
          <p class="item">姓名： {{userData.realname}}</p>
          <p class="item">手机号：{{userData.mobile}}</p>
          <p class="item">推荐人姓名：{{userData.invite_name}}</p>
        </Col>
        <Col span="5">
          <p class="item">注册时间：{{userData.registime}}</p>
          <p class="item">邮箱：{{userData.email}}</p>
        </Col>
      </Row>
    </div>

    <NavTabs :list="navTabs" @change="changeTab"></NavTabs>

    <template v-if="curTab == 0">
      <Row style="text-align: center;padding-top: 30px;">
        <Col span="6">
          <p><span class="font40">{{userData.recharge_balance}}</span>USD</p>
          <p>入金资产值</p>
        </Col>
        <Col span="6">
          <p><span class="font40">{{userData.static_balance}}</span>USD</p>
          <p>静态资产值</p>
        </Col>
        <Col span="6">
          <p><span class="font40">{{userData.dynamic_balance}}</span>USD</p>
          <p>动态资产值</p>
        </Col>
        <Col span="6">
          <p><span class="font40">{{userData.baoben_balance}}</span>USD</p>
          <p>保本资产值</p>
        </Col>
      </Row>
      <!-- <hr />  -->
      <!-- <Row style="text-align: center;">
        <Col span="8">
          <p><img :src="require('../../../images/BTC.png')"></p>
          <p>比特币BTC</p>
          <p>2.4865465</p>
        </Col>
        <Col span="8">
          <p><img :src="require('../../../images/ETH.png')"></p>
          <p>以太坊ETH</p>
          <p>2.4865465</p>
        </Col>
        <Col span="8">
          <p><img :src="require('../../../images/LTC.png')"></p>
          <p>莱特币LTC</p>
          <p>2.4865465</p>
        </Col>
      </Row>
      <Row style="text-align: center;padding-bottom: 30px;">
        <Col span="8">
          <p><img :src="require('../../../images/BCH.png')"></p>
          <p>比特现金BCH</p>
          <p>2.4865465</p>
        </Col>
        <Col span="8">
          <p><img :src="require('../../../images/RIPPLE.png')"></p>
          <p>瑞波币RIPPLE</p>
          <p>2.4865465</p>
        </Col>
        <Col span="8">
          <p><img :src="require('../../../images/ETC.png')"></p>
          <p>以太经典ETC</p>
          <p>2.4865465</p>
        </Col>
      </Row> -->
    </template>

    <ActiveTable v-else ref="table" :options="options"></ActiveTable>

  </Card>
</template>

<script>
// import data from '@/libs/data'
export default {
  data () {
    return {
      userData: {},
      curTab: '0',
      navTabs: [
        {label: '资产统计', name: '0'},
        {label: '直推成员', name: '1'},
        {label: '资产领取记录', name: '2'},
        {label: '资产充值记录', name: '3'},
        {label: '资产互转记录', name: '4'},
        {label: '数字货币地址记录', name: '5'},
        {label: '邀请码购买记录', name: '6'}
      ],
      allColus: [
        [],
        // 直推成员
        [
          {title: '用户名', minWidth: 120, key: 'username'},
          {title: '姓名', minWidth: 200, key: 'name'},
          {title: '会员等级', minWidth: 200, 
            render: (h, {row}) => {
              return h('span', ['注册会员', '初级', '高级'][row.level])
            }
          },
          {title: '加入时间', minWidth: 200, key: 'registime'},
          {title: '贡献总金额', minWidth: 200, key: 'total_recharge_balance'}
        ],
        // 资产领取记录
        [
          {title: '会员账号', minWidth: 120, key: 'username'},
          {title: '数字货币', minWidth: 200, key: 'coin_name'},
          {title: '最终提取金', minWidth: 200, key: 'amount'},
          {title: '获得币数', minWidth: 200, key: 'coin_count'},
          {title: '钱包地址', minWidth: 200, key: 'to_coin_address'},
          {title: '备注', minWidth: 200, key: 'remark'},
          {title: '提取时间', minWidth: 200, key: 'time'},
          {title: '打款时的货币价格', minWidth: 200, key: 'real_coin_price'},
          {title: '实际打款币数', minWidth: 200, key: 'coin_count'},
          {title: '打款时间', minWidth: 200, key: 'remit_time'},
          {title: '状态', minWidth: 200, 
            render: (h, {row}) => {
              return h('span', '打款成功');
            }
          }
        ],
        // 资产充值记录
        [
          {title: '数字货币', minWidth: 120, key: 'coin_name'},
          {title: '充值金额', minWidth: 200, key: 'payamount'},
          {title: '充值数量', minWidth: 200, key: 'coin_count'},
          {title: '收币地址', minWidth: 200, key: 'to_coin_address'},
          {title: '备注', minWidth: 200, key: 'remark'},
          {title: '充值凭证', minWidth: 200, 
            render: (h, {row}) => {
              return h('PreviewGroup', {
                props: {
                  urls: [row.pic]
                }
              })
            }
          },
          {title: '充值时间', minWidth: 200, key: 'time'},
          {title: '审批账号', minWidth: 200, key: 'auditer'},
          {title: '审批时间', minWidth: 200, key: 'audit_time'}
        ],
        // 资产互转记录
        [
          {title: '订单编号', minWidth: 120, key: 'order_no'},
          {title: '转出会员账号', minWidth: 120, key: 'from_uername'},
          {title: '资产类型', minWidth: 200,
            render: (h, {row}) => {
              return h('span', ['', '静态资产', '动态资产', '保本资产'][row.obj_type])
            }
          },
          {title: '转入会员账号', minWidth: 200, key: 'to_username'},
          {title: '转出资产金额', minWidth: 200, key: 'trade_amount'},
          {title: '手续费比例', minWidth: 200, key: 'rate'},
          {title: '手续费', minWidth: 200, key: 'fee'},
          {title: '实际到账金额', minWidth: 200, key: 'real_amount'},
          {title: '备注', minWidth: 200, key: 'remark'},
          {title: '操作时间', minWidth: 200, key: 'time'}
        ],
        // 数字货币地址记录
        [
          {title: '数字货币', minWidth: 120, key: 'name'},
          {title: '数字货币地址', minWidth: 200, key: 'address'},
          {title: '添加时间', minWidth: 200, key: 'time'}
        ],
        // 邀请码购买记录   数字货币,发币钱包地址,平台收币地址,备注，凭证，状态
        [
          {title: '订单编号', minWidth: 120, key: 'order_no'},
          {title: '邀请码费用', minWidth: 200, key: 'price'},
          {title: '购买数量', minWidth: 200, key: 'count'},
          {title: '总费用', minWidth: 200, key: 'payamount'},
          {title: '备注', minWidth: 200, key: 'remark'},
          {title: '购买时间', minWidth: 200, key: 'time'}
        ],
      ],
      options: {
        url: '/table', //'/web/userGl/getMyPage',
        columns: [],
        params: () => {
          return {
            mid: this.id,
            type: this.curTab,
            status: this.curTab == '3' ? 8 : 3
          }
        }
      }
    }
  },
  computed: {
    id () {
      return this.$route.query.mid
    },
    userType () {
     return this.$store.state.user.userType
    }
  },
  created () {
    this.options.columns = this.allColus[Number(this.curTab)]
  },
  mounted () {
      this.getDetail()
      // this.requestTable()
  },
  methods: {
    getDetail () {
      this.$ajax({
        url: '/web/member/WebPersonInfo',
        data: {mid: this.id},
        success: ({data}) => {
          this.userData = data
        }
      })
    },
    requestTable() {
      if(this.curTab != 0){
        this.$refs.table.request();
      }
    },
    changeTab (value) {
      this.curTab = value.name
      this.options.columns = this.allColus[Number(this.curTab)];
      switch(this.curTab) {
        // 直推成员
        case '1':
          this.options.url = '/web/member/MyInvitedMemList';
          break;
        // 资产领取记录
        case '2':
          this.options.url = '/web/order/RemitList';
          break;
        // 资产充值记录
        case '3':
          this.options.url = '/web/order/WebRujinList';
          break;
        // 资产互转记录
        case '4':
          this.options.url = '/client/Member/TransferList';
          break;
        // 数字货币地址记录
        case '5':
          this.options.url = '/client/coin/MyList';
          break;
        // 邀请码购买记录
        case '6':
          this.options.url = '/web/order/BuyAcCodeList';
          break;
      }
      this.$nextTick(() => {
        this.requestTable()
      })
    }
  }
}
</script>
<style lang="css" scoped>
  .font40 {
    font-size: 40px;
  }
  hr {
    margin: 50px;
    border-color: #fff;
  }
  .adsItem {
    display: inline-block;
    cursor: pointer;
    padding: 5px 10px;
    border-right: 1px solid #888;
  }
  .active {
    color: #2d8cf0;
  }
  .item {
    margin-bottom: 15px;
  }
  .logo {
    width: 120px;
    height: 120px;
  }
  .idcard {
    width: 60px;
    height: 60px;
  }
</style>
