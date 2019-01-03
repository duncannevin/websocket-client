let wsUri, websocket, output, disconnect, connect, send, sendMessage, message, clearLog,
  cookie, applyCookie
let resCount = 0

function connectSocket() {
  wsUri = document.getElementById('ws-uri').value
  websocket = new WebSocket(wsUri)
  websocket.onopen = function (evt) {
    onOpen(evt)
  }
  websocket.onclose = function (evt) {
    onClose(evt)
  }
  websocket.onmessage = function (evt) {
    onMessage(evt)
  }
  websocket.onerror = function (evt) {
    onError(evt)
  }
}

function disconnectSocket() {
  websocket.close()
}

function onOpen(evt) {
  writeToScreen('CONNECTED')
  enableDisconnect()
}

function onClose(evt) {
  writeToScreen('DISCONNECTED')
  disableDisconnect()
}

function enableDisconnect() {
  connect.disabled = true
  disconnect.disabled = false
  send.disabled = false
  sendMessage.disabled = false
}

function disableDisconnect() {
  disconnect.disabled = true
  connect.disabled = false
  send.disabled = true
  sendMessage.disabled = true
}

function onMessage(evt) {
  writeToScreen('<span style="color: green;">RESPONSE: </span>', evt.data)
}

function onError(evt) {
  writeToScreen('<span style="color: red;">ERROR: </span> ', evt.data)
}

function convertToJs(jsonStr) {
  return eval('(' + jsonStr + ')')
}

function doSend() {
  let message = sendMessage.value
  writeToScreen('<span style="color: blue;">SENT: </span>', message)
  message = convertToJs(message)
  websocket.send(JSON.stringify(message))
}

function writeToScreen(header, message) {
  const div = document.createElement('div')
  const p = document.createElement('p')
  const pre = document.createElement('pre')
  p.innerHTML = header
  div.appendChild(p)
  if (message) {
    pre.innerHTML = JSON.stringify(JSON.parse(message), undefined, 2)
    pre.style.whiteSpace = 'pre'
    div.appendChild(pre)
  }

  resCount++
  output.appendChild(div)
}

function clearOutput() {
  resCount = 0
  output.innerHTML = ''
}

function sendCookie() {
  fetch('/client_cookie/setcookie', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Cache': 'no-cache'
    },
    body: JSON.stringify(convertToJs(cookie.value))
  })
    .then(function (res) {
      return res.json()
    })
    .then(function (res) {
      writeToScreen('COOKIE SET', JSON.stringify(res))
    })
    .catch(function (err) {
      writeToScreen('<span style="color: red;">ERROR: </span> ', err.message)
    })
}

function removeCookies() {

}

function init() {
  output = document.getElementById('output')
  connect = document.getElementById('connect')
  disconnect = document.getElementById('disconnect')
  send = document.getElementById('send')
  sendMessage = document.getElementById('send-message')
  clearLog = document.getElementById('clear-log')
  cookie = document.getElementById('cookie-input')
  applyCookie = document.getElementById('apply-cookie')

  sendMessage.value = '{"action": "get-stats"}'
  cookie.value = '{"key": "value"}'

  connect.addEventListener('click', connectSocket)
  disconnect.addEventListener('click', disconnectSocket)
  send.addEventListener('click', doSend)
  clearLog.addEventListener('click', clearOutput)
  applyCookie.addEventListener('click', sendCookie)
}

window.addEventListener('load', init, false)
