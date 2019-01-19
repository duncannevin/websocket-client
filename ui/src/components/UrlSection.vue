<template>
<b-row class="section">
  <b-col lg="8">
    <b-input-group prepend="Location">
      <b-form-input :value="urlData.url"></b-form-input>
      <b-input-group-append>
        <b-btn v-if="!urlData.connected" variant="success">Connect</b-btn>
        <b-btn v-else variant="warning">Disconnect</b-btn>
      </b-input-group-append>
    </b-input-group>
  </b-col>
</b-row>
</template>

<script>
export default {
  name: 'UrlSection',
  props: ['urlData']
}
</script>

<style scoped lang="sass">

</style>
