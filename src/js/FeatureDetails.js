import { createImageModalLinks } from './imageModal'
import { clearElement } from './utils'
import { createVectorLayerStyle, networkStyle } from './vectorLayerStyle'
import { setMapQuery } from './pages'
import { eventChannel } from './eventChannel'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import LineString from 'ol/geom/LineString'
import Feature from 'ol/Feature'
import { getCenter } from 'ol/extent'

function getPoint (geom) {
  while (geom.getGeometries) {
    geom = geom.getGeometries()[0] // TODO: is there something nicer?
  }
  return geom.getFirstCoordinate() // TODO: is there something nicer?
}

export class FeatureDetails {
  constructor (map, vectorLayers, timePicker, icons) {
    this.map = map
    this.vectorLayers = vectorLayers
    this.timePicker = timePicker

    this.highlightSource = new VectorSource({
      features: []
    })

    this.map.addLayer(new VectorLayer({
      source: this.highlightSource,
      style: createVectorLayerStyle(icons),
      zIndex: 10
    }))

    this.networkSource = new VectorSource({
      features: []
    })

    this.map.addLayer(new VectorLayer({
      source: this.networkSource,
      style: networkStyle,
      zIndex: 9
    }))

    const layerFilter = l => this.vectorLayers.includes(l)

    map.on('click', e => {
      map.forEachFeatureAtPixel(e.pixel, (f, l) => {
        this.showFeatureDetails(f, l)
        return true
      }, { layerFilter })
    })

    let hovered = null
    const resetHover = () => {
      if (hovered) {
        hovered.set('hover', false)
        if (this.highlightSource.hasFeature(hovered)) {
          this.highlightSource.removeFeature(hovered)
        }
      }
    }

    map.on('pointermove', e => {
      if (map.hasFeatureAtPixel(e.pixel)) {
        resetHover()
        hovered = map.forEachFeatureAtPixel(e.pixel, f => f, { layerFilter })
        hovered.set('hover', true)
        map.getViewport().style.cursor = 'pointer'
        this.highlightSource.addFeature(hovered)
      } else {
        resetHover()
        hovered = null
        map.getViewport().style.cursor = 'auto'
      }
    })

    this.detailsElement = document.querySelector('#details')
    this.featureNameElement = document.querySelector('#feature-name')
    this.layerNameElement = document.querySelector('#layer-name')
    this.featureDescriptionElement = document.querySelector('#feature-description')
    this.featureAddressElement = document.querySelector('#feature-address')
    this.featureSourcesElement = document.querySelector('#feature-sources')

    eventChannel.on('mapQuery', e => {
      if (e.mapQuery === 'random') {
        const features = vectorLayers.reduce((features, layer) => {
          features.push(...layer.getSource().getFeatures().map(f => [layer, f]))
          return features
        }, [])
        const [layer, feature] = features[Math.floor(Math.random() * features.length)]
        this.focusOnFeatureByIds(feature.getId(), layer.get('id'))
      } else {
        this.focusOnFeatureByIds(parseInt(e.mapQuery['feature']), e.mapQuery['layer'])
      }
    })

    this.timePicker.on('click:feature', e => {
      this.focusOnFeature(e.feature, e.layer)
    })
  }

  toggleNetworkVisibility () {
    this.networkVisible = !this.networkVisible
    if (this.networkVisible) {
      this.showNetwork()
    } else {
      this.networkSource.clear()
    }
  }

  showNetwork () {
    const links = this.featureDescriptionElement.querySelectorAll('.feature-link')
    const activePoint = getPoint(this.activeFeature.getGeometry())
    for (const link of links) {
      const layer = this.vectorLayers.find(l => l.get('id') === link.dataset.layer)
      const feature = layer.getSource().getFeatureById(link.dataset.feature)
      const line = new LineString([
        activePoint,
        getPoint(feature.getGeometry())
      ])
      this.networkSource.addFeature(new Feature(line))
    }
  }

  focusOnFeatureByIds (featureId, layerId) {
    let layer = this.vectorLayers.find(l => l.get('id') === layerId)
    let feature = layer.getSource().getFeatures().find(f => f.getId() === featureId)
    if (!feature) {
      setTimeout(() => {
        this.focusOnFeatureByIds(featureId, layerId)
      }, 200)
    } else {
      this.focusOnFeature(feature, layer)
    }
  }

  focusOnFeature (feature, layer) {
    setTimeout(() => {
      this.map.getView().animate({ center: getCenter(feature.getGeometry().getExtent()), duration: 2000 })
    }, 0)
    this.showFeatureDetails(feature, layer)
  }

  showFeatureDetails (feature, layer) {
    if (this.activeFeature) {
      this.activeFeature.set('active', false)
      this.highlightSource.clear()
      this.networkSource.clear()
    }

    if (feature === null || this.activeFeature === feature) {
      this.activeFeature = null
      document.querySelector('#details')
        .classList.add('hidden')
      this.timePicker.unsetFeature()
      setMapQuery(null, null)
    } else {
      feature.set('active', true)

      this.highlightSource.addFeature(feature)

      this.activeFeature = feature

      this.timePicker.setHighlightFeature(feature)

      this.detailsElement.classList.remove('hidden')
      this.detailsElement.scrollTop = 0

      this.featureNameElement.innerHTML = feature.get('name')

      this.layerNameElement.innerHTML = layer.get('name')

      if (feature.get('address')) {
        this.featureAddressElement.classList.remove('hidden')
        this.featureAddressElement.innerHTML = feature.get('address')
      } else {
        this.featureAddressElement.classList.add('hidden')
      }

      let description = feature.get('description')
      description = Array.isArray(description) ? description : [description]

      clearElement(this.featureDescriptionElement)

      for (let descItem of description) {
        let p = document.createElement('p')
        p.innerHTML = descItem
        this.featureDescriptionElement.appendChild(p)
      }

      for (let featureLink of this.featureDescriptionElement.querySelectorAll('.feature-link')) {
        featureLink.addEventListener('click', e => {
          this.focusOnFeatureByIds(parseInt(featureLink.dataset.feature), featureLink.dataset.layer)
          e.preventDefault()
        })
      }

      createImageModalLinks(this.featureDescriptionElement)

      let sources = feature.get('sources')
      sources = Array.isArray(sources) ? sources : [sources]

      clearElement(this.featureSourcesElement)

      for (let sourcesItem of sources) {
        let li = document.createElement('li')
        li.innerHTML = sourcesItem
        this.featureSourcesElement.appendChild(li)
      }

      setMapQuery(feature.getId(), layer.get('id'))

      if (this.networkVisible) {
        this.showNetwork()
      }
    }
  }
}
