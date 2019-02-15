<template>
<div class="container connection">
  <b-row class="section url-bar">
    <b-col lg="8">
      <b-input-group prepend="Location">
        <b-form-input v-model="connection.ws.connection"></b-form-input>
        <b-input-group-append>
          <b-btn v-if="!connection.ws.connected" variant="success" @click="connection.ws.openSocket">Connect</b-btn>
          <b-btn v-else variant="warning" @click="connection.ws.closeSocket">Disconnect</b-btn>
        </b-input-group-append>
      </b-input-group>
    </b-col>
  </b-row>
  <request-section :connection="connection" :connection-name="connection.name" :authenticated="authenticated"></request-section>
  <response-section :responses="connection.responses" :authenticated="authenticated"></response-section>
</div>
</template>

<script>
import RequestSection from './RequestSection'
import ResponseSection from './ResponseSection'
export default {
  name: 'Connection',
  components: {
    RequestSection,
    ResponseSection
  },
  props: ['connection', 'authenticated']
}
</script>

<style scoped lang="sass">
.url-bar
  justify-content: center
</style>
