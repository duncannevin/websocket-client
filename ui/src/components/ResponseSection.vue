<template>
<b-row class="section">
  <b-col>
    <b-tabs
      :no-key-nav="true"
    >
      <b-tab
        v-for="(tab, rInd) in responses"
        :key="'response-tab-' + rInd"
        @click="activeTab = rInd"
      >
        <template slot="title">
          <span class="tab-name">{{tab.bodyName}}</span>
        </template>
          <transition-group name="list" tag="div">
            <b-col
              v-for="(res, cInd) in tab.contents"
              :key="'response-content-' + cInd"
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
              <b-button-group class="section-controls" size="sm">
                <b-dropdown right :text="res.lang.toUpperCase()">
                  <b-dropdown-item
                    v-for="(lang, ind) in langs"
                    :key="'response-lang-' + ind"
                    @click="changeLang(lang, tab.contents[cInd])"
                  >{{lang.toUpperCase()}}</b-dropdown-item>
                </b-dropdown>
                <b-button class="delete-button" @click="deleteResponse(cInd, tab.contents)">&#215;</b-button>
              </b-button-group>
            </b-col>
          </transition-group>
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
