import Vue from 'vue'
import App from './App'
import store from './store';
Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'
// import vConsole from './common/vconsole.min.js';
// var VConsole = new vConsole();

const app = new Vue({
	store,
	...App
})
app.$mount()
