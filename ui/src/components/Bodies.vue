<template>
<b-row class="section">
  <b-col>
    <b-tabs
      :no-key-nav="true"
    >
      <b-tab
        v-for="(tab, ind) in bodies"
        :key="'bodies-tab-' + ind"
        :active="activeTab === ind"
        @click="activeTab = ind"
      >
        <template slot="title">
          <span class="tab-name">{{tab.name}}</span>
          <span class="delete-button" @click="deleteBody(tab._id)">&#215;</span>
        </template>
        <b-row>
          <div class="section display">
            <ace-editor
              v-model="tab.content"
              @init="editorInit"
              :theme="theme"
              :lang="tab.lang"
              height="100%"
              width="100%"
            ></ace-editor>
            <b-button-group class="section-controls" size="sm">
              <b-dropdown right :text="tab.lang.toUpperCase()">
                <b-dropdown-item
                  v-for="langOpt in langs"
                  :key="langOpt"
                  @click="tab.lang = langOpt"
                >{{langOpt.toUpperCase()}}</b-dropdown-item>
              </b-dropdown>
              <b-button class="send-btn" variant="success" :disabled="!ws.connected" @click="ws.send(tab)">Send</b-button>
            </b-button-group>
          </div>
        </b-row>
      </b-tab>
      <b-nav-item slot="tabs" @click.prevent="newBody" href="#">
        <div class="add-icon">+</div>
      </b-nav-item>
      <div slot="empty" class="text-center text-muted">
        No bodies yet<span class="loader-dot">.</span><span class="loader-dot">.</span><span class="loader-dot">.</span>

        <br> Open a new tab using <span class="add-icon">+</span> button.
      </div>
    </b-tabs>
  </b-col>
</b-row>
</template>

<script>
import AceEditor from 'vue2-ace-editor'
export default {
  name: 'Bodies',
  computed: {
    authenticated () {
      return this.$store.getters.getAuthenticated
    },
    activeTab: {
      get () {
        return this.$store.getters.getBodiesTab
      },
      set (index) {
        return this.$store.dispatch('setBodiesTab', index)
      }
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
    newBody () {
      if (!this.authenticated) {
        this.$store.dispatch('setQueuedNext', () => {
          this.$root.$emit('bv::show::modal', 'Add-body')
          this.$store.dispatch('setQueuedNext', () => {})
        })
        this.$root.$emit('bv::show::modal', 'Auth')
      } else {
        this.$root.$emit('bv::show::modal', 'Add-body')
      }
    },
    deleteBody (bodyId) {
      this.$store.dispatch('removeBody', { bodyId })
    }
  },
  components: {
    AceEditor
  },
  props: ['bodies', 'responses', 'ws']
}
</script>

<style scoped lang="sass">
</style>
