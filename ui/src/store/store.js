import Vuex from 'vuex'
import Vue from 'vue'
import Ws from '../services/Ws'
import { formatResponse, makeResizable } from '../utils'
import axios from 'axios'
import { $root } from '../main'

const connectionPath = '/connection'
const authPath = '/auth'
const userPath = '/users'

Vue.use(Vuex)

function processConnections ({ connections }) {
  return connections.map((connection) => {
    return Object.assign(connection, { ws: new Ws(connection) })
  })
}

function saveConnections ({ user }, state) {
  const connections = JSON.parse(localStorage.getItem('connections-cache')) || []
  return new Promise((resolve) => {
    axios.post(connectionPath + '/save_connections', { connections: connections }, { headers: { Authorization: 'Token ' + user.token || user.jwt } })
      .then(({ data: { connections } }) => {
        state.connections = processConnections({ connections })
        state.authMessages = [{ msg: 'Success!', level: 'success' }]
        state.authenticated = true
        state.user = user
        setTimeout(() => {
          $root.$emit('bv::hide::modal', 'Auth')
        }, 1000)
        localStorage.removeItem('connections-cache')
        resolve()
      })
      .catch(console.error)
  })
}

export default new Vuex.Store({
  state: {
    connections: [],
    authenticated: false,
    user: {},
    connectionTab: 0,
    bodiesTab: 0,
    responsesTab: 0,
    queuedNextAction: () => {},
    messages: [],
    authMessages: []
  },
  mutations: {
    INIT (state) {
      const token = localStorage.getItem('Token')
      return new Promise((resolve) => {
        axios.post(authPath + '/login', {}, { headers: { Authorization: 'Token ' + token } })
          .then(async ({ data: { user } }) => {
            state.user = user
            state.authenticated = true
            localStorage.setItem('Token', user.token)
            await this.dispatch('getConnections')
            resolve()
          })
          .catch(() => {
          })
      })
    },
    PUSH_RESPONSE (state, { connectionId, bodyId, lang, wsSent, wsResponse }) {
      const connection = state.connections.find((c) => c._id === connectionId)
      const response = connection.responses.find((r) => r.bodyId === bodyId)
      const newResponse = { lang, wsSent, wsResponse: formatResponse({ lang, wsResponse }) }
      return new Promise((resolve) => {
        axios.put(connectionPath + '/update_response', {
          connectionId,
          responseId: response._id,
          wsResponse: newResponse
        }, { headers: { Authorization: 'Token ' + state.user.token || state.user.jwt } })
          .then(({ data: { wsResponse } }) => {
            response.contents.unshift(wsResponse)
            setTimeout(makeResizable, 200)
            resolve()
          })
          .catch(console.error)
      })
    },
    CREATE_CONNECTION (state, { name, url }) {
      return new Promise((resolve) => {
        axios.post(connectionPath + '/create_connection', {
          name,
          url
        }, { headers: { Authorization: 'Token ' + state.user.token || state.user.jwt } })
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
        axios.post(connectionPath + '/create_body', {
          connectionId,
          name,
          lang
        }, { headers: { Authorization: 'Token ' + state.user.token || state.user.jwt } })
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
        axios.post(connectionPath + '/create_cookie', {
          connectionId,
          key,
          value
        }, { headers: { Authorization: 'Token ' + state.user.token || state.user.jwt } })
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
        axios.put(connectionPath + '/remove_cookie', {
          connectionId,
          key
        }, { headers: { Authorization: 'Token ' + state.user.token || state.user.jwt } })
          .then(() => {
            state.connections[state.connectionTab].cookies = state.connections[state.connectionTab].cookies.filter((c) => c.key !== key)
            resolve()
          })
          .catch(console.error)
      })
    },
    REMOVE_BODY (state, { bodyId }) {
      const connectionId = state.connections[state.connectionTab]._id
      return new Promise((resolve) => {
        axios.put(connectionPath + '/remove_body', {
          connectionId,
          bodyId
        }, { headers: { Authorization: 'Token ' + state.user.token || state.user.jwt } })
          .then(() => {
            state.connections[state.connectionTab].bodies = state.connections[state.connectionTab].bodies.filter((c) => c._id !== bodyId)
            state.connections[state.connectionTab].responses = state.connections[state.connectionTab].responses.filter((c) => c.bodyId !== bodyId)
            resolve()
          })
          .catch(console.error)
      })
    },
    REMOVE_RESPONSE (state, { responseId, contentId }) {
      const connectionId = state.connections[state.connectionTab]._id
      return new Promise((resolve) => {
        axios.put(connectionPath + '/remove_response', {
          connectionId,
          responseId,
          contentId
        }, { headers: { Authorization: 'Token ' + state.user.token || state.user.jwt } })
          .then(() => {
            state.connections[state.connectionTab].responses = state.connections[state.connectionTab].responses.map((res) => {
              if (res._id === responseId) {
                res.contents = res.contents.filter((cont) => cont._id !== contentId)
              }
              return res
            })
            resolve()
          })
          .catch(console.error)
      })
    },
    LOCAL_REGISTER (state, { name, email, password }) {
      return new Promise((resolve) => {
        axios.post(authPath + '/register', { name, email, password })
          .then(async ({ data: { user } }) => {
            await saveConnections({ user }, state)
            localStorage.setItem('Token', user.token)
            resolve()
          })
          .catch(() => {
            state.authMessages = [{ msg: 'Auth failed', level: 'failed' }]
          })
      })
    },
    SOCIAL_AUTH (state, { userId }) {
      return new Promise((resolve) => {
        axios.get(userPath + '/get_social', { params: { userId } })
          .then(async ({ data: { user } }) => {
            localStorage.setItem('Token', user.token)
            await saveConnections({ user }, state)
            resolve()
          })
          .catch(() => {
            state.authMessages = [{ msg: 'Auth failed', level: 'failed' }]
          })
      })
    },
    SIGN_IN (state, { email, password }) {
      return new Promise((resolve) => {
        axios.post(authPath + '/login', { email, password })
          .then(async ({ data: { user } }) => {
            state.user = user
            state.authenticated = true
            localStorage.setItem('Token', user.token)
            await this.dispatch('getConnections')
            resolve()
          })
          .catch(() => {
            state.authMessages = [{ msg: 'Auth failed', level: 'failed' }]
          })
      })
    },
    GET_CONNECTIONS (state) {
      return new Promise((resolve) => {
        axios.get(connectionPath + '/get_connections', { headers: { Authorization: 'Token ' + state.user.token || state.user.jwt } })
          .then(({ data: { connections } }) => {
            state.connections = processConnections({ connections })
            resolve()
          })
          .catch(console.error)
      })
    },
    LOGOUT (state) {
      localStorage.clear()
      state.connections = []
      state.authenticated = false
      state.user = {}
      state.connectionTab = 0
      state.bodiesTab = 0
      state.responsesTab = 0
      state.queuedNextAction = () => {}
      state.messages = []
      state.authMessages = []
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
    },
    PUSH_AUTH_MESSAGE (state, { msg, level }) {
      state.authMessages.push({ msg, level })
    },
    CLEAR_AUTH_MESSAGES (state) {
      state.authMessages = []
    }
  },
  actions: {
    init ({ commit }) {
      commit('INIT')
    },
    pushResponse ({ commit }, args) {
      commit('PUSH_RESPONSE', args)
    },
    openSocket ({ commit }, args) {
      commit('OPEN_SOCKET', args)
    },
    createConnection ({ commit }, { name, url }) {
      commit('CREATE_CONNECTION', { name, url })
    },
    createBody ({ commit }, { connectionId, name, url }) {
      commit('CREATE_BODY', { connectionId, name, url })
    },
    createCookie ({ commit }, { key, value }) {
      commit('CREATE_COOKIE', { key, value })
    },
    removeCookie ({ commit }, { key }) {
      commit('REMOVE_COOKIE', { key })
    },
    removeBody ({ commit }, { bodyId }) {
      commit('REMOVE_BODY', { bodyId })
    },
    removeResponse ({ commit }, { responseId, contentId }) {
      commit('REMOVE_RESPONSE', { responseId, contentId })
    },
    localRegister ({ commit }, { name, email, password }) {
      commit('LOCAL_REGISTER', { name, email, password })
    },
    socialAuth ({ commit }, { userId }) {
      commit('SOCIAL_AUTH', { userId })
    },
    signIn ({ commit }, { email, password }) {
      commit('SIGN_IN', { email, password })
    },
    logout ({ commit }) {
      commit('LOGOUT')
    },
    getConnections ({ commit }) {
      commit('GET_CONNECTIONS')
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
    },
    pushAuthMessage ({ commit }, { msg, level }) {
      commit('PUSH_AUTH_MESSAGE', { msg, level })
    },
    clearAuthMessages ({ commit }) {
      commit('CLEAR_AUTH_MESSAGES')
    }
  },
  getters: {
    getConnections: state => state.connections,
    getAuthenticated: state => state.authenticated,
    getConnectionTab: state => state.connectionTab,
    getBodiesTab: state => state.bodiesTab,
    getResponsesTab: state => state.responsesTab,
    getQueuedNext: state => state.queuedNextAction,
    getMessages: state => state.messages,
    getAuthMessages: state => state.authMessages,
    getUser: state => state.user
  }
})
