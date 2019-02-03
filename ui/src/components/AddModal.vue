<template>
<div>
  <b-modal id="Add-connection" title="Add Connection" :lazy="true" @ok="addConnection">
    <b-container fluid>
      <b-row class="my-1">
        <b-col sm="2"><label for="input-small">Name:</label></b-col>
        <b-col sm="10">
          <b-form-input size="sm" type="text" v-model="name"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="2"><label for="input-small">Url:</label></b-col>
        <b-col sm="10">
          <b-form-input size="sm" type="text" v-model="url"></b-form-input>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
  <b-modal id="Add-body" title="Add Body" :lazy="true">
    <p class="my-4">Hello from modal!</p>
  </b-modal>
</div>
</template>

<script>
export default {
  name: 'AddModal',
  data () {
    return {
      name: 'untitled',
      url: 'ws://echo.websocket.org'
    }
  },
  methods: {
    addConnection () {
      this.$store.dispatch('createConnection', {name: this.name, url: this.url})
      this.name = 'untitled'
      this.url = 'ws://echo.websocket.org'
    }
  }
}
</script>

<style scoped>

</style>
