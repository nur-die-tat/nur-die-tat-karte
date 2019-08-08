import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { createEmpty, extend, getCenter, getHeight, getWidth } from 'ol/extent'
import Cluster from 'ol/source/Cluster'
import Point from 'ol/geom/Point'
import Text from 'ol/style/Text'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'

export function clusterLayer (map, vectorLayers, preLoader, icons) {
  const allFeaturesSource = new VectorSource()
  let clusterStyleNorm, clusterStyleActive

  const distance = 40

  function extentSmall (extent) {
    return getWidth(extent) + getHeight(extent) < 4 * map.getView().getResolution() * distance
  }

  const clusterLayer_ = new VectorLayer({
    source: new Cluster({
      source: allFeaturesSource,
      geometryFunction: f => {
        if (f.get('hidden')) {
          setTimeout(() => f.set('clustered', false), 0)
          return null
        }
        const geom = f.getGeometry()
        if (geom instanceof Point) {
          return geom
        } else if (extentSmall(geom.getExtent())) {
          // if (geom instanceof GeometryCollection) {
          //   debugger
          // }
          return new Point(getCenter(geom.getExtent()))
        } else {
          setTimeout(() => f.set('clustered', false), 0)
          return null
        }
      },
      distance
    }),
    updateWhileAnimating: true,
    style: (feature, resolution) => {
      if (feature.get('features') && feature.get('features').length > 1) {
        for (const clusteredFeature of feature.get('features')) {
          clusteredFeature.set('clustered', true)
        }

        const style = feature.get('features').some(f => f.get('active')) ? clusterStyleActive : clusterStyleNorm
        style.getText().setText(feature.get('features').length.toString())
        return style
      } else {
        if (feature.get('features')) {
          feature = feature.get('features')[0]
        }
        feature.set('clustered', false)
        return null
      }
    },
    zIndex: 3
  })

  map.getLayers().insertAt(0, clusterLayer_)

  for (const layer of vectorLayers) {
    allFeaturesSource.addFeatures(layer.getSource().getFeatures())
    layer.getSource().on('addfeature', e => {
      allFeaturesSource.addFeature(e.feature)
    })
  }

  preLoader.on('ready', () => {
    const imgNorm = icons.get('empty', false)
    clusterStyleNorm = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        img: imgNorm,
        imgSize: [imgNorm.width, imgNorm.height]
      }),
      text: new Text({
        font: '18px \'Josefin Slab\', serif',
        textAlign: 'center',
        textBaseline: 'middle',
        offsetX: 0,
        offsetY: -20
      })
    })

    let imgActive = icons.get('empty', true)
    clusterStyleActive = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        img: imgActive,
        imgSize: [imgActive.width, imgActive.height]
      }),
      text: new Text({
        font: '18px \'Josefin Slab\', serif',
        textAlign: 'center',
        textBaseline: 'middle',
        offsetX: 0,
        offsetY: -20
      })
    })
  })

  map.on('click', e => {
    map.forEachFeatureAtPixel(e.pixel, (f) => {
      const extent = createEmpty()
      for (const feature of f.get('features')) {
        extend(extent, feature.getGeometry().getExtent())
        console.log(feature.get('name'))
      }
      map.getView().fit(extent, { padding: [100, 100, 100, 100], duration: 1000 })
    }, { layerFilter: l => l === clusterLayer_ })
  })

  return clusterLayer_
}
