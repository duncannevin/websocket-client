import Vuex from 'vuex'
import Vue from 'vue'
import Ws from '../services/Ws'
import { makeResizable, formatResponse } from '../utils'
import axios from 'axios'

const connectionPath = '/connection'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    connections: [],
    authenticated: false,
    connectionTab: 0
  },
  mutations: {
    PUSH_RESPONSE (state, { connectionName, name, lang, wsSent, wsResponse }) {
      const connection = state.connections.find((c) => c.name === connectionName)
      const response = connection.responses.find((r) => r.bodyName === name)
      if (connection && response) {
        response.contents.unshift({ lang, wsSent, wsResponse: formatResponse({ lang, wsResponse }) })
        setTimeout(makeResizable, 200)
      } else {
        console.log('need to implement')
      }
    },
    CREATE_CONNECTION (state, { name, url }) {
      return new Promise((resolve) => {
        axios.post(connectionPath + '/create_connection', { name, url })
          .then(({ data }) => {
            data.ws = new Ws(data.name, data.url)
            state.connections.push(data)
            state.connectionTab = state.connections.length - 1
            resolve()
          })
          .catch(console.error)
      })
    },
    CREATE_BODY (state, { connectionId, name, lang }) {
      return new Promise((resolve) => {
        axios.post(connectionPath + '/create_body', { connectionId, name, lang })
          .then(({ data }) => {
            state.connections[state.connectionTab].bodies.push(data)
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
    createConnection ({ commit }, { name, url }) {
      commit('CREATE_CONNECTION', { name, url })
    },
    createBody ({ commit }, { name, url }) {
      commit('CREATE_BODY', { name, url })
    },
    setConnectionTab ({ commit }, index) {
      commit('SET_CONNECTION_TAB', index)
    }
  },
  getters: {
    getConnections: state => state.connections,
    getAuthenticated: state => state.authenticated,
    getConnectionTab: state => state.connectionTab
  }
})
