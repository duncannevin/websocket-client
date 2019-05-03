import Vuex from 'vuex'
import Vue from 'vue'
import Ws from '../services/Ws'
import { formatResponse, makeResizable } from '../utils'
import axios from 'axios'
import { $root } from '../main'
import { Message } from '../services/Message'

const connectionPath = '/connection'
const authPath = '/auth'
const userPath = '/users'

Vue.use(Vuex)

function authHeader () {
  const user = store.getters.getUser
  const token = user.token || user.jwt
  return token ? { Authorization: 'Token ' + token } : {}
}

function processConnections ({ connections }) {
  return connections.map((connection) => {
    connection.responses.map(response => response.contents.reverse())
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
          makeResizable()
        }, 1000)
        localStorage.removeItem('connections-cache')
        resolve()
      })
      .catch(() => {
        store.dispatch('pushMessage', Message(`[CONNECTION] Server failed to add connections`, 'warn'))
      })
  })
}

const store = new Vuex.Store({
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
    PUSH_RESPONSE (state, { wsResponse, response }) {
      response.contents.unshift(wsResponse)
      setTimeout(makeResizable, 200)
    },
    CREATE_CONNECTION (state, { data }) {
      data.ws = new Ws(data)
      state.connections.push(data)
      state.connectionTab = state.connections.length - 1
    },
    CREATE_BODY (state, { wsBody, wsResponse }) {
      state.connections[state.connectionTab].bodies.push(wsBody)
      state.connections[state.connectionTab].responses.push(wsResponse)
      setTimeout(() => {
        state.bodiesTab = state.connections[state.connectionTab].bodies.length - 1
        state.responsesTab = state.connections[state.connectionTab].responses.length - 1
      }, 80)
    },
    CREATE_COOKIE (state, { key, value }) {
      if (state.connections[state.connectionTab].cookies.some((c) => c.key === key)) {
        state.connections[state.connectionTab].cookies = state.connections[state.connectionTab].cookies.map((c) => {
          if (c.key === key) c.value = value
          return c
        })
      } else {
        state.connections[state.connectionTab].cookies.push({ key, value })
      }
    },
    REMOVE_COOKIE (state, { key }) {
      state.connections[state.connectionTab].cookies = state.connections[state.connectionTab].cookies.filter((c) => c.key !== key)
    },
    REMOVE_BODY (state, { bodyId }) {
      state.connections[state.connectionTab].bodies = state.connections[state.connectionTab].bodies.filter((c) => c._id !== bodyId)
      state.connections[state.connectionTab].responses = state.connections[state.connectionTab].responses.filter((c) => c.bodyId !== bodyId)
    },
    REMOVE_RESPONSE (state, { responseId, contentId }) {
      state.connections[state.connectionTab].responses = state.connections[state.connectionTab].responses.map((res) => {
        if (res._id === responseId) {
          res.contents = res.contents.filter((cont) => cont._id !== contentId)
        }
        return res
      })
    },
    REMOVE_CONNECTION (state, { connectionId }) {
      state.connections = state.connections.filter((connection) => connection._id !== connectionId)
    },
    async SET_USER (state, user) {
      await saveConnections({ user }, state)
      state.user = user
      state.authenticated = true
      localStorage.setItem('Token', user.token)
      this.dispatch('getConnections')
    },
    GET_CONNECTIONS (state, connections) {
      state.connections = processConnections({ connections })
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
      if (message) {
        state.messages.unshift(message)
      }
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
    async init ({ commit }) {
      function signin () {
        commit('PUSH_MESSAGE', Message(`[WELCOME] Sign in to save your state`, 'info'))
      }

      try {
        const token = localStorage.getItem('Token')
        if (!token) return signin()
        const { data: { user } } = await axios.post(authPath + '/login', {}, { headers: { Authorization: 'Token ' + token } })
        commit('SET_USER', user)
      } catch (error) {
        signin()
      }
    },
    async pushResponse ({ commit, getters }, { connectionId, bodyId, lang, wsSent, wsResponse }) {
      try {
        const connections = getters.getConnections
        const connection = connections.find((c) => c._id === connectionId)
        const response = connection.responses.find((r) => r.bodyId === bodyId)
        const newResponse = { lang, wsSent, wsResponse: formatResponse({ lang, wsResponse }) }
        const { data } = await axios.put(connectionPath + '/update_response', {
          connectionId,
          responseId: response._id,
          wsResponse: newResponse
        }, { headers: authHeader() })
        commit('PUSH_RESPONSE', { wsResponse: data.wsResponse, response })
      } catch (error) {
        commit('PUSH_MESSAGE', Message(`[RESPONSE] Server failed to add response`, 'warn'))
      }
    },
    openSocket ({ commit }, args) {
      commit('OPEN_SOCKET', args)
    },
    async createConnection ({ commit, getters }, { name, url }) {
      try {
        const { data } = await axios.post(connectionPath + '/create_connection', {
          name,
          url
        }, { headers: authHeader() })
        commit('CREATE_CONNECTION', { data })
      } catch (error) {
        commit('PUSH_MESSAGE', Message(`[CONNECTION] Server failed to add connection`, 'warn'))
      }
    },
    async createBody ({ commit, getters }, { connectionId, name }) {
      try {
        const { data: { wsBody, wsResponse } } = await axios.post(connectionPath + '/create_body', {
          connectionId,
          name,
          lang: 'JSON'
        }, { headers: authHeader() })
        commit('CREATE_BODY', { wsBody, wsResponse })
      } catch (error) {
        commit('PUSH_MESSAGE', Message(`[BODY] Server failed to add body`, 'warn'))
      }
    },
    async createCookie ({ commit, getters }, { key, value }) {
      try {
        const connectionTab = getters.getConnectionTab
        const connectionId = getters.getConnections[connectionTab]._id
        await axios.post(connectionPath + '/create_cookie', {
          connectionId,
          key,
          value
        }, { headers: authHeader() })
        commit('CREATE_COOKIE', { key, value })
      } catch (error) {
        commit('PUSH_MESSAGE', Message(`[BODY] Server failed to add cookie`, 'warn'))
      }
    },
    async removeCookie ({ commit, getters }, { key }) {
      try {
        const connectionTab = getters.getConnectionTab
        const connectionId = getters.getConnections[connectionTab]._id
        await axios.put(connectionPath + '/remove_cookie', {
          connectionId,
          key
        }, { headers: authHeader() })
        commit('REMOVE_COOKIE', { key })
      } catch (error) {
        commit('PUSH_MESSAGE', Message(`[BODY] Server failed to remove cookie`, 'warn'))
      }
    },
    async removeBody ({ commit, getters }, { bodyId }) {
      try {
        const connectionTab = getters.getConnectionTab
        const connectionId = getters.getConnections[connectionTab]._id
        await axios.put(connectionPath + '/remove_body', {
          connectionId,
          bodyId
        }, { headers: authHeader() })
        commit('REMOVE_BODY', { bodyId })
      } catch (error) {
        commit('PUSH_MESSAGE', Message(`[BODY] Server failed to remove body`, 'warn'))
      }
    },
    async removeConnection ({ commit, getters }, { connectionId }) {
      try {
        await axios.delete(connectionPath + '/remove_connection/' + connectionId, { headers: authHeader() })
        commit('REMOVE_CONNECTION', { connectionId })
      } catch (error) {
        commit('PUSH_MESSAGE', Message(`[BODY] Server failed to remove connection`, 'warn'))
      }
    },
    async removeResponse ({ commit, getters }, { responseId, contentId }) {
      try {
        const connectionId = getters.getConnections[getters.getConnectionTab]._id
        await axios.put(connectionPath + '/remove_response', {
          connectionId,
          responseId,
          contentId
        }, { headers: authHeader() })
        commit('REMOVE_RESPONSE', { responseId, contentId })
      } catch (error) {
        commit('PUSH_MESSAGE', Message(`[BODY] Server failed to remove response`, 'warn'))
      }
    },
    async localRegister ({ commit }, { name, email, password }) {
      try {
        const { data: { user } } = await axios.post(authPath + '/register', { name, email, password })
        commit('SET_USER', user)
      } catch (error) {
        commit('PUSH_MESSAGE', Message(`[AUTHENTICATION] Invalid credentials`, 'warn'))
      }
    },
    async socialAuth ({ commit }, { userId }) {
      try {
        const { data: { user } } = await axios.get(userPath + '/get_social', { params: { userId } })
        commit('SET_USER', user)
      } catch (error) {
        commit('PUSH_MESSAGE', Message(`[AUTHENTICATION] Invalid credentials`, 'warn'))
      }
    },
    async signIn ({ commit }, { email, password }) {
      try {
        const { data: { user } } = await axios.post(authPath + '/login', { email, password })
        commit('SET_USER', user)
      } catch (error) {
        commit('PUSH_MESSAGE', Message(`[AUTHENTICATION] Invalid credentials`, 'warn'))
      }
    },
    logout ({ commit }) {
      commit('LOGOUT')
    },
    async getConnections ({ commit }) {
      try {
        const { data: { connections } } = await axios.get(connectionPath + '/get_connections', { headers: authHeader() })
        commit('GET_CONNECTIONS', connections)
      } catch (error) {
        commit('PUSH_MESSAGE', Message(`[CONNECTIONS] Server failed to get connections`, 'warn'))
      }
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

export default store
