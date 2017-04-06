export function map() {
  let m = new ol.Map({
    target: 'map',
    controls: ol.control.defaults({
      attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
        collapsible: false
      })
    }),
    view: new ol.View({
      center: [773093.4082384865, 6602774.984637728],
      zoom: 11
    })
  });

  window.map = m;

  return m;
}