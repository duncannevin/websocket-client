<template>
  <b-row class="section">
    <b-col>
      <b-row
        v-for="(header, ind) in headers"
        :key="'header-' + ind"
        class="section"
      >
        <b-col class="cookie-col" cols="5">
          <b-input-group>
            <b-form-input :value="Object.keys(header)[0]" :disabled="true"></b-form-input>
          </b-input-group>
        </b-col>
        <b-col class="cookie-col" cols="5">
          <b-input-group>
            <b-form-input :value="Object.values(header)[0]" :disabled="true"></b-form-input>
          </b-input-group>
        </b-col>
        <b-col class="cookie-col" cols="2">
          <b-input-group>
            <b-btn variant="warning">Remove</b-btn>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row class="section">
        <b-col class="cookie-col" cols="5">
          <b-input-group>
            <b-form-input v-model="newHeader.key"></b-form-input>
          </b-input-group>
        </b-col>
        <b-col class="cookie-col" cols="5">
          <b-input-group>
            <b-form-input v-model="newHeader.value"></b-form-input>
          </b-input-group>
        </b-col>
        <b-col class="cookie-col" cols="2">
          <b-input-group>
            <b-btn variant="success">Add</b-btn>
          </b-input-group>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'Headers',
  data () {
    return {
      newHeader: {key: 'value'}
    }
  },
  props: ['headers']
}
</script>

<style scoped lang="sass">
.col-5, .col-2
  padding: 0
  .input-group
    .btn
      width: 100%
      border-bottom-left-radius: 0
      border-top-left-radius: 0
.col-5:first-child
  .input-group
    .form-control
      border-bottom-right-radius: 0
      border-top-right-radius: 0
.col-5:nth-child(2)
  .input-group
    .form-control
      border-radius: 0
</style>
