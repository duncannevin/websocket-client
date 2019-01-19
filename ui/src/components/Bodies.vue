<template>
<b-row class="section">
  <b-col>
    <b-tabs>
      <b-tab
        v-for="(tab, ind) in bodies"
        :key="'bodies-tab-' + ind"
        :title="tab.name"
        :active="activeTab === ind"
        @click="activeTab = ind"
      >
        <b-row>
          <b-col cols="10" style="padding-right: 0;">
            <ace-editor
              v-model="tab.content"
              @init="editorInit"
              :theme="theme"
              :lang="tab.lang"
              height="200px"
              width="100%"
            ></ace-editor>
          </b-col>
          <b-col cols="2" style="display: flex; flex-direction: column; justify-content: space-between;">
            <b-button-group vertical style="width: 100%;">
              <b-dropdown right split :text="theme.toUpperCase()">
                <b-dropdown-item
                  v-for="themeOpt in themes"
                  :key="themeOpt"
                  @click="theme = themeOpt"
                >{{themeOpt.toUpperCase()}}</b-dropdown-item>
              </b-dropdown>
              <b-dropdown right split :text="tab.lang.toUpperCase()">
                <b-dropdown-item
                  v-for="langOpt in langs"
                  :key="langOpt"
                  @click="tab.lang = langOpt"
                >{{langOpt.toUpperCase()}}</b-dropdown-item>
              </b-dropdown>
            </b-button-group>
            <b-button-group style="width: 100%;">
              <b-button variant="success">Send</b-button>
            </b-button-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
          </b-col>
        </b-row>
      </b-tab>
      <b-tab
        title="+"
      ></b-tab>
    </b-tabs>
  </b-col>
</b-row>
</template>

<script>
import AceEditor from 'vue2-ace-editor'
export default {
  name: 'Bodies',
  data () {
    return {
      activeTab: 0,
      theme: 'monokai',
      themes: ['monokai', 'chrome'],
      langs: ['json', 'xml', 'plain_text']
    }
  },
  methods: {
    editorInit () {
      require('brace/ext/language_tools')
      require('brace/mode/xml')
      require('brace/mode/json')
      require('brace/mode/plain_text')
      require('brace/theme/monokai')
      require('brace/theme/chrome')
      require('brace/snippets/javascript')
    }
  },
  components: {
    AceEditor
  },
  props: ['bodies']
}
</script>

<style scoped>

</style>
