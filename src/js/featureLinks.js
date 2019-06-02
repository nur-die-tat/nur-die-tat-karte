/* globals ol, $ */

import { eventChannel } from './eventChannel'

function focus (map, featureId, layer) {
  map.get('featureDetails').focusOnFeatureByIds(featureId, layer)
}

export function createFeatureLinks (target) {
  const $karteTab = $(`a[data-toggle="tab"][data-target="#karte-tab"]`)
  for (let featureLink of target.querySelectorAll('.feature-link')) {
    featureLink.addEventListener('click', e => {
      $karteTab.one('shown.bs.tab', function () {
        if (window.map instanceof ol.Map) {
          focus(window.map, parseInt(featureLink.dataset.feature), featureLink.dataset.layer)
        } else {
          eventChannel.on('mapCreated', function () {
            focus(window.map, parseInt(featureLink.dataset.feature), featureLink.dataset.layer)
          })
        }
      })
      $karteTab.tab('show')
      e.preventDefault()
    })
  }
}
