export function map() {
  let m = new ol.Map({
    target: 'map',
    controls: ol.control.defaults({
      attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
        collapsible: false
      })
    }),
    view: new ol.View({
      center: [774650.6822121775, 6611267.730243302],
      zoom: 15
    })
  });

  window.map = m;

  return m;
}
