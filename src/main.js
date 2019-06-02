/* globals $ */

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
