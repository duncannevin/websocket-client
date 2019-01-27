<template>
<b-row class="section">
  <b-col>
    <b-tabs
      :no-key-nav="true"
    >
      <b-tab
        v-for="(tab, ind) in responseData.responses"
        :key="'response-tab-' + ind"
        :title="'RES:' + tab.bodyName"
        @click="activeTab = ind"
      >
        <template slot="title">
          <span class="tab-name">{{tab.bodyName}}</span>
          <span class="delete-button" @click="deleteResponse(ind)">&#215;</span>
        </template>
        <b-row class="section">
          <b-col cols="8" class="response-editor">
            <ace-editor
              v-model="tab.content"
              @init="editorInit"
              :theme="theme"
              :lang="tab.lang"
              height="400px"
              width="100%"
            ></ace-editor>
          </b-col>
          <b-col cols="4" class="control-buttons">
            <b-button-group vertical>
              <b-dropdown right :text="tab.lang.toUpperCase()">
                <b-dropdown-item
                  v-for="langOpt in langs"
                  :key="langOpt"
                  @click="tab.lang = langOpt"
                >{{langOpt.toUpperCase()}}</b-dropdown-item>
              </b-dropdown>
            </b-button-group>
          </b-col>
        </b-row>
      </b-tab>
    </b-tabs>
  </b-col>
</b-row>
</template>

<script>
import AceEditor from 'vue2-ace-editor'
import xmlFormat from 'xml-formatter'
export default {
  name: 'ResponseSection',
  data () {
    this.formatData()
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
    },
    formatData () {
      return this.responseData.responses.map((rd) => {
        const formattedContent = rd.lang === 'json'
          ? this.prettyPrintJSON(rd.content) : rd.lang === 'xml'
            ? xmlFormat(rd.content) : rd.content
        return Object.assign(rd, {content: formattedContent})
      })
    },
    prettyPrintJSON (json) {
      try {
        return JSON.stringify(JSON.parse(json), null, '\t')
      } catch (_) {
        return json
      }
    },
    deleteResponse (ind) {
      this.responseData.responses.splice(ind, 1)
    }
  },
  components: {
    AceEditor
  },
  props: ['responseData']
}
</script>

<style scoped lang="sass">
.response-editor:hover
  cursor: not-allowed
</style>
