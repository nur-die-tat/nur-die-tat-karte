import Observable from 'ol/Observable'

class EventChannel extends Observable {
  dispatchMapCreated () {
    this.dispatchEvent('mapCreated')
  }

  dispatchMapQuery (mapQuery) {
    this.dispatchEvent({
      type: 'mapQuery',
      mapQuery
    })
  }
}

export const eventChannel = new EventChannel()
