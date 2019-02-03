import xmlFormat from 'xml-formatter'

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

export function formatResponse ({ lang, wsResponse }) {
  return lang === 'json'
    ? prettyPrintJSON(wsResponse) : lang === 'xml'
      ? xmlFormat(wsResponse) : wsResponse
}
