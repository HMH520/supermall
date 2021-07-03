import Vue from 'vue'
import App from './App.vue'
import router from "@/router";
import store from "@/store";

import FastClick from 'fastclick'
import VueLazyload from "vue-lazyload";

import toast from 'components/common/toast'

Vue.config.productionTip = false
//安装toast插件
Vue.use(toast)
//安装图片懒加载插件
Vue.use(VueLazyload, {
  loading: require('./assets/img/common/placeholder.png')
})
//解决移动段300ms延迟问题
FastClick.attach(document.body)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
