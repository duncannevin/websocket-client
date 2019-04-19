<template>
  <div></div>
</template>

<script>
export default {
  name: 'Callback',
  async mounted () {
    const userId = window.location.hash.split('?userid=').pop()
    await this.$store.dispatch('socialAuth', { userId })
    this.$router.push({path: '/'})
  }
}
</script>

<style scoped>

</style>
