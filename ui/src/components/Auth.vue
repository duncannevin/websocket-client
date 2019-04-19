<template>
  <b-modal id="Auth" :title="parsedMode" :lazy="true" hide-footer @hidden="[mode = 'sign_up', _resetForm()]">
    <b-container fluid>
      <b-row class="my-1 auth-msg-center" v-if="authMessages.length">
        <p
          v-for="(msg, ind) in authMessages"
          :key="'auth-msg-' + ind"
          class="auth-msg"
          :class="msg.level"
        >
          {{msg.msg}}<span v-if="msg.level !== 'success' || msg.level !== 'failed'"><span class="loader-dot">.</span><span class="loader-dot">.</span><span class="loader-dot">.</span></span>
        </p>
      </b-row>
    </b-container>
    <b-container fluid>
      <b-row class="my-1" v-if="mode === 'sign_up'">
        <b-col sm="3"><label for="Auth-name">name:</label></b-col>
        <b-col sm="9">
          <b-form-input id="Auth-name" size="sm" type="text" v-model="$v.form.name.$model"></b-form-input>
          <div class="error" v-if="!$v.form.name.required">Required field.</div>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label for="Auth-email">email:</label></b-col>
        <b-col sm="9" :class="{ 'form-group--error': $v.form.email.$error, 'form-group--loading': $v.form.email.$pending }">
          <b-form-input id="Auth-email" size="sm" type="text" v-model.trim="$v.form.email.$model"></b-form-input>
          <div class="error" v-if="!$v.form.email.required">Required field.</div>
          <div class="error" v-if="!$v.form.email.email">Must be a valid email.</div>
          <div class="error" v-if="!$v.form.email.isUnique">This email is already registered.</div>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label for="Auth-password">password:</label></b-col>
        <b-col sm="9">
          <b-form-input id="Auth-password" :class="{ 'form-group--error': $v.form.email.$error, 'form-group--loading': $v.form.email.$pending } " size="sm" type="password" v-model.trim="$v.form.password.$model"></b-form-input>
          <div class="error" v-if="!$v.form.password.required">Required field.</div>
          <div class="error" v-if="!$v.form.password.minLength">Must be {{$v.form.password.$params.minLength.min}} characters long.</div>
          <div class="error" v-if="form.password.length && (!$v.form.password.containsNumber || !$v.form.password.containsSymbol)">Must contain 1 letter and symbol.</div>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-btn class="mt-3"  variant="outline-success" @click="(mode === 'sign_up' ? signUp : signIn)()" block>{{parsedMode.toUpperCase()}}</b-btn>
      </b-row>
      <b-row>
        <br>
        or
        <br>
      </b-row>
      <b-btn class="mt-3" variant="outline-success" @click="signInSocial" block>
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
import axios from 'axios'
import { email, minLength, required } from 'vuelidate/lib/validators'

export default {
  name: 'Auth',
  computed: {
    parsedMode () {
      return this.mode.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
    },
    queuedNext () {
      return this.$store.getters.getQueuedNext
    },
    authMessages () {
      return this.$store.getters.getAuthMessages
    }
  },
  data () {
    return {
      mode: 'sign_up',
      form: {
        name: '',
        email: '',
        password: ''
      },
      authMessage: ''
    }
  },
  validations: {
    form: {
      name: {
        required
      },
      email: {
        required,
        email,
        async isUnique (email) {
          const { data } = await axios.post('/auth/exists', { email })
          return !data
        }
      },
      password: {
        required,
        minLength: minLength(8),
        containsNumber (pw) {
          return !!pw.match(/[0-9]/)
        },
        containsSymbol (pw) {
          return !!pw.match(/\W+/)
        }
      }
    }
  },
  methods: {
    _resetForm () {
      this.$v.$reset()
      this.$store.dispatch('clearAuthMessages')
      this.form = {
        name: '',
        email: '',
        password: ''
      }
    },
    _cacheConnections () {
      localStorage.setItem('connections-cache', JSON.stringify(this.$store.getters.getConnections))
    },
    signUp () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this._cacheConnections()
        this.$store.dispatch('pushAuthMessage', { msg: 'Pending', level: 'pending' })
        this.$store.dispatch('localRegister', Object.assign({}, this.form))
      } else {
        this.$store.dispatch('pushAuthMessage', { msg: 'Form invalid', level: 'warn' })
      }
    },
    signIn () {
      console.log('sign in')
    },
    signInSocial () {
      this._cacheConnections()
      window.location = '/auth/github'
    },
    closeAuth () {
      this.$root.$emit('bv::hide::modal', 'Auth')
      this.queuedNext()
    }
  }
}
</script>

<style scoped lang="sass">
@import "../styles/custom-bootstrap"
.row
  justify-content: center!important
  div
    padding: 0
.auth-btn
  width: 100%
.error
  font-size: 0.9rem
  color: $red
.auth-msg-center
  padding: 1rem
  .warn, .failed
    color: $red
  .success
    color: $green
  .pending
    color: $yellow
</style>
