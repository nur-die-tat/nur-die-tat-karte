import {baseLayers} from "./baseLayers";
import {TimePicker} from "./time-picker/time-picker";
import {featureDetails} from "./feature-details";
import {panelHide} from "./panelHide";
import {vectorLayers} from "./vectorLayers";
import {FeatureDetails} from "./feature-details";

export function createMap() {
  // proj4.defs("EPSG:31466", "+proj=tmerc +lat_0=0 +lon_0=6 +k=1 +x_0=2500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs");

  let map = new ol.Map({
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

  baseLayers(map);
  let vectorLayers_ = vectorLayers(map);
  let timePicker = new TimePicker('#footer', 'data/time-line.json', vectorLayers_);
  let features = new FeatureDetails(map, vectorLayers_, timePicker);

  panelHide(map);

  window.map = map;

  let updateSizes = () => {
    $('.tab-content').outerHeight($('body').innerHeight() - $('.navbar').outerHeight());
    map.updateSize();
    timePicker.update();
  };

  let resetSizes = () => {
    $('.tab-content').css('height', null);
  };

  $('a[data-toggle="tab"][data-target="#karte-tab"]')
    .on('shown.bs.tab', updateSizes)
    .on('hide.bs.tab', resetSizes);

  window.addEventListener('resize', () => {
    if ($('#karte-tab').is(':visible')) {
      updateSizes();
    }
  });

  return map;
}
