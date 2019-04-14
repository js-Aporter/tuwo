// import axios from "axios";
// import {Message} from 'iview';
//
//
// // 创建 axios 实例
// const service = axios.create({
//   header: {'Content-Type': 'application/json'},
//   timeout: 10000
// });
//
//
// // 请求失败后的处理
// function onRejected(error) {
//   if (axios.isCancel(error)) {
//     error.isCancel = true;          // 标记是手动中断请求
//   } else {
//     Message.error('系统错误！');     // 如果不是手动取消请求导致的失败，将提示错误
//   }
//   return Promise.reject(error);
// }
//
//
// // 请求之前拦截
// service.interceptors.request.use(function (options) {
//   options.data = {
//     data: options.data
//   };
//   return options;
// }, onRejected);
//
//
// // 请求后拦截
// service.interceptors.response.use(function (response) {
//   const bodydata = response.data;
//
//   // 状态码为 0 为请求处理成功
//   if (parseInt(bodydata.code) === 0) {
//     return bodydata;
//   }
//
//   bodydata.statusError = true;    // 标记这个失败是状态码错误导致的，它已经请求成功了，但是没有处理成功
//   Message.error(bodydata.msg);
//   return Promise.reject(bodydata);
// }, onRejected);
//
//
// // 获取中断请求函数
// function getCancelToken() {
//   let cancel, token = new axios.CancelToken(function (c) {
//     cancel = c;
//   });
//   return {cancel, token};
// }
//
// service.getCancelToken = getCancelToken;
//
// //

import axios from "axios";
import {Message, Spin} from 'iview';


// 创建 axios 实例
const service = axios.create({
  header: {'Content-Type': 'application/json'},
  timeout: 10000
});

function getCancelToken() {
  let cancel, token = new axios.CancelToken(function (c) {
    cancel = c;
  });
  return {cancel, token};
}

function ajax({url, data, showSpin, success, error, fail, complete, cancel, setCancel, method = 'post'}) {

  if (showSpin) {
    Spin.show();
  }

  let response = null;
  const cancelToken = setCancel ? getCancelToken() : {};
  const requestTask = service({
    url,
    method,
    data: {data},
    cancelToken: cancelToken.token
  });

  requestTask.then(function ({data: bodydata}) {
    response = bodydata;
    if (parseInt(bodydata.code) === 0) {
      if (success) {
        success(bodydata);
      }
    } else {
      Message.error(bodydata.msg);
      if (error) {
        error(bodydata);
      }
    }
  });

  requestTask.catch(function (_error) {
    response = _error;
    if (axios.isCancel(_error)) {
      response.isCancel = true;
      if (cancel) {
        cancel(_error);
      }
    } else {
      Message.error(_error.response.statusText);
      if (fail) {
        fail(_error);
      }
    }
  });

  requestTask.finally(function () {
    if (showSpin) {
      Spin.hide();
    }
    if (complete) {
      complete(response);
    }
  });

  requestTask.cancel = cancelToken.cancel;
  return requestTask;
}

export default {
  install(Vue) {
    Vue.prototype.$ajax = ajax;
  }
}
