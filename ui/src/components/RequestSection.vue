<template>
<b-row class="section">
  <b-col>
    <b-tabs>
      <b-tab
        v-for="(tab, ind) in dataInOrder"
        :key="'request-tab-' + ind"
        :title="tab[0]"
        :active="activeTab === ind"
        @click="activeTab = ind"
      >
        <ws-body v-if="tab[0] === 'body'" :ws="connection.ws" :body-data="tab[1]"></ws-body>
        <cookies v-if="tab[0] === 'cookies'" :cookies="tab[1]"></cookies>
      </b-tab>
    </b-tabs>
  </b-col>
</b-row>
</template>

<script>
import WSBody from './WSBody'
import Cookies from './Cookies'
export default {
  name: 'RequestSection',
  computed: {
    dataInOrder () {
      return [['body', this.connection.body], ['cookies', this.connection.cookies]]
    }
  },
  data () {
    return {
      activeTab: 'cookies'
    }
  },
  components: {
    WsBody: WSBody,
    Cookies
  },
  props: ['connection', 'authenticated']
}
</script>

<style scoped>

</style>
