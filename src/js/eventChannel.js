class EventChannel extends ol.Observable {
  dispatchMapCreated() {
    this.dispatchEvent('mapCreated');
  }

  dispatchMapQuery(mapQuery) {
    this.dispatchEvent({
      type: 'mapQuery',
      mapQuery
    });
  }

  onceLayersLoaded(fn) {
    if (this.layersLoaded_) {
      fn();
    } else {
      this.once('layersLoaded', fn);
    }
  }

  dispatchLayerLoaded() {
    this.layersLoaded_ = true;
    this.dispatchEvent('layersLoaded')
  }
}

export const eventChannel = new EventChannel();
