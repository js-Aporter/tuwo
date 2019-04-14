const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');
const package = require('../package.json');

fs.open('./build/env.js', 'w', function (err, fd) {
  const buf = 'export default "development";';
  fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer) {
  });
});

module.exports = merge(webpackBaseConfig, {

  /**
   * 开发环境启用代理
   *
   */
  devServer: {    
    // host: '192.168.0.53',
    proxy: {
      '/web': {
        target: 'http://192.168.0.8:40001',   // 后台接口 API 地址
        changeOrigin: true,
        // pathRewrite: {
          // '^/api': '/api'  // 重写路径，替换映射值
        // }
      },
      '/client': {
        target: 'http://192.168.0.8:40001',   // 后台接口 API 地址
        changeOrigin: true,
        // pathRewrite: {
          // '^/api': '/api'  // 重写路径，替换映射值
        // }
      },
      '/home': {
        target: 'http://192.168.0.8:40001',   // 后台接口 API 地址
        changeOrigin: true,
        // pathRewrite: {
          // '^/api': '/api'  // 重写路径，替换映射值
        // }
      },
      '/common': {
        target: 'http://192.168.0.8:40001',   // 后台接口 API 地址
        changeOrigin: true,
        // pathRewrite: {
          // '^/api': '/api'  // 重写路径，替换映射值
        // }
      }
    }
  },


  devtool: '#source-map',
  output: {
    publicPath: '/dist/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: ['vender-exten', 'vender-base'],
    //   minChunks: Infinity
    // }),
    new HtmlWebpackPlugin({
      title: 'iView admin v' + package.version,
      filename: '../index.html',
      inject: false
    }),
    // new CopyWebpackPlugin([
    //   //   {
    //   //     from: 'src/views/main-components/theme-switch/theme'
    //   //   },
    //   //   {
    //   //     from: 'src/views/my-components/text-editor/tinymce'
    //   //   }
    //   // {
    //   //   from: 'static',
    //   // }
    // ], {
    //   //   ignore: [
    //   //     'Index.vue'
    //   //   ]
    // })
  ]
});
