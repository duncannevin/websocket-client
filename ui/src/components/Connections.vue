<template>
<div id="Connections" class="col-9">
  <b-tabs
    :no-key-nav="true"
  >
    <b-tab
      v-for="(connection, ind) in connections"
      :key="'connection-tab-' + ind"
      :active="openTab === ind"
      @click="openTab = ind"
    >
      <template slot="title">
        <span
          class="tab-name"
          @dblclick="renameConnection($event, ind)">
          {{connection.name}}
        </span>
        <span class="delete-button" @click="deleteConnection(ind)">&#215;</span>
      </template>
      <connection
        :connection="connection"
        :authentcated="authenticated"
      ></connection>
    </b-tab>
    <b-nav-item slot="tabs" @click.prevent="newConnection" href="#">
      <div class="add-icon">+</div>
    </b-nav-item>
    <div slot="empty" class="text-center text-muted">
      No connections yet<span class="loader-dot">.</span><span class="loader-dot">.</span><span class="loader-dot">.</span>
      <br> Open a new tab using <span class="add-icon" @click="newConnection">+</span> button.
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
    },
    authenticated () {
      return this.$store.getters.getAuthenticated
    },
    openTab: {
      get () {
        return this.$store.getters.getConnectionTab
      },
      set (ind) {
        this.$store.dispatch('setConnectionTab', ind)
      }
    }
  },
  methods: {
    newConnection () {
      this.$root.$emit('bv::show::modal', 'Add-connection')
    },
    deleteConnection (ind) {
      this.connections.splice(ind, 1)
    },
    renameConnection (evt, ind) {
      console.log('RENAME CONNECTION', ind)
    }
  },
  components: {
    Connection
  }
}
</script>

<style scoped lang="sass">
#Connections
  margin: 0 auto
</style>
