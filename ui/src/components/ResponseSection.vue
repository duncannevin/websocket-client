<template>
<b-row class="section">
  <b-col>
    <b-tabs>
      <b-tab
        title="responses"
      >
        <b-row class="section responses-section">
          <b-tabs
            :no-key-nav="true"
            v-model="activeTab"
          >
            <b-tab
              v-for="(response, rInd) in responses"
              :key="'response-tab-' + rInd"
            >
              <template slot="title">
                <span class="tab-name">{{response.bodyName}}</span>
              </template>
              <b-row v-if="!response.contents.length">
                <div class="text-center text-muted section">
                  Waiting for a response<span class="loader-dot">.</span><span class="loader-dot">.</span><span class="loader-dot">.</span>
                </div>
              </b-row>
              <b-col class="responses-container" v-else>
                <b-row
                  v-for="(content, cInd) in response.contents"
                  :key="'response-content-' + cInd"
                  class="section response-editor"
                >
                  <div class="display">
                    <div class="ws-response-display">
                      <ace-editor
                        v-model="content.wsResponse"
                        @init="editorInit"
                        :theme="theme"
                        :lang="getFormat(content.wsResponse)"
                        height="100%"
                        width="100%"
                      ></ace-editor>
                      <span class="display-title">Response</span>
                      <b-button-group class="section-controls" size="sm">
                        <b-button class="delete-button" @click="deleteResponse(response._id, content._id)">&#215;</b-button>
                      </b-button-group>
                    </div>
                  </div>
                </b-row>
              </b-col>
            </b-tab>
          </b-tabs>
        </b-row>
      </b-tab>
      <div v-if="!responses.length" class="text-center text-muted">
        This is where your responses will appear.
      </div>
    </b-tabs>
  </b-col>
</b-row>
</template>

<script>
import AceEditor from 'vue2-ace-editor'
import {detectFormat} from '../utils'
export default {
  name: 'ResponseSection',
  computed: {
    activeTab: {
      get () {
        return this.$store.getters.getResponsesTab
      },
      set (index) {
        this.$store.dispatch('setResponsesTab', index)
      }
    }
  },
  data () {
    return {
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
    deleteResponse (responseId, contentId) {
      this.$store.dispatch('removeResponse', { responseId, contentId })
    },
    changeLang (lang, res) {
      res.lang = lang
    },
    getFormat (txt) {
      return detectFormat(txt)
    }
  },
  components: {
    AceEditor
  },
  props: ['responses']
}
</script>

<style scoped lang="sass">
@import "../styles/custom-bootstrap"
.responses-section
  .tabs
    width: 100%
.responses-container
  .response-editor
    position: relative
    overflow: hidden
    &:not(:first-child) .display
      height: 100px
    .ws-response-display
      position: relative
      display: inline
      height: 100%
      float: left
      width: 100%
    &:hover
      cursor: not-allowed
.delete-button
  font-size: 2rem
  transform: translateY(-0.65rem)
.list-item
  display: block
  margin-right: 10px
.list-enter-active, .list-leave-active
  transition: all 1s
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */
  opacity: 0
  transform: translateX(30px)
</style>
