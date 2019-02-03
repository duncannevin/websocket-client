import Vuex from 'vuex'
import Vue from 'vue'
import Ws from '../services/Ws'
import xmlFormat from 'xml-formatter'
import {makeResizable} from '../utils'
import axios from 'axios'

const connectionPath = '/connection'

Vue.use(Vuex)

function prettyPrintJSON (json) {
  try {
    return JSON.stringify(JSON.parse(json), null, '\t')
  } catch (_) {
    return json
  }
}

function formatResponse ({lang, wsResponse}) {
  return lang === 'json'
    ? prettyPrintJSON(wsResponse) : lang === 'xml'
      ? xmlFormat(wsResponse) : wsResponse
}

export default new Vuex.Store({
  state: {
    connections: [],
    authenticated: false,
    connectionTab: 0
  },
  mutations: {
    PUSH_RESPONSE (state, {connectionName, name, lang, wsSent, wsResponse}) {
      const connection = state.connections.find((c) => c.name === connectionName)
      const response = connection.responses.find((r) => r.bodyName === name)
      if (connection && response) {
        response.contents.unshift({lang, wsSent, wsResponse: formatResponse({lang, wsResponse})})
        console.log(JSON.stringify(response.contents, null, 2))
        setTimeout(makeResizable, 200)
      }
    },
    CREATE_CONNECTION (state, {name, url}) {
      return new Promise((resolve) => {
        axios.post(connectionPath + '/create_connection', {name, url})
          .then(({ data }) => {
            data.ws = new Ws(data.name, data.url)
            state.connections.push(data)
            state.connectionTab = state.connections.length - 1
            resolve()
          })
          .catch(console.error)
      })
    },
    SET_CONNECTION_TAB (state, index) {
      state.connectionTab = index
    }
  },
  actions: {
    pushResponse ({ commit }, args) {
      commit('PUSH_RESPONSE', args)
    },
    openSocket ({ commit }, args) {
      commit('OPEN_SOCKET', args)
    },
    createConnection ({commit}, {name, url}) {
      commit('CREATE_CONNECTION', {name, url})
    },
    setConnectionTab ({commit}, index) {
      commit('SET_CONNECTION_TAB', index)
    }
  },
  getters: {
    getConnections: state => state.connections,
    getAuthenticated: state => state.authenticated,
    getConnectionTab: state => state.connectionTab
  }
})
