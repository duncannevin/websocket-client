var wsUri, websocket, output, disconnect, connect, send, sendMessage, message, clearLog;
var resCount = 0;

function connectSocket () {
  wsUri = document.getElementById("ws-uri").value;
  websocket = new WebSocket(wsUri);
  websocket.onopen = function(evt) { onOpen(evt) };
  websocket.onclose = function(evt) { onClose(evt) };
  websocket.onmessage = function(evt) { onMessage(evt) };
  websocket.onerror = function(evt) { onError(evt) };
}

function disconnectSocket () {
  websocket.close();
}

function onOpen (evt) {
  writeToScreen("CONNECTED");
  enableDisconnect();
}

function onClose (evt) {
  writeToScreen("DISCONNECTED");
  disableDisconnect();
}

function enableDisconnect () {
  connect.disabled = true;
  disconnect.disabled = false;
  send.disabled = false;
  sendMessage.disabled = false;
}

function disableDisconnect () {
  disconnect.disabled = true;
  connect.disabled = false;
  send.disabled = true;
  sendMessage.disabled = true;
}

function onMessage (evt) {
  writeToScreen('<span style="color: green;">RESPONSE: </span>', evt.data);
}

function onError (evt) {
  writeToScreen('<span style="color: red;">ERROR: </span> ', evt.data);
}

function doSend () {
  var message = sendMessage.value;
  writeToScreen('<span style="color: blue;">SENT: </span>', message);
  message = eval('(' + message + ')');
  websocket.send(JSON.stringify(message));
}

function writeToScreen (header, message) {
  var div = document.createElement("div");
  var p = document.createElement("p");
  var pre = document.createElement("pre");
  p.innerHTML = header;
  div.appendChild(p);
  if (message) {
    pre.innerHTML = JSON.stringify(JSON.parse(message), undefined, 2);
    pre.style.whiteSpace = 'pre';
    div.appendChild(pre);
  }

  resCount++;
  output.appendChild(div);
}

function clearOutput () {
  resCount = 0;
  output.innerHTML = "";
}

function init () {
  output = document.getElementById("output");
  connect = document.getElementById("connect");
  disconnect = document.getElementById("disconnect");
  send = document.getElementById("send");
  sendMessage = document.getElementById("send-message");
  clearLog = document.getElementById("clear-log");

  sendMessage.value = '{"action": "get-stats"}';

  connect.addEventListener("click", connectSocket);
  disconnect.addEventListener("click", disconnectSocket);
  send.addEventListener("click", doSend);
  clearLog.addEventListener("click", clearOutput)
}

window.addEventListener("load", init, false);
