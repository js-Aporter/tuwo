import Mock from 'mockjs'

const Random = Mock.Random;

Mock.mock('/table', 'post', function (options) {
  const date = new Date().toLocaleString(),
    total = Random.int(5, 20);

  options.params = JSON.parse(options.body).data;

  return {
    code: 0,
    data: {
      total,
      list: new Array(total).toString().split(',').map((item, index) => ({
        date,
        id: index + 1,
        $: Random.string()
      }))
    }
  }
});


//
console.warn('当前正在使用 mock.js 拦截请求并模拟数据, 生产环境请关闭这个引用并且注释相关源代码');
