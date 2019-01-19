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
@import '../../node_modules/bootstrap/dist/css/bootstrap.css'
@import '../../node_modules/bootstrap-vue/dist/bootstrap-vue.css'
@import './styles/normalize.sass'
@import './styles/custom-bootstrap.sass'
@import './styles/variables.sass'
body
  background: $black
.container-fluid
  padding-left: 0
  padding-right: 0
.section
  display: flex
  justify-content: center
  margin: 1rem 0
</style>
