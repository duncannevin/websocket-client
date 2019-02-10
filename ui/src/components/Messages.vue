<template>
  <b-list-group>
    <b-list-group-item
      v-for="(message, ind) in messages"
      :key="'message-' + ind"
      :class="message.level"
    >
      {{message.content}}
    </b-list-group-item>
  </b-list-group>
</template>

<script>
export default {
  name: 'Messages',
  computed: {
    messages () {
      return this.$store.getters.getMessages
    }
  }
}
</script>

<style scoped lang="sass">
@import "../styles/custom-bootstrap"
.list-group
  position: absolute
  top: 0
  left: 0
  z-index: 100
  .list-group-item
    color: $green
    background-color: $black
  .success
    color: $green
  .warn
    color: $red
</style>
