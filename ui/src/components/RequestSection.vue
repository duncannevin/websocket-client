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
        <bodies v-if="tab[0] === 'bodies'" :bodies="tab[1]"></bodies>
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
      return Object.keys(this.requestData)
        .sort()
        .map((key) => {
          return [key, this.requestData[key]]
        })
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
  props: ['requestData']
}
</script>

<style scoped>

</style>
