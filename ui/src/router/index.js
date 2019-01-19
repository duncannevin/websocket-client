import Vue from 'vue'
import Router from 'vue-router'
import Connections from '../components/Connections'
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Connections',
      component: Connections
    }
  ]
})
