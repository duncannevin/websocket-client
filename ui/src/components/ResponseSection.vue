<template>
<b-row class="section">
  <b-col>
    <b-tabs
      :no-key-nav="true"
    >
      <b-tab
        v-for="(response, rInd) in responses"
        :key="'response-tab-' + rInd"
        @click="activeTab = rInd"
      >
        <template slot="title">
          <span class="tab-name">{{response.bodyName}}</span>
        </template>
          <b-row
            v-for="(content, cInd) in response.contents"
            :key="'response-content-' + cInd"
            class="response-editor"
          >
            <div class="response-display ws-sent-display">
              <ace-editor
                :value="content.wsSent.content"
                @init="editorInit"
                :theme="theme"
                :lang="content.wsSent.lang"
                height="100%"
                width="100%"
              ></ace-editor>
              <span class="response-display-title">Sent</span>
            </div>
            <div class="response-display ws-response-display">
              <ace-editor
                v-model="content.wsResponse"
                @init="editorInit"
                :theme="theme"
                :lang="content.lang"
                height="100%"
                width="100%"
              ></ace-editor>
              <span class="response-display-title">Response</span>
              <b-button-group class="section-controls" size="sm">
                <b-dropdown right :text="content.lang.toUpperCase()">
                  <b-dropdown-item
                    v-for="(lang, ind) in langs"
                    :key="'response-lang-' + ind"
                    @click="changeLang(lang, response.contents[cInd])"
                  >{{lang.toUpperCase()}}</b-dropdown-item>
                </b-dropdown>
                <b-button class="delete-button" @click="deleteResponse(cInd, response.contents)">&#215;</b-button>
              </b-button-group>
            </div>
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
    },
    deleteResponse (ind, contents) {
      contents.splice(ind, 1)
    },
    changeLang (lang, res) {
      res.lang = lang
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
  position: relative
  overflow: hidden
  &:first-child .response-display
    height: 200px
  .response-display
    position: relative
    resize: vertical
    overflow: auto
    height: 100px
    .response-display-title
      position: absolute
      bottom: 0
      left: 24px
      color: $green
    .response-display-expand
      position: absolute
      color: $white
      font-size: 1.2rem
      bottom: 10px
      right: 0
      &:hover
        cursor: grab
      &:active
        cursor: grabbing
  .ws-sent-display, .ws-response-display
    display: inline
    float: left
  .ws-sent-display
    width: 35%
    max-width: 35%
  .ws-response-display
    width: 65%
    max-width: 65%
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
