import $store from '../store/store'
import uId from 'uniqid'

class MessageBuilder {
  constructor (content, level, timeOut = 4000) {
    this.content = content
    this.timeOut = timeOut
    this.level = level
    this.id = uId(7)

    this._ticker = this._ticker.bind(this)
    this._addSelf = this._addSelf.bind(this)
    this._removeSelf = this._removeSelf.bind(this)
  }

  _addSelf () {
    $store.dispatch('pushMessage', this)
  }

  _removeSelf () {
    $store.dispatch('removeMessage', this)
  }

  _ticker () {
    setTimeout(this._removeSelf, this.timeOut)
  }
}

export function Message (content, level, timeOut) {
  const msg = new MessageBuilder(content, level, timeOut)
  msg._addSelf()
  msg._ticker()
}
