<template>
  <Modal :value="value" :loading="loading" title="打款" width="800">
    <Form :label-width="120" ref="form" :model="form" :rules="rules" label-position="left">
      <FormItem label="打款结果">
        <RadioGroup v-model="form.audit">
            <Radio :label="3">打款成功</Radio>
            <Radio :label="4">打款失败</Radio>
        </RadioGroup>
      </FormItem>
      <div v-show="form.audit == 3">
        <FormItem label="最终提取金">
          {{data.amount}} USD
        </FormItem>
        <FormItem label="钱包地址">
          {{data.to_coin_address}}
        </FormItem>
        <FormItem label="打款时的货币价格" prop="price">
          {{form.price}} USD
        </FormItem>
        <FormItem label="实际打款币数">
          {{form.count}}
        </FormItem>
      </div>

      <FormItem  v-show="form.audit == 4" label="打款失败原因" prop="reason">
        <Input v-model="form.reason" type="textarea" :rows="4" />
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
  import ExternalModal from '@/libs/external-modal'
  import Editor from '@/components/tinymce/Index'

  export default {
    mixins: [ExternalModal],
    components: {Editor},
    props: {
      id: Number
    },
    data() {
      const price = (rule, value, callback) => {
        if(this.form.audit == 1){
          if (value === '' || value === null || value === undefined || value.length === 0) {
            callback(new Error('打款时的货币价格不能为空'));
          } else {
              callback();
          }
        } else {
          callback();
        }
      };
      return {
        form: {
          audit: 3,
          price: null,
          reason: '',
          count: 0
        },
        rules: {
          reason: [{ message: '请输入不通过原因'}],
          price: [{ validator: price, message: '请输入打款时货币价格'}],
        }
      }
    },
    methods: {
      handleOk() {
      },
      handleCancel() {
        this.$emit('input', false)
        this.$refs['form'].resetFields();
        this.form.audit = 1;
      },
      handleVisibleChange(state) {
        if(state){
          this.getData();
        }
      },
      handleSubmit(resolve, reject) {
        const user = this.$store.state.user.user;
        const params = {
          remit_no: this.data.remit_no,
          status: this.form.audit,
          real_coin_price: this.form.price,
          real_coin_count: this.form.count,
          remit_reason: this.form.reason,
          remiter: user
        }
        this.$ajax({
            url: '/web/order/Remit',
            data: params,
            success: ({data}) => {
                this.$Message.success('操作成功')
                this.handleCancel()
                this.$emit('submit')
            },
            error: (res) => {
                this.$Message.error(res.msg)
            }
        })
      },
      getData () {
        this.$ajax({
          url: '/common/coin/CoinConvert',
          data: {name: this.data.coin_name, amount: this.data.amount},
          success: ({data}) => {
            console.log(data)
            this.form.count = data.count;
            this.form.price = data.price;
          },
          fail: (err) =>{
            console.log(err);
          }
        })
      }
    },
    mounted() {
      
    },
  }
</script>

<style scoped>

</style>
