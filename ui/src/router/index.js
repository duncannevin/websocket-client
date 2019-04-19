import Vue from 'vue'
import Router from 'vue-router'
import Connections from '../components/Connections'
import BootstrapVue from 'bootstrap-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowAltCircleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import vuelidate from 'vuelidate'
import SocialRedirect from '../components/SocialRedirect'

require('jquery-ui-dist/jquery-ui.css')
require('jquery-ui-dist/jquery-ui')

library.add(faArrowAltCircleDown)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(BootstrapVue)
Vue.use(Router)
Vue.use(vuelidate)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Connections',
      component: Connections
    },
    {
      path: '/socialredirect',
      name: 'SocialRedirect',
      component: SocialRedirect
    }
  ]
})
