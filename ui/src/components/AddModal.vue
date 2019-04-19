<template>
  <div>
    <b-modal id="Add-connection" title="Add Connection" :lazy="true" @ok="addConnection">
      <b-container fluid>
        <b-row class="my-1">
          <b-col sm="2"><label for="Add-name">Name:</label></b-col>
          <b-col sm="10">
            <b-form-input id="Add-name" size="sm" type="text" v-model="name"></b-form-input>
          </b-col>
        </b-row>
        <b-row class="my-1">
          <b-col sm="2"><label for="Add-url">Url:</label></b-col>
          <b-col sm="10">
            <b-form-input id="Add-url" size="sm" type="text" v-model="url"></b-form-input>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
    <b-modal id="Add-body" title="Add Body" :lazy="true" @ok="addBody">
      <b-row class="my-1">
        <b-col sm="2"><label for="Add-b-name">Name:</label></b-col>
        <b-col sm="10">
          <b-form-input id="Add-b-name" size="sm" type="text" v-model="name"></b-form-input>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'AddModal',
  computed: {
    connectionTabInd () {
      return this.$store.getters.getConnectionTab
    },
    currentConnectionId () {
      return this.$store.getters.getConnections[this.connectionTabInd]._id
    }
  },
  data () {
    return {
      name: 'untitled',
      url: 'ws://echo.websocket.org'
    }
  },
  methods: {
    addConnection () {
      this.$store.dispatch('createConnection', { name: this.name, url: this.url })
      this._resetData()
    },
    addBody () {
      this.$store.dispatch('createBody', { connectionId: this.currentConnectionId, name: this.name })
      this._resetData()
    },
    _resetData () {
      this.name = 'untitled'
      this.url = 'ws://echo.websocket.org'
    }
  }
}
</script>

<style scoped>

</style>
