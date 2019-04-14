<style lang="less">
  @import "./main.less";
</style>
<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
      <shrinkable-menu
        :shrink="shrink"
        @on-change="handleSubmenuChange"
        :theme="menuTheme"
        :before-push="beforePush"
        :open-names="openedSubmenuArr"
        :menu-list="menuList">
        <div slot="top" class="logo-con">
          <img src="../images/logo1.png" key="max-logo"/>
          <!--<img v-show="!shrink" src="../images/logo.jpg" key="max-logo"/>-->
          <!--<img v-show="shrink" src="../images/logo-min.jpg" key="min-logo"/>-->
        </div>
      </shrinkable-menu>
    </div>
    <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
      <div class="main-header">
        <!--<div class="navicon-con">-->
        <!--<Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">-->
        <!--<Icon type="navicon" size="32"></Icon>-->
        <!--</Button>-->
        <!--</div>-->
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
          </div>
        </div>
        <div class="header-avator-con">
          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{ userName }}</span>
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="changePassword">修改密码</DropdownItem>
                  <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>
            </Row>
          </div>
        </div>
      </div>
      <div class="tags-con">
        <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
      </div>
    </div>
    <div class="single-page-con" :style="{left: shrink ? '60px' : '200px'}">
      <div class="single-page">
        <keep-alive :include="cachePage">
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>

    <!--修改密码-->
    <ChangePassword v-model="showChangePassword"/>
  </div>
</template>
<script>
  import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
  import tagsPageOpened from './main-components/tags-page-opened.vue';
  import breadcrumbNav from './main-components/breadcrumb-nav.vue';
  import ChangePassword from './main-components/ChangePassword';
  import Cookies from 'js-cookie';
  import util from '@/libs/util';

  export default {
    components: {
      shrinkableMenu,
      tagsPageOpened,
      breadcrumbNav,
      ChangePassword
    },
    data() {
      return {
        showChangePassword: false,
        shrink: false,
        userName: '',
        isFullScreen: false,
        openedSubmenuArr: this.$store.state.app.openedSubmenuArr
      }
    },
    computed: {
      menuList() {
        return this.$store.state.access.menuList;
      },
      pageTagsList() {
        return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
      },
      currentPath() {
        return this.$store.state.app.currentPath; // 当前面包屑数组
      },
      avatorPath() {
        return ''//localStorage.avatorImgPath;
      },
      cachePage() {
        return this.$store.state.app.cachePage;
      },
      lang() {
        return this.$store.state.app.lang;
      },
      menuTheme() {
        return this.$store.state.app.menuTheme;
      },
      mesCount() {
        return this.$store.state.app.messageCount;
      }
    },
    methods: {
      // 页面刷新时重新拿到用户权限，与本地保存的权限对比，防止用户修改了本地保存的数据，导致能看到没有权限的页面
      checkAccess() {
        // 角色类型cookie 没有时重新登录
        const userName = Cookies.get("user");
        const token = Cookies.get("token");
        if (typeof userName === 'undefined' || typeof token === 'undefined') {
          this.clearData();
          return;
        }
        // this.$store.commit('accessUpdateMenulist', []);
        const accessData = JSON.parse(localStorage.getItem("accessData"));
        const usid = Cookies.get("userId");
        let newAccessData = [];
        this.$ajax({
          url: "/web/user/GetRightsByUser",
          data: {
            usid
          },
          success: ({ data }) => {
            newAccessData = data.list;
            if (this.setMenulist(newAccessData)) {
              if (JSON.stringify(newAccessData) != JSON.stringify(accessData)) {
                this.clearData();
              }
            }
          },
          fail: () => {
            this.setMenulist(accessData);
          },
          error: () => {
            this.setMenulist(accessData);
          }
        });
      },
      // 设置菜单栏
    setMenulist(accessData) {
      const userName = Cookies.get("user");
      if (userName == "admin") {
        this.$store.commit("updateMenulist");
        return false;
      } else {
        this.$store.commit("accessUpdateMenulist", accessData);
        return true;
      }
    },
      init() {
        let pathArr = util.setCurrentPath(this, this.$route.name);
        // this.$store.commit('updateMenulist');
        if (pathArr.length >= 2) {
          this.$store.commit('addOpenSubmenu', pathArr[1].name);
        }
        this.userName = Cookies.get('user');
        let messageCount = 3;
        this.messageCount = messageCount.toString();
        this.checkTag(this.$route.name);
        this.$store.commit('setMessageCount', 3);
      },
      toggleClick() {
        this.shrink = !this.shrink;
      },
      handleClickUserDropdown(name) {
        // 退出登录
        if (name === 'loginout') {
          this.$Modal.confirm({
            content: '确定要退出当前登录？',
            onOk: () => {
              this.clearData();
            }
          })
        }

        // 修改密码
        if (name === 'changePassword') {
          this.showChangePassword = true;
        }
      },
      clearData() {
        let token = Cookies.get("token");
        this.$ajax({
          url: "/web/user/Logout",
          data: { token },
          success: res => {
            this.$store.commit("logout", this);
            this.$store.commit("clearOpenedSubmenu");
            this.$router.push({
              name: "Login"
            });
          },
          error: () => {
            this.$store.commit("logout", this);
            this.$store.commit("clearOpenedSubmenu");
            this.$router.push({
              name: "Login"
            });
          }
        });
      },
      checkTag(name) {
        let openpageHasTag = this.pageTagsList.some(item => {
          if (item.name === name) {
            return true;
          }
        });
        if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
          util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
        }
      },
      handleSubmenuChange(val) {
        // console.log(val)
      },
      beforePush(name) {
        // if (name === 'accesstest_index') {
        //     return false;
        // } else {
        //     return true;
        // }
        return true;
      },
      fullscreenChange(isFullScreen) {
        // console.log(isFullScreen);
      }
    },
    watch: {
      '$route'(to) {
        this.$store.commit('setCurrentPageName', to.name);
        let pathArr = util.setCurrentPath(this, to.name);
        if (pathArr.length > 2) {
          this.$store.commit('addOpenSubmenu', pathArr[1].name);
        }
        this.checkTag(to.name);
        localStorage.currentPageName = to.name;
      },
      lang() {
        util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
      }
    },
    mounted() {
      this.checkAccess();
      this.init();
    },
    created() {
      // 显示打开的页面的列表
      this.$store.commit('setOpenedList');
    }
  };
</script>
