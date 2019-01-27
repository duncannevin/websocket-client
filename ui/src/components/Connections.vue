<template>
<div id="Connections" class="container">
  <b-tabs
    :no-key-nav="true"
  >
    <b-tab
      v-for="(connection, ind) in connections.tabs"
      :key="'connection-tab-' + ind"
      :active="openTab === ind"
      @click="selectConnection"
    >
      <template slot="title">
        <span class="tab-name">{{connection.name}}</span>
        <span class="delete-button" @click="deleteConnection(ind)">&#215;</span>
      </template>
      <connection
        :url-data="connection.urlData"
        :request-data="connection.requestData"
        :response-data="connection.responseData"
      ></connection>
    </b-tab>
    <b-nav-item slot="tabs" @click.prevent="newConnection" href="#">
      +
    </b-nav-item>
    <div slot="empty" class="text-center text-muted">
      No connections yet...
      <br> Open a new tab using + button.
    </div>
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
    },
    newConnection () {
      console.log('NEW CONNECTION')
    },
    deleteConnection (ind) {
      this.connections.tabs.splice(ind, 1)
    }
  },
  components: {
    Connection
  }
}
</script>

<style scoped lang="sass">

</style>
