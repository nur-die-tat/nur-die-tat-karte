/* globals ol, $ */

import { baseLayers } from './baseLayers'
import { TimePicker } from './time-picker/TimePicker'
import { vectorLayers } from './vectorLayers'
import { FeatureDetails } from './feature-details'
import { PanelHide } from './panelHide'
import { eventChannel } from './eventChannel'
import { PreLoader } from './PreLoader'
import { Icons } from './icons'

export function createMap () {
  // proj4.defs("EPSG:31466", "+proj=tmerc +lat_0=0 +lon_0=6 +k=1 +x_0=2500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs");

  const preLoader = new PreLoader()

  const map = new ol.Map({
    target: 'map',
    controls: ol.control.defaults({
      zoomOptions: {
        className: 'zoom'
      },
      attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
        collapsible: false
      })
    }),
    view: new ol.View({
      center: [ 969903.0294226853, 6715569.3577772435 ],
      zoom: 6
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

    panelHide.getToggleObservable()
      .subscribe(updateSizes)

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
