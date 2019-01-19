<template>
<div id="Connections" class="container">
  <b-tabs>
    <b-tab
      v-for="(connection, ind) in connections.tabs"
      :key="'connection-tab-' + ind"
      :title="connection.name"
      :active="openTab === ind"
      @click="selectConnection"
    >
      <connection
        :url-data="connection.urlData"
        :request-data="connection.requestData"
        :response-data="connection.responseData"
      ></connection>
    </b-tab>
    <b-tab
      title="+"
    ></b-tab>
  </b-tabs>
</div>
</template>

<script>
import Connection from './Connection'
export default {
  name: 'Connections',
  computed: {
    connections () {
      return this.$store.getters.getConnections
    }
  },
  data () {
    return {
      openTab: 0
    }
  },
  methods: {
    selectConnection (index) {
      this.openTab = index
    }
  },
  components: {
    Connection
  }
}
</script>

<style scoped lang="sass">

</style>
