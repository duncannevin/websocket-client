<template>
  <div id="app" class="container">
    <add-modal></add-modal>
    <navbar></navbar>
    <router-view/>
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import {makeResizable} from './utils'
import AddModal from './components/AddModal'
export default {
  name: 'App',
  mounted () {
    makeResizable()
  },
  components: {
    Navbar,
    AddModal
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
  margin: 1rem 0
  div
    padding: 0
  .control-buttons
    display: flex
    flex-direction: column
    justify-content: space-between
.col
  padding: 0
.row
  margin-right: 0
  margin-left: 0
.ace_editor
  resize: vertical
.ace_content
  padding-bottom: 100px
.ace_scrollbar
  display: none
.form-control:disabled
  opacity: 0.8
.disabled:hover
  cursor: not-allowed
.delete-button
  color: $red
.modal-content
  background-color: $black
  color: $white
.add-icon:hover
  cursor: pointer
.add-icon
  font-size: 1.5rem
  color: $white
.nav-link .add-icon
  transform: translateY(-0.25rem)
.display
  position: relative
  height: 200px
  min-height: 100px
  width: 100%
  border-bottom: 3px solid $green
  .display-title
    position: absolute
    bottom: 0
    font-size: 0.85rem
    left: 30px
    color: $green
.nav-tabs
  border-bottom: none
  .nav-item
    .nav-link
      color: $white
      background-color: transparent
      border: none
      padding: 0
      margin-right: 1rem
    .nav-link.active
      color: $green
      border-bottom: 3px solid $green
.section-controls
  position: absolute
  top: 0
  right: 0
  .show > .btn-secondary.dropdown-toggle
    background-color: transparent
    border: none
  .btn
    font-size: 1rem
    font-weight: bold
    padding: 0 0 0 1rem
    height: min-content
    background-color: transparent
    border: none
  .btn:focus
    box-shadow: none
.animated
  animation-duration: 1s
  animation-fill-mode: both

@keyframes zoomIn
  from
    opacity: 0
    transform: scale3d(0.3, 0.3, 0.3)

  50%
    opacity: 1

.zoomIn
  animation-name: zoomIn
</style>
