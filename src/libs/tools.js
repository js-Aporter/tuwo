//
import {Modal, Message} from 'iview';

// 匹配文件后缀名，获取文件类型
const fileExtPatterns = {
  image: /\.(png|jpe?g|gif)$/,
  video: /\.(mp4)$/,
  audio: /\.(mp3|m4a)$/
};

// 为日期数据添加前缀 0
function toDouble(value) {
  return value < 10 ? '0' + value : value;
}

const tools = {

  // 格式化为日期格式
  toDateString(date) {
    return date ? [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(toDouble).join('-') : '';
  },

  // 格式化为时间格式
  toTimeString(date) {
    return date ? [date.getHours(), date.getMinutes(), date.getSeconds()].map(toDouble).join(':') : '';
  },

  getFileType(url) {
    let key, type = 'unknownType';
    for (key in fileExtPatterns) {
      if (fileExtPatterns[key].test(url)) {
        type = key;
        break;
      }
    }
    return type
  },

  // 重置表单对象数据
  resetData(obj, customValue) {
    let key, item, value;
    for (key in obj) {
      item = obj[key];
      if (customValue && (key in customValue)) {
        value = customValue[key];
      } else if (item instanceof Array) {
        value = [];
      } else {
        const datatype = typeof item;
        value = datatype === 'object' ? {} : datatype === 'number' ? 0 : '';
      }
      obj[key] = value;
    }
    return obj;
  },

};


export default {
  install(Vue) {
    Vue.prototype.$fn = tools;
  }
}
