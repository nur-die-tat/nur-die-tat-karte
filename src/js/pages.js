/* globals history */

import $ from 'jquery'

import anmerkungenUrl from '../html/pages/anmerkungen.html'
import karteUrl from '../html/pages/karte.html'
import homeUrl from '../html/pages/home.html'
import kontaktUrl from '../html/pages/kontakt.html'
import datenschutzUrl from '../html/pages/datenschutz.html'

import { loadHTML } from './loadHTML'
import { eventChannel } from './eventChannel'

export const pages = {
  anmerkungen: anmerkungenUrl,
  karte: karteUrl,
  home: homeUrl,
  kontakt: kontaktUrl,
  datenschutz: datenschutzUrl
}

let mapQuery = {}

export function createTabLinks (target) {
  for (let tabLink of target.querySelectorAll('a')) {
    let href = tabLink.getAttribute('href')
    const res = /(?:^|^\/)([^#?/]+?)(?:#|\?|$)/.exec(href)
    if (res) {
      const page = res[1]
      tabLink.addEventListener('click', e => {
        showTab(page)
      })
    }
  }
}

function updateState (page) {
  let search = ''
  if (page === 'karte' && Object.keys(mapQuery).length) {
    search += '?' + Object.entries(mapQuery).map(function (kv) {
      return kv.join('=')
    }).join('&')
  }
  if (history.state && (history.state.page !== page || history.state.search !== search)) {
    history.pushState({ page, search }, '', page + search)
  } else {
    history.replaceState({ page, search }, '', page + search)
  }
}

window.addEventListener('popstate', function (e) {
  showTab(e.state.page)
  if (e.state.page === 'karte') {
    setMapQueryFromSearch(e.state.search)
  }
})

function showTab (page) {
  $(`a[data-toggle="tab"][data-target="#${page}-tab"]`).tab('show')
}

export function setMapQuery (feature, layer) {
  mapQuery = {}
  if (feature) {
    mapQuery['feature'] = feature
  }
  if (layer) {
    mapQuery['layer'] = layer
  }
  updateState('karte')
}

function setMapQueryFromSearch (search) {
  mapQuery = {}
  if (search.length > 1) {
    for (let keyVal of search.substr(1).split('&')) {
      const [key, val] = keyVal.split('=')
      mapQuery[key] = val
    }
    eventChannel.dispatchMapQuery(mapQuery)
  } else {
    eventChannel.dispatchMapQuery('random')
  }
}

export function initPages () {
  $('a[data-toggle="tab"]')
    .on('show.bs.tab', function () {
      let target = $(this).data('target')
      const page = /#(.*?)-tab/.exec(target)[1]
      loadHTML(target, pages[page])
        .then(() => $(this).trigger('loaded.tab'))
      updateState(page)
    })
    .on('shown.bs.tab', function () {
      window.scrollTo(0, 0)
    })

  let page = 'home'
  let search = ''
  if (history.state) {
    page = history.state.page
    search = history.state.search
  }
  page = window.location.pathname.slice(1) || page
  search = window.location.search || search
  if (page === 'karte') {
    eventChannel.on('mapCreated', function () {
      setMapQueryFromSearch(search)
    })
  }

  showTab(page)
}
