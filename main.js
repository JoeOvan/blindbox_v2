import Vue from 'vue'
import App from './App'
import isWechat from './common/isWechat.js'
// import MinCache from './common/cache.js'
// import store from './store'
import cuCustom from './colorui/components/cu-custom.vue'
import { request,API_URL } from './util/api.js'


// 注册缓存器
// Vue.use(MinCache)
// 设置默认缓存时间
// Vue.use(MinCache, {timeout: 1000})

Vue.component('cu-custom',cuCustom)

Vue.mixin(isWechat)

// Vue.prototype.$isWechat = isWechat
// Vue.prototype.$store = store
Vue.prototype.$request = request
Vue.prototype.$url = API_URL

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	// store, //store 对象
    ...App
})
app.$mount()
