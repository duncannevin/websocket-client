<template>
<b-row class="section">
  <b-col>
    <b-tabs
      :no-key-nav="true"
    >
      <b-tab
        v-for="(tab, ind) in responses"
        :key="'response-tab-' + ind"
        @click="activeTab = ind"
      >
        <template slot="title">
          <span class="tab-name">{{tab.bodyName}}</span>
        </template>
        <b-row class="section">
          <b-col
            v-for="(res, ind) in tab.contents"
            :key="'response-content-' + ind"
            cols="12"
            class="response-editor"
          >
            <ace-editor
              v-model="res.content"
              @init="editorInit"
              :theme="theme"
              :lang="res.lang"
              height="200px"
              width="100%"
            ></ace-editor>
          </b-col>
        </b-row>
      </b-tab>
    </b-tabs>
  </b-col>
</b-row>
</template>

<script>
import AceEditor from 'vue2-ace-editor'
export default {
  name: 'ResponseSection',
  data () {
    return {
      activeTab: 0,
      theme: 'monokai',
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
      editor.container.style.pointerEvents = 'none'
      editor.renderer.setStyle('disabled', true)
      editor.renderer.$cursorLayer.element.style.display = 'none'
      editor.setOption('highlightActiveLine', false)
      editor.setShowPrintMargin(false)
    }
  },
  components: {
    AceEditor
  },
  props: ['responses', 'authenticated']
}
</script>

<style scoped lang="sass">
@import "../styles/custom-bootstrap"
.response-editor
  border-bottom: 3px solid $green
.response-editor:hover
  cursor: not-allowed
</style>
