<template>
<b-row class="section">
  <b-col>
    <b-tabs>
      <b-tab
        v-for="(tab, ind) in responseData.responses"
        :key="'response-tab-' + ind"
        :title="'RES:' + tab.bodyName"
        :active="activeTab === ind"
        @click="activeTab = ind"
      >
        <b-row>
          <b-col cols="12">
            <ace-editor
              v-model="tab.content"
              @init="editorInit"
              :theme="theme"
              :lang="tab.lang"
              height="800px"
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
import xmlFormat from 'xml-formatter'
export default {
  name: 'ResponseSection',
  data () {
    this.formatData()
    return {
      activeTab: 0,
      theme: 'monokai'
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
    }
  },
  components: {
    AceEditor
  },
  props: ['responseData']
}
</script>

<style scoped>

</style>
