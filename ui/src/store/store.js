import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    connections: {
      tabs: [
        {
          name: 'connection-1',
          urlData: {
            connected: false,
            url: 'ws://localhost:9000/ws'
          },
          requestData: {
            cookies: [
              {bKey: 'bValue'}
            ],
            headers: [
              {hKey: 'hValue'}
            ],
            bodies: [
              {
                name: 'to-the-moon',
                lang: 'json',
                content: '{' +
                  '"have": "fun", ' +
                  '"be": "happy"' +
                  '}'
              }
            ]
          },
          responseData: {
            bodyId: '',
            responses: []
          }
        },
        {
          name: 'connection-2',
          urlData: {
            connected: false,
            url: 'ws://localhost:9000/ws'
          },
          requestData: {
            cookies: [],
            headers: [],
            bodies: []
          },
          responseData: {
            bodyId: '',
            responses: []
          }
        }
      ]
    }
  },
  mutations: {},
  actions: {},
  getters: {
    getConnections: state => state.connections
  }
})
