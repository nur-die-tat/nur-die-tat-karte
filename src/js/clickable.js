export function clickable (map, vectorLayers, clusterLayer) {
  map.on('pointermove', e => {
    if (map.hasFeatureAtPixel(e.pixel, {
      layerFilter: l => vectorLayers.includes(l) || l === clusterLayer
    })) {
      map.getViewport().style.cursor = 'pointer'
    } else {
      map.getViewport().style.cursor = 'auto'
    }
  })
}
