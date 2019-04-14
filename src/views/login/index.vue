<template>
  <Row class="login-page" type="flex" justify="center" align="middle">
    <Col style="text-align:center">
      <Card v-show="!forgetPassword" class="login-card" shadow>
        <Row>
          <Col span="12" style="font-size:0">
            <img src="../../images/login-logo.png" style="width:100%;">
          </Col>
          <Col span="12">
            <div class="title">
              <div style="font-size:0">
                <img src="../../images/logo.png">
              </div>
            </div>
            <Form ref="loginForm" :model="loginForm" :rules="loginRules">
              <FormItem prop="account">
                <Input prefix="ios-contact" v-model="loginForm.account" placeholder="输入登录账号"></Input>
              </FormItem>
              <FormItem prop="password">
                <Input type="password" v-model="loginForm.password" placeholder="输入登录密码"></Input>
              </FormItem>

              <FormItem>
                <AsyncButton class="fillet-btn login-btn" @click="handleLogin">登录</AsyncButton>
              </FormItem>

              <FormItem>
                <Button type="text" @click="forgetPassword=true">忘记密码</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </Card>
      <Card v-show="forgetPassword" class="forget-password-card" shadow>
        <Row style="background-color:#f8f8f8">
          <Col span="12">
            <div class="logo-lf">
              <img src="../../images/logo.png">
            </div>
          </Col>
          <Col span="12" style="background-color:#fff">
            <div class="fg-title">忘记密码</div>
            <Form ref="forgetPasswordForm" :model="forgetPasswordForm" :rules="forgetPasswordRules">
              <FormItem prop="account">
                <Input v-model="forgetPasswordForm.account" placeholder="输入登录账号"></Input>
              </FormItem>

              <FormItem prop="phoneNumber">
                <Input
                  :maxlength="11"
                  v-model="forgetPasswordForm.phoneNumber"
                  placeholder="输入手机号码"
                ></Input>
              </FormItem>

              <FormItem prop="verifyCode">
                <Input :maxlength="6" v-model="forgetPasswordForm.verifyCode" placeholder="输入验证码"></Input>
                <VerifyCode :phone-number="forgetPasswordForm.phoneNumber"/>
              </FormItem>

              <FormItem prop="newPassword">
                <Input type="password" v-model="forgetPasswordForm.newPassword" placeholder="输入新密码"></Input>
              </FormItem>

              <FormItem prop="confirmPassword">
                <Input
                  type="password"
                  v-model="forgetPasswordForm.confirmPassword"
                  placeholder="再次输入密码"
                ></Input>
              </FormItem>

              <FormItem>
                <AsyncButton class="fillet-btn finds-btn" @click="handleChangePassword">找回密码</AsyncButton>
              </FormItem>

              <FormItem>
                <Button type="text" @click="forgetPassword=false">直接登录</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </Card>
    </Col>
  </Row>
</template>
<script>
import Cookies from "js-cookie";
import VerifyCode from "@/components/VerifyCode";

export default {
  components: { VerifyCode },
  data() {
    return {
      forgetPassword: false,
      loginForm: {
        account: "",
        password: ""
      },
      loginRules: {
        account: [{ required: true, message: "请输入登录账号" }],
        password: [{ required: true, message: "请输入登录密码" }]
      },
      forgetPasswordForm: {
        account: "",
        phoneNumber: "",
        verifyCode: "",
        newPassword: "",
        confirmPassword: ""
      },
      forgetPasswordRules: {
        account: [{ required: true, message: "请输入登录账号" }],
        phoneNumber: [{ required: true, message: "请输入手机号码" }],
        verifyCode: [{ required: true, message: "请输入验证码" }],
        newPassword: [{ required: true, message: "请输入新密码" }],
        confirmPassword: [{ required: true, message: "请再次输入密码" }]
      }
    };
  },

  watch: {
    forgetPassword(value) {
      this.$refs[value ? "loginForm" : "forgetPasswordForm"].resetFields();
    }
  },

  methods: {
    handleLogin(evt, done) {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const form = this.loginForm;
          this.$ajax({
            url: "web/user/Login",
            data: {
              username: form.account,
              password: form.password
            },
            success: res => {
              const bodydata = res.data;
              // Cookies.set("user", bodydata.username, { expires: 7 });
              // 权限管理
              if (bodydata.username == 'admin') {
                  this.$store.commit('updateMenulist');
              } else if(bodydata.rights == ''){
                  this.$Message.error('该用户未分配角色，请联系管理员分配角色');
                  return;
              }else {
                  this.$store.commit('accessUpdateMenulist', JSON.parse(bodydata.rights));
              }
              localStorage.setItem('accessData', bodydata.rights || '[]');
              this.$store.commit("setUser", bodydata.username);
              this.$store.commit("setUserId", bodydata.usid);
              this.$store.commit("setToken", bodydata.login_token);
              this.$router.push({ name: "home_index" });
            },
            complete: done
          });
        } else {
          done();
        }
      });
    },

    handleChangePassword(evt, done) {
      this.$refs.forgetPasswordForm.validate(valid => {
        this.handleSubmit(valid, done);
      });
    },

    handleSubmit(valid, done) {
      if (valid) {
        setTimeout(() => {
          done();
          Cookies.set("user", "Test" + Math.random(), { expires: 7 });
          this.$router.push({ name: "home_index" });
        }, 1000);
      } else {
        done();
      }
    }
  }
};
</script>

<style lang="less">
.login-page {
  background-size: 100% auto;
  height: 100%;
  .title {
    padding: 8px 0 26px;
    font-size: 18px;
  }
  .fg-title {
    padding: 36px 0 26px;
    font-size: 18px;
  }
  input {
    width: 260px;
    font-size: 14px;
    border-bottom: solid #eeeeee;
    border-width: 0 0 1px 0 !important;
    border-radius: 0;
    box-shadow: none !important;
  }
  .ivu-form-item-error-tip {
    left: 54px;
  }
  .ivu-card {
    width: 715px;
    overflow: hidden;
  }

  .ivu-card-head p {
    font-size: 18px;
    font-weight: normal;
  }

  .verify-code-btn {
    position: absolute;
    right: 30px;
    bottom: 4px;
    width: 100px;
    border-left: 1px solid #eeeeee;
    border-radius: 0;
  }
  .logo-lf {
    margin-top: 50%;
    border-radius: 16px;
    background-color: white;
    padding: 20px;
    display: inline-block;
    font-size: 0;
  }
  .ivu-card-body {
    padding: 0;
  }
}
</style>
