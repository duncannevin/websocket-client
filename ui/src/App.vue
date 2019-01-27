<template>
  <div id="app" class="container-fluid">
    <navbar></navbar>
    <router-view/>
  </div>
</template>

<script>
import Navbar from './components/Navbar'
export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style lang="sass">
@import '../../node_modules/bootstrap/scss/bootstrap.scss'
@import '../../node_modules/bootstrap-vue/dist/bootstrap-vue.css'
@import './styles/normalize.sass'
@import './styles/custom-bootstrap.sass'
@import './styles/variables.sass'
@import './styles/editor'
body
  background: $black
  font-family: $font-family-monospace
.container-fluid
  padding-left: 0
  padding-right: 0
.section
  display: flex
  justify-content: center
  margin: 1rem 0
  div
    padding: 0
  .control-buttons
    display: flex
    flex-direction: column
    justify-content: space-between
.col
  padding: 0
.form-control:disabled
  opacity: 0.8
.nav-tabs
  border-bottom: none
  .nav-item
    .nav-link
      color: $white
      background-color: transparent
      border: none
      padding: 0
      margin-right: 1rem
    .delete-button
      color: $red
    .nav-link.active
      color: $green
      border-bottom: 3px solid $green
</style>
