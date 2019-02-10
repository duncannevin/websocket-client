import Vuex from 'vuex'
import Vue from 'vue'
import Ws from '../services/Ws'
import { formatResponse, makeResizable } from '../utils'
import axios from 'axios'

const connectionPath = '/connection'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    connections: [],
    authenticated: false,
    connectionTab: 0,
    bodiesTab: 0,
    responsesTab: 0,
    queuedNextAction: () => {},
    messages: []
  },
  mutations: {
    PUSH_RESPONSE (state, { connectionId, bodyId, lang, wsSent, wsResponse }) {
      const connection = state.connections.find((c) => c._id === connectionId)
      const response = connection.responses.find((r) => r.bodyId === bodyId)
      const newResponse = { lang, wsSent, wsResponse: formatResponse({ lang, wsResponse }) }
      return new Promise((resolve) => {
        axios.put(connectionPath + '/update_response', { connectionId, responseId: response._id, newResponse })
          .then(({ data: { newResponse } }) => {
            response.contents.unshift(newResponse)
            setTimeout(makeResizable, 200)
            resolve()
          })
          .catch(console.error)
      })
    },
    CREATE_CONNECTION (state, { name, url }) {
      return new Promise((resolve) => {
        axios.post(connectionPath + '/create_connection', { name, url })
          .then(({ data }) => {
            data.ws = new Ws(data)
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
          .then(({ data: { wsBody, wsResponse } }) => {
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
    CREATE_COOKIE (state, { key, value }) {
      const connectionId = state.connections[state.connectionTab]._id
      return new Promise((resolve) => {
        axios.post(connectionPath + '/create_cookie', { connectionId, key, value })
          .then(({ data: { key, value } }) => {
            if (state.connections[state.connectionTab].cookies.some((c) => c.key === key)) {
              state.connections[state.connectionTab].cookies = state.connections[state.connectionTab].cookies.map((c) => {
                if (c.key === key) c.value = value
                return c
              })
            } else {
              state.connections[state.connectionTab].cookies.push({ key, value })
            }
            resolve()
          })
          .catch(console.error)
      })
    },
    REMOVE_COOKIE (state, { key }) {
      const connectionId = state.connections[state.connectionTab]._id
      return new Promise((resolve) => {
        axios.put(connectionPath + '/remove_cookie', { connectionId, key })
          .then(() => {
            state.connections[state.connectionTab].cookies = state.connections[state.connectionTab].cookies.filter((c) => c.key !== key)
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
    },
    SET_QUEUED_NEXT (state, fn) {
      state.queuedNextAction = fn
    },
    PUSH_MESSAGE (state, message) {
      state.messages.unshift(message)
    },
    REMOVE_MESSAGE (state, { id }) {
      state.messages = state.messages.filter((m) => m.id !== id)
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
    createCookie ({ commit }, { key, value }) {
      commit('CREATE_COOKIE', { key, value })
    },
    removeCookie ({ commit }, { key }) {
      commit('REMOVE_COOKIE', { key })
    },
    setConnectionTab ({ commit }, index) {
      commit('SET_CONNECTION_TAB', index)
    },
    setBodiesTab ({ commit }, index) {
      commit('SET_BODIES_TAB', index)
    },
    setResponsesTab ({ commit }, index) {
      commit('SET_RESPONSES_TAB', index)
    },
    setQueuedNext ({ commit }, fn) {
      commit('SET_QUEUED_NEXT', fn)
    },
    pushMessage ({ commit }, message) {
      commit('PUSH_MESSAGE', message)
    },
    removeMessage ({ commit }, { id }) {
      commit('REMOVE_MESSAGE', { id })
    }
  },
  getters: {
    getConnections: state => state.connections,
    getAuthenticated: state => state.authenticated,
    getConnectionTab: state => state.connectionTab,
    getBodiesTab: state => state.bodiesTab,
    getResponsesTab: state => state.responsesTab,
    getQueuedNext: state => state.queuedNextAction,
    getMessages: state => state.messages
  }
})
