class Submit {
  constructor () {
    this.id = null
    this.$tab = null
    this.$item = null
    this.$items = document.getElementsByClassName('submit-form-item')
    this.$tabs = document.getElementsByClassName('submit-form-tab')
  }

  _iterateElements (elements, cb) {
    [].forEach.call(elements, cb)
  }

  _removeClass (elements, nameOrNames) {
    this._iterateElements(elements, function (ele) {
      if (typeof  nameOrNames === 'string') {
         ele.classList.remove(nameOrNames)
      } else {
        nameOrNames.forEach((n) => ele.classList.remove(n))
      }
    })
  }

  tabClick () {
    this.$tab.addEventListener('click', () => {
      this._removeClass(this.$tabs,'active')
      this._removeClass(this.$items, ['active', 'show'])
      this.$tab.classList.add('active')
      this.$item.classList.add('active', 'show')
    })
  }

  init () {
    this.tabClick()
  }
}

/**
 * todo
 */
class Headers extends Submit {
  constructor () {
    super()
    this.id = 'Headers'
    this.$tab = document.getElementById(this.id + '-tab')
    this.$item = document.getElementById(this.id + '-form')
    this.init()
  }
}

class Cookies extends Submit {
  constructor () {
    super()
    this.id = 'Cookies'
    this.$tab = document.getElementById(this.id + '-tab')
    this.$item = document.getElementById(this.id + '-form')
    this.cookieCount = 1
    // todo -> use stored cookies and append them to this array on load
    this.cookies = [
      this._cookieForm(1),
      // todo -> these are just placeholders
      this._cookieForm(2, {key: 'Apple', value: 'Pie'}),
      this._cookieForm(3, {key: 'Spicy', value: 'Tuna'})
    ]
    this.init()
    this.appendCookieForms()
  }

  _cookieForm (id, {key, value} = {key: false, value: false}) {
    const $cookie = document.createElement('div')
    $cookie.classList.add('cookie', 'row')
    $cookie.id = 'Cookie-' + id
    const $input = document.createElement('input')
    $input.classList.add('form-control', 'form-control-sm', 'cookie-field', 'col-5')
    $input.setAttribute('type', 'text')
    key ? $input.setAttribute('disabled', true) : ''
    const $key = $input.cloneNode(true)
    key ? $key.setAttribute('value', key) : $key.setAttribute('placeholder', 'Key')
    const $value = $input.cloneNode(true)
    key ? $value.setAttribute('value', value) : $value.setAttribute('placeholder', 'Value')
    const $button = document.createElement('button')
    $button.classList.add('col-2')
    $button.classList.add('btn', 'btn-primary', 'btn-sm')
    $button.innerText = key ? 'Remove' : 'Add'

    $cookie.appendChild($key)
    $cookie.appendChild($value)
    $cookie.appendChild($button)

    return $cookie
  }

  appendCookieForms () {
    this.cookies.forEach((cookie) => {
      this.$item.appendChild(cookie)
    })
  }
}

class Body extends Submit {
  constructor () {
    super()
    this.id = 'Body'
    this.$tab = document.getElementById(this.id + '-tab')
    this.$item = document.getElementById(this.id + '-form')
    this.$selectionTabs = this.$item.querySelector('.nav-tabs')
    this.$children = this.$selectionTabs.children

    this.tabs = [
      {
        name: '1',
        text: ''
      },
      {
        name: '2',
        text: ''
      }
    ]

    this.init()
    this._appendTabs()
 }

  _formTab ({name}) {
    const $item = document.createElement('li')
    $item.classList.add('nav-item')
    $item.id = 'submit-form-tab-' + name
    const $anchor = document.createElement('a')
    $anchor.classList.add('nav-link', 'body-tab')
    $anchor.setAttribute('href', '#')
    $anchor.innerText = name
    $anchor.addEventListener('click', this._selectTab.bind(this))
    this._appendTabs = this._appendTabs.bind(this)

    $item.appendChild($anchor)

    return $item
  }

  _selectTab (evt) {
    const $a = evt.target
    this._clearActives()
    $a.classList.add('active')
  }

  _plusAnchor () {
    const $item = document.createElement('li')
    $item.id = 'Json-add'
    $item.classList.add('nav-item')
    const $anchor = document.createElement('a')
    $anchor.classList.add('nav-link', 'body-tab')
    $anchor.setAttribute('href', '#')
    $anchor.innerText = '+'
    $anchor.addEventListener('click', () => {
      this._clearActives()
      this._appendNewTab()
    })

    $item.append($anchor)

    return $item
  }

  _clearActives () {
    this._iterateElements(this.$children, (li) => {
      li.querySelector('a').classList.remove('active')
    })
  }

  _resetPlusAnchor () {
    const $add = document.getElementById('Json-add')
    if ($add !== null) $add.remove()
    this.$selectionTabs.append(this._plusAnchor())
  }

  _appendTabs () {
    this.tabs.forEach((tab, ind, coll) => {
      const $tab = this._formTab(tab)
      if (ind === coll.length - 1) $tab.querySelector('a').classList.add('active')
      this.$selectionTabs.append($tab)
    })
    this._resetPlusAnchor()
  }

  _appendNewTab () {
    const newTab = {name: this.tabs.length + 1, test: ''}
    this.tabs.push(newTab)
    const $tab = this._formTab(newTab)
    $tab.querySelector('a').classList.add('active')
    this.$selectionTabs.append($tab)
    this._resetPlusAnchor()
  }
}

class SubmitForm {
  constructor () {
    this.cookies = new Cookies()
    this.body = new Body()
    this.init()
  }

  init () {
    console.log(this)
  }
}

window.SubmitForm = SubmitForm
