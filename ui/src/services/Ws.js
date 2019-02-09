import $store from '../store/store'

class Ws {
  constructor ({ name, url, _id }) {
    this.name = name
    this.connection = url
    this.connectionId = _id
    this.connected = false
    this._ws = null
    this._lastBody = null

    this.openSocket = this.openSocket.bind(this)
    this.closeSocket = this.closeSocket.bind(this)
    this.send = this.send.bind(this)
  }

  openSocket () {
    this._ws = new WebSocket(this.connection)
    this._ws.onopen = () => {
      this.connected = true
      console.log(`${this.connection.toUpperCase()} WS OPEN`)
    }
    this._ws.onerror = (err) => {
      this.connected = false
      console.error(`${this.connection.toUpperCase()} WS FAILED`, err)
    }
    this._ws.onclose = () => {
      this.connected = false
      console.log(`${this.connection.toUpperCase()} WS CLOSED`)
    }
    this._ws.onmessage = ({ data }) => {
      $store.dispatch('pushResponse', {
        connectionId: this.connectionId,
        bodyId: this._lastBody._id,
        lang: this._lastBody.lang,
        wsSent: this._lastBody,
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
