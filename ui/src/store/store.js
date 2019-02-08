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
    connectionTab: 0,
    bodiesTab: 0,
    responsesTab: 0
  },
  mutations: {
    PUSH_RESPONSE (state, { connectionName, _id, lang, wsSent, wsResponse }) {
      const connection = state.connections.find((c) => c.name === connectionName)
      const response = connection.responses.find((r) => r.bodyId === _id)
      response.contents.unshift({ lang, wsSent, wsResponse: formatResponse({ lang, wsResponse }) })
      setTimeout(makeResizable, 200)
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
          .then(({ data: {wsBody, wsResponse} }) => {
            state.connections[state.connectionTab].bodies.push(wsBody)
            state.connections[state.connectionTab].responses.push(wsResponse)
            setTimeout(() => {
              state.bodiesTab = state.connections[state.connectionTab].bodies.length - 1
              state.responsesTab = state.connections[state.connectionTab].responses.length - 1
            }, 80)
            resolve()
          })
          .catch(console.error)
      })
    },
    SET_CONNECTION_TAB (state, index) {
      state.connectionTab = index
    },
    SET_BODIES_TAB (state, index) {
      state.responsesTab = index
      state.bodiesTab = index
    },
    SET_RESPONSES_TAB (state, index) {
      state.responsesTabe = index
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
    },
    setBodiesTab ({ commit }, index) {
      commit('SET_BODIES_TAB', index)
    },
    setResponsesTab ({ commit }, index) {
      commit('SET_RESPONSES_TAB', index)
    }
  },
  getters: {
    getConnections: state => state.connections,
    getAuthenticated: state => state.authenticated,
    getConnectionTab: state => state.connectionTab,
    getBodiesTab: state => state.bodiesTab,
    getResponsesTab: state => state.responsesTab
  }
})
