import Vuex from 'vuex'
import Vue from 'vue'
import Ws from '../services/Ws'
import xmlFormat from 'xml-formatter'

Vue.use(Vuex)

function prettyPrintJSON (json) {
  try {
    return JSON.stringify(JSON.parse(json), null, '\t')
  } catch (_) {
    return json
  }
}

function formatResponse ({lang, content}) {
  const formattedContent = lang === 'json'
    ? prettyPrintJSON(content) : lang === 'xml'
      ? xmlFormat(content) : content
  return {lang, content: formattedContent}
}

export default new Vuex.Store({
  state: {
    connections: [
      {
        name: 'default',
        url: 'ws://echo.websocket.org',
        ws: new Ws('default', 'ws://echo.websocket.org'),
        cookies: [],
        headers: [],
        bodies: [
          {
            name: 'default-body',
            lang: 'json',
            content: '{"websockets": "rock!"}'
          }
        ],
        responses: [
          { // anytime a body is added, add this
            bodyName: 'default-body',
            lang: 'json',
            contents: []
          }
        ]
      }
    ],
    authenticated: false
  },
  mutations: {
    PUSH_RESPONSE (state, {connectionName, name, lang, content}) {
      const connection = state.connections.find((c) => c.name === connectionName)
      const response = connection.responses.find((r) => r.bodyName === name)
      if (connection && response) {
        response.contents.unshift(formatResponse({ lang, content }))
      }
    }
  },
  actions: {
    pushResponse ({ commit }, args) {
      commit('PUSH_RESPONSE', args)
    },
    openSocket ({ commit }, args) {
      commit('OPEN_SOCKET', args)
    }
  },
  getters: {
    getConnections: state => state.connections,
    getAuthenticated: state => state.authenticated
  }
})
