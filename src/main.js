import {vectorLayers} from 'vectorLayers.js';
import {featureDetails} from 'featureDetails.js';
import {TimePicker} from 'timePicker.js';
import {map} from 'map.js';
import {baseLayers} from "baseLayers.js";
import {positioningHelper} from 'positioningHelper.js';
import {panelHide} from "./panelHide.js";

proj4.defs("EPSG:31466", "+proj=tmerc +lat_0=0 +lon_0=6 +k=1 +x_0=2500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs");

let m = map();
baseLayers(m);
let ls = vectorLayers(m);
featureDetails(m, ls);
let tp = new TimePicker(ls);

panelHide(m);

positioningHelper(m);

let updateSizes = () => {
  $('.tab-content').outerHeight($('body').innerHeight() - $('.navbar').outerHeight());
  m.updateSize();
  tp.update();
};

let resetSizes = () => {
  $('.tab-content').css('height', null);
};

window.addEventListener('resize', () => {
  if ($('#karte').is(':visible')) {
    updateSizes();
  }
});

$('a[data-toggle="tab"][href="#karte"]')
  .on('shown.bs.tab', updateSizes)
  .on('hide.bs.tab', resetSizes);

$('a[data-toggle="tab"]')
  .on('show.bs.tab', function() {
    window.location.hash = $(this).attr('href');
  });

let hash = window.location.hash;

if (hash !== '') {
  let $tab = $(`a[data-toggle="tab"][href="${hash}"]`);
  if ($tab.length === 0) {
    $(`a[data-toggle="tab"][href="#home"]`).tab('show');
  } else {
    $tab.tab('show');
  }
} else {
  $(`a[data-toggle="tab"][href="#home"]`).tab('show');
}
