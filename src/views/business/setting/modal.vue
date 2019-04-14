<template>
  <Modal :value="value" :loading="loading" title="添加" :width="800">
    <Form v-if="type == 0" :model="form" :rules="rules" ref="form" :label-width="100" label-position="left">
      <FormItem label="激活账户">
        激活账户<InputNumber :min="0" v-model="form.max_months" />个月不升级自动取消
      </FormItem>
      <FormItem label="级别">
        <p> 初级 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;入金金额低于<InputNumber :min="0"  v-model="form.f_max_amount" /> USD</p>
        <p> 高级 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;高于 {{form.f_max_amount}} USD</p>
      </FormItem>
    </Form>

    <Form v-else-if="type == 1" :model="form" :rules="rules" ref="form" :label-width="100" label-position="left">
      <FormItem label="初级">
        <p>
          资金<InputNumber :min="0" v-model="form.f_level_bb_rate" />%
          冻结<InputNumber :min="0" v-model="form.f_level_bb_frozen_days" />天
          <InputNumber :min="0" v-model="form.f_level_bb_beishu" />倍保本</p>
        <p>
          <InputNumber :min="0" v-model="form.f_level_dingx_rate" />%
          入金资产：<InputNumber :min="0" v-model="form.f_level_pv_rate" />PV，
          <InputNumber :min="0" v-model="form.f_level_remit_rate" />%
          分红<InputNumber :min="0" v-model="form.f_static_remit_days" />工作日</p>
      </FormItem>
      <FormItem label="高级">
        <p>
          资金<InputNumber :min="0" v-model="form.g_level_bb_beishu" />%
          冻结<InputNumber :min="0" v-model="form.g_level_bb_frozen_days" />天
          <InputNumber :min="0" v-model="form.g_level_bb_rate" />倍保本</p>
        <p>
          <InputNumber :min="0" v-model="form.g_level_dingx_rate" />%
          入金资产：<InputNumber :min="0" v-model="form.g_level_pv_rate" />PV，
          <InputNumber :min="0" v-model="form.g_level_remit_rate" />%
          分红<InputNumber :min="0" v-model="form.g_static_remit_days" />工作日</p>
      </FormItem>
    </Form>

    <Form v-else-if="type == 2" :model="form" :rules="rules" ref="form" :label-width="100" label-position="left">
      <div class="item">
        <p>推荐奖</p>
        <p>初级 <InputNumber :min="0" v-model="form.f_tuijj_rate" />%</p>
        <p>高级 <InputNumber :min="0" v-model="form.g_tuijj_rate" />%</p>
      </div>
      <hr />
      <div class="item">
        <p>分享奖（新增业绩）</p>
        <p>初级 <InputNumber :min="0" v-model="form.f_sharej_rate" />%</p>
        <p>高级 <InputNumber :min="0" v-model="form.g_sharej_rate" />%</p>
      </div>
      <hr />
      <div class="item">
        <p>福利奖</p>
        <p>小区业绩达到 <InputNumber :min="0" v-model="form.max_yeji$1" />万美金，奖励<InputNumber :min="0" v-model="form.remit$1" />万美金</p>
        <p>小区业绩达到 <InputNumber :min="0" v-model="form.max_yeji$2" />万美金，奖励<InputNumber :min="0" v-model="form.remit$2" />万美金</p>
        <p>小区业绩达到 <InputNumber :min="0" v-model="form.max_yeji$3" />万美金，奖励<InputNumber :min="0" v-model="form.remit$3" />万美金</p>
        <p>小区业绩达到 <InputNumber :min="0" v-model="form.max_yeji$4" />万美金，奖励<InputNumber :min="0" v-model="form.remit$4" />万美金</p>
      </div>
      <hr />
      <div class="item">
        <p>分红奖</p>
        <p>小区业绩在 <InputNumber :min="0" v-model="form.max_yeji$5" />万美金以内，每日分红<InputNumber :min="0" v-model="form.remit$5" />%</p>
        <p>小区业绩在 {{form.max_yeji$5}} 万至 <InputNumber :min="0" v-model="form.max_yeji$6" />万美金，每日分红<InputNumber :min="0" v-model="form.remit$6" />%</p>
        <p>小区业绩达到 {{form.max_yeji$6}} 万美金以上，每日分红 <InputNumber :min="0" v-model="form.remit$7" />%</p>
      </div>
      <hr />
      <div class="item">
        <p>董事奖</p>
        <p>小区业绩达到 <InputNumber :min="0" v-model="form.max_yeji$8" />万美金，参与项目<InputNumber :min="0" v-model="form.remit$8" />%效益分红</p>
      </div>
    </Form>

    <Form v-else-if="type == 3" :model="form" :rules="rules" ref="form" :label-width="150" label-position="left">
      <!-- <FormItem label="PV值">
        <InputNumber :min="0" v-model="form.account" />
      </FormItem> -->
      <FormItem label="入金的矿工费">
        <InputNumber :min="0" v-model="form.kuangg_rate" />%
      </FormItem>
      <FormItem label="动静态总和（实际入金）">
        <InputNumber :min="0" v-model="form.out_beishu_out" />倍出局
      </FormItem>
      <!-- <FormItem label="静态资产分红时长">
        <InputNumber :min="0" v-model="form.account" />天
      </FormItem>
      <FormItem label="保本资产解封日期时长">
        <InputNumber :min="0" v-model="form.account" />天
      </FormItem> -->
    </Form>

    <!-- 提现机制 -->
    <Form v-else-if="type == 4" :model="form" :rules="rules" ref="form" :label-width="150" label-position="left">
      <FormItem label="PV值">
        <InputNumber :min="0" v-model="form.remit_pv_rate" />
      </FormItem>
      <FormItem label="手续费">
        <InputNumber :min="0" v-model="form.remit_rate" />%
      </FormItem>
      <FormItem label="天使储备金">
        <InputNumber :min="0" v-model="form.remit_tscbj_rate" />%
      </FormItem>
      <FormItem label="七进六出">
        <InputNumber :min="0" v-model="form.seven_to_six" />%
      </FormItem>
      <FormItem label="资产领取的矿工费">
        <InputNumber :min="0" v-model="form.remit_kg_rate" />%
      </FormItem>
    </Form>

    <Form v-else-if="type == 5" :model="form" :rules="rules" ref="form" :label-width="150" label-position="left">
      <FormItem label="比特币BTC">
        <Input v-model="form.BTC" />
      </FormItem>
      <FormItem label="以太坊ETH">
        <Input v-model="form.ETH" />
      </FormItem>
      <FormItem label="以太经典ETC">
        <Input v-model="form.ETC" />
      </FormItem>
      <FormItem label="莱特币LTC">
        <Input v-model="form.LTC" />
      </FormItem>
      <!-- <FormItem label="瑞波币RIPPLE">
        <Input v-model="form.account" />
      </FormItem>
      <FormItem label="以太经典">
        <Input v-model="form.account" />
      </FormItem> -->
      <FormItem label="比特现金BCH">
        <Input v-model="form.BCH" />
      </FormItem>
    </Form>

  </Modal>
