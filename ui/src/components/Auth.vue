<template>
  <b-modal id="Auth" :title="parsedMode" :lazy="true" hide-footer @hidden="mode = 'sign_up'">
    <b-container fluid>
      <b-row class="my-1" v-if="mode === 'sign_up'">
        <b-col sm="3"><label for="Auth-name">name:</label></b-col>
        <b-col sm="9">
          <b-form-input id="Auth-name" size="sm" type="text" v-model="form.name"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label for="Auth-email">email:</label></b-col>
        <b-col sm="9">
          <b-form-input id="Auth-email" size="sm" type="text" v-model="form.email"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label for="Auth-password">password:</label></b-col>
        <b-col sm="9">
          <b-form-input id="Auth-password" size="sm" type="text" v-model="form.password"></b-form-input>
        </b-col>
      </b-row>
      <b-btn class="mt-3" variant="outline-success" block>{{parsedMode.toUpperCase()}}</b-btn>
      <b-row>
        <br>
        or
        <br>
      </b-row>
      <b-btn class="mt-3" variant="outline-success" block>
        <i class="fab fa-github"></i>
        {{mode.split('_').join(' ').toUpperCase()}} WITH GITHUB
      </b-btn>
      <b-row style="margin-top: 2rem;">
        <a href="#" @click="mode = mode === 'sign_up' ? 'sign_in' : 'sign_up'">
          {{mode === 'sign_up' ? 'Already have an account?' : 'Back to sign up'}}
        </a>
      </b-row>
      <b-row style="margin-top: 1rem;" v-if="mode === 'sign_up'">
        <a href="#" @click="closeAuth">I don't need to store my work</a>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
export default {
  name: 'Auth',
  computed: {
    parsedMode () {
      return this.mode.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
    },
    queuedNext () {
      return this.$store.getters.getQueuedNext
    }
  },
  data () {
    return {
      mode: 'sign_up',
      form: {
        name: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    signUp () {},
    signIn () {},
    closeAuth () {
      this.$root.$emit('bv::hide::modal', 'Auth')
      this.queuedNext()
    }
  }
}
</script>

<style scoped lang="sass">
.row
  justify-content: center!important
  div
    padding: 0
.auth-btn
  width: 100%
</style>
