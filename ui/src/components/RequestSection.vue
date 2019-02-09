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
        <bodies v-if="tab[0] === 'bodies'" :ws="connection.ws" :bodies="tab[1]" :responses="tab[2]"></bodies>
        <cookies v-if="tab[0] === 'cookies'" :cookies="tab[1]"></cookies>
        <headers v-if="tab[0] === 'headers'" :headers="tab[1]"></headers>
      </b-tab>
    </b-tabs>
  </b-col>
</b-row>
</template>

<script>
import Bodies from './Bodies'
import Cookies from './Cookies'
import Headers from './Headers'
export default {
  name: 'RequestSection',
  computed: {
    dataInOrder () {
      return [['bodies', this.connection.bodies, this.connection.responses], ['cookies', this.connection.cookies], ['headers', this.connection.headers]]
    }
  },
  data () {
    return {
      activeTab: 'cookies'
    }
  },
  components: {
    Bodies,
    Cookies,
    Headers
  },
  props: ['connection', 'authenticated']
}
</script>

<style scoped>

</style>
