import $store from '../store/store'
import { Message } from './Message'

class Ws {
  constructor ({ name, url, _id }) {
    this.name = name
    this.connection = url
    this.connectionId = _id
    this.connected = false
    this._ws = null

    this.openSocket = this.openSocket.bind(this)
    this.closeSocket = this.closeSocket.bind(this)
    this.send = this.send.bind(this)
  }

  openSocket () {
    this._ws = new WebSocket(this.connection)
    this._ws.onopen = () => {
      this.connected = true
      Message(`[WS OPEN] ${this.name}`, 'success')
    }
    this._ws.onerror = (err) => {
      this.connected = false
      Message(`[CONNECTION FAILED] ${this.name}: ${err}`, 'warn')
    }
    this._ws.onclose = () => {
      this.connected = false
      Message(`[WS CLOSED] ${this.name}`, 'warn')
    }
    this._ws.onmessage = ({ data }) => {
      $store.dispatch('pushResponse', {
        connectionId: this.connectionId,
        wsResponse: data
      })
    }
  }

  closeSocket () {
    this._ws.close()
  }

  send (body) {
    this._lastBody = body
    if (this._ws === null || this._ws.readyState !== 1) {
      this.openSocket(() => {
        this._ws.send(body.content)
      })
    } else {
      this._ws.send(body.content)
    }
  }
}

export default Ws
