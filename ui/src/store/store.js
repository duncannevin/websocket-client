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
            url: 'wss://echo.websocket.org'
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
              },
              {
                name: 'to-the-sun',
                lang: 'xml',
                content: '<note>\n' +
                  '<to>Tove</to>\n' +
                  '<from>Jani</from>\n' +
                  '<heading>Reminder</heading>\n' +
                  '<body>Don\'t forget me this weekend!</body>\n' +
                  '</note>'
              },
              {
                name: 'to-the-nothing',
                lang: 'plain_text',
                content: 'This is very plain'
              }
            ]
          },
          responseData: {
            responses: [
              {
                bodyName: 'to-the-moon',
                lang: 'json',
                content: '{"what": "a", "crazy": "ride", "onThe": 1234}'
              },
              {
                bodyName: 'to-the-sun',
                lang: 'xml',
                content: '<response><from>Jim</from><body>You bet ya!</body></response>'
              },
              {
                bodyName: 'to-the-nothing',
                lang: 'plain_text',
                content: 'No its not'
              }
            ]
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
