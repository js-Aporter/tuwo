<template>
  <div class="active-table-wrapper">
    <Table stripe border :height="height" :data="tableData" :columns="options.columns" :loading="loading"/>
    <Page
      show-total
      :current="pageIndex"
      :page-size="pageSize"
      :total="pageTotal"
      @on-change="request"
    />
  </div>
</template>

<script>

  export default {
    props: {
      height: {
        type: String,
        defalut: 'auto'
      },
      options: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        loading: false,
        pageTotal: 0,
        pageIndex: 1,
        pageSize: 20,
        tableData: [],
        requestTask: {}
      }
    },
    methods: {
      request(index = 1) {
        let {pageSize, requestTask, options: {url, params}} = this;

        const options = {
          url,
          data: {
            pageSize,
            pageIndex: index,
            ...(typeof params === 'function' ? params() : params)
          },
          setCancel: true,
          success: (response) => {
            const {total, list} = response.data;
            this.pageTotal = total;
            this.tableData = list;

            // 重置或者搜索，或者传递不合法的参数，都会跳转到第一页
            // 设置 pageIndex，不会触发 on-change 事件，所以这里不会发生重复执行的bug
            // 必须每次都设置值，否则不会回到第一页，因为它会一直是 1，不会发生变化
            this.pageIndex = index > 1 ? index : 1;

            this.$emit("success", response);
          },
          complete: (response) => {
            if (!response.isCancel) {
              this.loading = false;
              this.requestTask.cancel = null;
            }
          }
        };

        if (requestTask.cancel) {
          requestTask.cancel();       // 中断未完成的请求
        }

        this.loading = true;
        this.requestTask = this.$ajax(options);

        // this.cancelToken = this.$ajax.getCancelToken();
        //
        // this.$ajax.post(url, {
        //   ps,
        //   pageNum: index,
        //   cancelToken: cancelToken.token,
        //   ...params
        // })
        // .then(response => {
        //   const {total, list} = response.data;
        //   this.pageTotal = total;
        //   this.tableData = list;
        //   this.$emit("success", response);
        //
        //   // 重置或者搜索，或者传递不合法的参数，都会跳转到第一页
        //   // 设置 pageIndex，不会触发 on-change 事件，所以这里不会发生重复执行的bug
        //   // 必须每次都设置值，否则不会回到第一页，因为它会一直是 1，不会发生变化
        //   this.pageIndex = index > 1 ? index : 1;
        // })
        // .catch(error => {
        //   if (error.isCancel) {
        //     this.loading = 'isCancel';
        //   }
        // })
        // .finally(() => {
        //   this.loading = this.loading === 'isCancel';
        // });
      },

      reset(form) {
        if (form) {
          this.$fn.resetData(form);
        }
        this.$nextTick(this.request);
      }
    }
  }
</script>

<style lang="less">
  .active-table-wrapper {
    margin-top: 5px;

    .ivu-page {
      padding: 30px 0;
    }
  }
</style>
