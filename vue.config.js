module.exports = {
  devServer: {
    // disableHostCheck: true,
   //  host:'localhost',
   //  port:8080,
   //  proxy:{
   //    '/api':{
   //      target:'http://fd.winzkj.com/api',
		 // // target:'http://xiaoyouban.gdupt.edu.cn/api',
   //      // target:'http://192.168.2.110:8085',
   //      changeOrigin:true,
   //      pathRewrite:{
   //        '':''
   //      }
   //    }
   //  }
  },
  // "devServer": {
  // 		  "disableHostCheck": true,
  // 		  "host": "192.168.0.140"
  // },
  // publicPath: './',
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.plugins.delete('prefetch');
  }
}