import $ from 'jquery'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import './css/design.css'
import { createMap } from './js/map'
import { createImageModalLinks } from './js/imageModal'
import { initPages } from './js/pages'

$('a[data-toggle="tab"][data-target="#karte-tab"]')
  .one('loaded.tab', () => {
    createMap()
  })

createImageModalLinks(document.body)
initPages()

let shown = false
const viewportModal = () => {
  if (window.matchMedia('(max-width: 1200px)').matches) {
    if (!shown) {
      $('#viewportModal').modal('show')
      shown = true
    }
  } else {
    $('#viewportModal').modal('hide')
  }
}

window.addEventListener('resize', viewportModal)
viewportModal()
