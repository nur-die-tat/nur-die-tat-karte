/* globals ol */

class EventChannel extends ol.Observable {
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
