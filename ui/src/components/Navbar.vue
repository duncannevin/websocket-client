<template>
  <b-navbar variant="faded" type="dark">
    <b-navbar-brand href="#">
      <img class="ws-client-icon" src="../../static/websocket-client-icon.png">
      Websocket Client
    </b-navbar-brand>
    <b-navbar-nav class="ml-auto">
      <b-nav-item v-if="!authenticated" @click="openAuth">SIGN IN</b-nav-item>
      <b-nav-item v-else @click="logout">SIGN OUT {{user.name.toUpperCase()}}</b-nav-item>
    </b-navbar-nav>
</b-navbar>
</template>

<script>
export default {
  name: 'Navbar',
  computed: {
    authenticated () {
      return this.$store.getters.getAuthenticated
    },
    user () {
      return this.$store.getters.getUser
    }
  },
  methods: {
    openAuth () {
      this.$root.$emit('bv::show::modal', 'Auth')
    },
    logout () {
      this.$store.dispatch('logout')
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style scoped lang="sass">
@import "../styles/custom-bootstrap"
.nav-link
  position: relative
  color: $white!important
  font-weight: $bold
  &::after
    content: ""
    position: absolute
    left: 0
    right: 0
    top: 80%
    height: 2px
    background-color: $white
.ws-client-icon
  height: 2rem
  width: auto
</style>
