import VectorSource from 'ol/source/Vector'
import Collection from 'ol/Collection'

export class VectorSourceLayerGroup extends VectorSource {
  constructor (options) {
    super({
      attributions: options.attributions,
      wrapX: options.wrapX
    })

    /**
     * @type {Collection<VectorLayer>}
     * @private
     */
    this.layers_ = new Collection()

    this.boundRefresh_ = () => this.refresh()

    for (const layer of options.layers) {
      this.addLayer(layer)
    }
  }

  addLayer (layer) {
    this.layers_.push(layer)
    layer.on('change', this.boundRefresh_)
    layer.getSource().on('change', this.boundRefresh_)
    this.refresh()
  }

  removeSource (layer) {
    this.layers_.remove(layer)
    layer.on('change', this.boundRefresh_)
    layer.getSource().un('change', this.boundRefresh_)
    this.refresh()
  }

  loadFeatures (extent, resolution, projection) {
    this.layers_.forEach(layer => {
      layer.getSource().loadFeatures(extent, resolution, projection)
    })
  }

  refresh () {
    this.clear()
    this.layers_.forEach(layer => {
      if (layer.getVisible()) {
        this.addFeatures(layer.getSource().getFeatures())
      }
    })
  }

  getLayers () {
    return this.layers_
  }
}
