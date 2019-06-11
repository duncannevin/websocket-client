<template>
<b-row class="section">
  <b-col>
    <b-row>
      <div class="section display">
        <ace-editor
          v-model="bodyData.content"
          @init="editorInit"
          :theme="theme"
          :lang="format"
          height="100%"
          width="100%"
          @keyup.native="saveBody($store)"
        ></ace-editor>
        <b-button-group class="section-controls" size="sm">
          <b-button class="send-btn" variant="success" :disabled="!ws.connected" @click="ws.send(bodyData)">Send</b-button>
        </b-button-group>
      </div>
    </b-row>
  </b-col>
</b-row>
</template>

<script>
import AceEditor from 'vue2-ace-editor'
import {throttle, detectFormat} from '../utils'
export default {
  name: 'WSBody',
  computed: {
    format () {
      return detectFormat(this.bodyData.content)
    }
  },
  data () {
    return {
      theme: 'monokai',
      themes: ['monokai', 'chrome'],
      langs: ['json', 'xml', 'plain_text']
    }
  },
  methods: {
    editorInit (editor) {
      require('brace/ext/language_tools')
      require('brace/mode/xml')
      require('brace/mode/json')
      require('brace/mode/plain_text')
      require('brace/theme/monokai')
      require('brace/theme/chrome')
      require('brace/snippets/javascript')
      editor.setShowPrintMargin(false)
      editor.setOption('highlightActiveLine', false)
      editor.renderer.setScrollMargin(0, 100, 0, 0)
    },
    saveBody: throttle(($store) => {
      $store.dispatch('updateBody')
    }, 80)
  },
  components: {
    AceEditor
  },
  props: ['ws', 'bodyData']
}
</script>

<style scoped lang="sass">
</style>
