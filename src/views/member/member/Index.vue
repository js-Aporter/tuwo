<template>
  <Card>
    <Form class="table-search-form">
      <FormItem label="查询">
        <Input v-model="searchForm.keyword" placeholder="用户名/姓名/手机号"/>
      </FormItem>
      <FormItem>
        <Select v-model="searchForm.memberType"  placeholder="请选择会员类型">
          <Option value="">全部</Option>
          <Option :value="0">注册</Option>
          <Option :value="1">初级</Option>
          <Option :value="2">高级</Option>
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
    <!-- <Add v-model="showAddModal" :data="editdata" :mode="addMode"></Add> -->
  </Card>
</template>

<script>
  // import Add from './Add'

  export default {
    components: {},
    data() {
      return {
        showAddModal: false,
        editdata: {},
        addMode: 'add',
        searchForm: {
          keyword: '',
          dateRange: []
        },
        options: {
          url: '/web/member/WebMemList',
          columns: [
            {title: '用户名', key: 'username', minWidth: 120},
            {title: '会员级别', key: 'level', minWidth: 120,
              render: (h, {row}) => {
                return h('span', ['注册会员', '初级', '高级'][row.level])
              }
            },
            {title: '姓名', key: 'realname', minWidth: 120},
            {title: '手机号', key: 'mobile', minWidth: 150},
            // {title: '合约开始时间', key: 'contact_stime', minWidth: 150},
            // {title: '合约结束时间', key: 'contact_etime', minWidth: 150},
            {title: '状态', key: 'contact_status', minWidth: 130},
            {title: '注册时间', key: 'registime', minWidth: 150},
            {
              title: '操作', minWidth: 250, render: (h, {row}) => {
                return h('div', {'class': 'table-btn-group'}, [
                  h('Button', {
                    props: {type: 'primary'},
                    on: {
                      click: () => {
                        this.$router.push({name: 'MemberDetail', query: {mid: row.mid}})
                      }
                    }
                  }, '查看')
                ])
              }
            }
          ],
          params: () => ({
            query: this.searchForm.keyword,
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
      showAdd(mode) {
        this.addMode = mode;
        this.showAddModal = true;
      }
    },
    mounted() {
      this.handleSearch();
    }
  }
</script>

<style scoped>

</style>
