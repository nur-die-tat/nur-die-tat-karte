import { createEmpty, extend } from 'ol/extent'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { labelStyle } from './vectorLayerStyle'

export function handleMouse (map, vectorLayers, featureDetails) {
  function getVectorLayer (feature) {
    return vectorLayers.find(l => l.getSource().getFeatures().includes(feature))
  }

  const labelHighlightSource = new VectorSource({
    features: []
  })

  map.addLayer(new VectorLayer({
    source: labelHighlightSource,
    style: f => {
      if (f.get('features').length === 1) {
        labelStyle.getText().setText(f.get('features')[0].get('name'))
        return labelStyle
      }
    },
    zIndex: 10
  }))

  let hovered = null
  const resetHover = () => {
    if (hovered) {
      labelHighlightSource.removeFeature(hovered)
      hovered = null
    }
  }

  map.on('pointermove', e => {
    resetHover()
    const clickable = map.forEachFeatureAtPixel(e.pixel, (feature) => {
      if (feature.get('features')) {
        return feature
      }
    })

    if (clickable) {
      map.getViewport().style.cursor = 'pointer'
      hovered = clickable
      labelHighlightSource.addFeature(hovered)
    } else {
      map.getViewport().style.cursor = 'auto'
    }
  })

  map.on('click', e => {
    map.forEachFeatureAtPixel(e.pixel, (feature) => {
      if (feature.get('features').length > 1) {
        const extent = createEmpty()
        for (const f of feature.get('features')) {
          extend(extent, f.getGeometry().getExtent())
        }
        map.getView().fit(extent, { padding: [100, 100, 100, 100], duration: 1000 })
      } else {
        feature = feature.get('features')[0]
        const layer = getVectorLayer(feature)
        if (layer) {
          featureDetails.showFeatureDetails(feature, layer)
        }
      }
    })
  })
}