</template>

<script>
  import ExternalModal from '@/libs/external-modal'
  //0会员等级，1静态投资，2动态投资，3总控盘，4提现机制 5 资产电子地址管理

  export default {
    mixins: [ExternalModal],
    props: {
      type: Number
    },
    data() {
      return {
        form: {
          // 会员级别
          max_months: null, f_min_amount: null, f_max_amount: null, g_max_amount: null,
          
          // 静态投资规则
          f_level_bb_rate: null, f_level_bb_frozen_days: null, f_level_bb_beishu: null, f_level_dingx_rate: null,
              f_level_pv_rate: null, f_level_remit_rate:null, f_static_remit_days: null, g_level_bb_beishu: null,
              g_level_bb_frozen_days: null, g_level_bb_rate: null, g_level_dingx_rate: null, g_level_pv_rate: null,
              g_level_remit_rate: null, g_static_remit_days: null,
          
          // 动态投资规则
          f_tuijj_rate: null, g_tuijj_rate: null, f_sharej_rate: null, g_sharej_rate:null,
          max_yeji$1: null, remit$1: null,
          max_yeji$2: null, remit$2: null,
          max_yeji$3: null, remit$3: null,
          max_yeji$4: null, remit$4: null,
          // 提交时另外加上 min_yeji$6 = max_yeji$5，min_yeji$7 = max_yeji$6
          min_yeji$5: null, max_yeji$5: null, remit$5: null,
          min_yeji$6: null,max_yeji$6: null, remit$6: null,
          min_yeji$7: null,max_yeji$7: null, remit$7: null,
          max_yeji$8: null, remit$8: null,

          // 总控盘机制
          kuangg_rate: null, out_beishu_out: null,

          // 提现机制
          remit_pv_rate: null,remit_rate: null,remit_tscbj_rate: null,seven_to_six: null,remit_kg_rate: null,

          // 资产地址
          BTC: '', ETH: '', LTC: '', BCH: '', LTC: ''
        },
        rules: {
          roleName: [{required: true, message: '请填写角色名称'}]
        }
      }
    },
    methods: {
      handleVisibleChange(state) {
        if (state) {
          this.getInfo();
        }
      },
      handleCancel() {
        this.$emit('input', false)
        this.$refs['form'].resetFields();
        this.$fn.resetData(this.form);
      },
      handleSubmit(resolve, reject) {
        let params = [];
        this.form.g_max_amount = this.form.f_max_amount;
        Object.keys(this.form).forEach(key => {
          // console.log(key, this.form[key])
          if(this.form[key] !== null && this.form[key] !== '' && typeof this.form[key] !== 'undefined'){
            params.push({
              type: this.type,
              name: key,
              value: this.form[key]
            })
          }
        })
        this.$ajax({
            url: '/web/config/Edit',
            data: params,
            success: ({data}) => {
                this.$Message.success('保存成功')
                this.handleCancel()
                this.$emit('submit')
            }
        })
        
        // 动态资产
        if(this.type == 2){ 
          this.form.min_yeji$5 = 0;
          this.form.min_yeji$6 = this.form.max_yeji$5;
          this.form.min_yeji$7 = this.form.max_yeji$6;
          this.form.max_yeji$7 = this.form.min_yeji$7 + 100000000;
          this.form.min_yeji$8 = 0;
          let params1 = [];
          for(let i = 1; i < 9; i++) { // 只有8条数据
            let type = 1;
            if(i < 5){ // id小于5的为福利奖，暂且这么定
              type = 1;
            } else if (i < 8){// id大于5小于8 的为分红奖
              type = 2;
            } else {  // id等于8 的为董事奖
              type = 3;
            }
            console.log(`min_yeji$${i}`, this.form[`min_yeji$${i}`])
            params1.push({
              type: type,
              min_yeji: this.form[`min_yeji$${i}`],
              max_yeji: this.form[`max_yeji$${i}`],
              remit: this.form[`remit$${i}`]
            })
          }
          console.log(params1)
          this.$ajax({
              url: '/web/config/DynamicEdit',
              data: params1,
              success: ({data}) => {

              }
          })
        }
      },
      getInfo(){
        this.$ajax({
            url: '/web/config/Info',
            data: {type: this.type},
            success: ({data}) => {
                // console.log(data)
                data.list.forEach(item => {
                  this.form[item.name] = Number(item.value);
                })

                // 动态资产
                data.dynlist.forEach((item, index) => {
                  this.form[`min_yeji$${index+1}`] = Number(item.min_yeji);
                  this.form[`max_yeji$${index+1}`] = Number(item.max_yeji);
                  this.form[`remit$${index+1}`] = Number(item.remit);
                })

                // 资产电子地址管理
                data.addrlist.forEach(item => {
                  this.form[item.symbol] = item.address;
                })
            },
            error: (res) => {
                this.$Message.error(res.msg)
            }
        })
      }
    }
  }
</script>

<style scoped>
.item p {
  margin-bottom: 15px;
}
hr {
  margin-bottom: 15px;
  border-top: 1px solid #ccc;
  border-bottom: 0;
}
</style>
