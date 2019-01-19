<template>
<div class="container connection">
  <url-section :url-data="urlData"></url-section>
  <request-section :request-data="requestData"></request-section>
  <response-section :response-data="responseData"></response-section>
</div>
</template>

<script>
import UrlSection from './UrlSection'
import RequestSection from './RequestSection'
import ResponseSection from './ResponseSection'
export default {
  name: 'Connection',
  components: {
    UrlSection,
    RequestSection,
    ResponseSection
  },
  props: ['urlData', 'requestData', 'responseData']
}
</script>

<style scoped lang="sass">

</style>
