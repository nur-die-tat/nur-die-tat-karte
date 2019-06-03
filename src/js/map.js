import $ from 'jquery'
import { baseLayers } from './baseLayers'
import { TimePicker } from './time-picker/TimePicker'
import { vectorLayers } from './vectorLayers'
import { FeatureDetails } from './FeatureDetails'
import { PanelHide } from './panelHide'
import { eventChannel } from './eventChannel'
import { PreLoader } from './PreLoader'
import { Icons } from './icons'
import { defaults } from 'ol/control/util'
import View from 'ol/View'
import OlMap from 'ol/Map'

import 'ol/ol.css'

export function createMap () {
  const preLoader = new PreLoader()

  const map = new OlMap({
    target: 'map',
    controls: defaults({
      zoomOptions: {
        className: 'zoom'
      },
      attributionOptions: {
        collapsible: false
      }
    }),
    view: new View({
      center: [ 969903.0294226853, 6715569.3577772435 ],
      zoom: 7
    })
  })

  baseLayers(map)
  const icons = new Icons(preLoader)
  const vectorLayers_ = vectorLayers(map, preLoader, icons)
  preLoader.add('data/time-line.json')

  preLoader.load().then(() => {
    const timePicker = new TimePicker('#footer', preLoader.get('data/time-line.json'), vectorLayers_, map.getView(), icons)

    const featureDetails = new FeatureDetails(map, vectorLayers_, timePicker, icons)
    map.set('featureDetails', featureDetails)
    map.on('moveend', () => {
      timePicker.showVisibleFeatures()
    })

    const panelHide = new PanelHide()

    window.map = map
    eventChannel.dispatchMapCreated()

    const updateSizes = () => {
      $('.tab-content').outerHeight($('body').innerHeight() - $('.navbar').outerHeight())
      map.updateSize()
      timePicker.update()
      panelHide.update()
    }

    panelHide.on('change', updateSizes)

    const resetSizes = () => {
      $('.tab-content').css('height', null)
    }

    $('a[data-toggle="tab"][data-target="#karte-tab"]')
      .on('shown.bs.tab', updateSizes)
      .on('hide.bs.tab', resetSizes)

    window.addEventListener('resize', () => {
      if ($('#karte-tab').is(':visible')) {
        updateSizes()
      }
    })

    updateSizes()

    const randomButton = document.getElementById('random-button')
    randomButton.addEventListener('click', () => {
      eventChannel.dispatchMapQuery('random')
    })

    const networkButton = document.getElementById('network-button')
    networkButton.addEventListener('click', () => {
      featureDetails.toggleNetworkVisibility()
      if (featureDetails.networkVisible) {
        networkButton.classList.add('active')
      } else {
        networkButton.classList.remove('active')
      }
    })
  })

  return map
}
