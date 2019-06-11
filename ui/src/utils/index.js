import xmlFormat from 'xml-formatter'

export function detectFormat (data) {
  data = data.trim()
  return (data[0] === '{' && data[data.length - 1] === '}') || Number(data) ? 'json' : data[0] === '<' && data[data.length - 1] === '>' ? 'xml' : 'plain_text'
}

export function makeResizable () {
  const $display = $('.display')
  $display.resizable({
    handles: 's'
  })
}

export function numberNames (list, name) {
  // todo
}

export function prettyPrintJSON (json) {
  try {
    return JSON.stringify(JSON.parse(json), null, '\t')
  } catch (_) {
    return json
  }
}

export function formatResponse ({ wsResponse }) {
  const lang = detectFormat(wsResponse)
  return lang === 'json'
    ? prettyPrintJSON(wsResponse) : lang === 'xml'
      ? xmlFormat(wsResponse) : wsResponse
}

export function throttle (fn, delay) {
  let inThrottle

  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, delay)
    }
  }
}
