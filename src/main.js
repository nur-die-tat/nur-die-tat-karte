import {vectorLayers} from './vectorLayers.js';
import {featureDetails} from './featureDetails.js';
import {TimePicker} from './time-picker/time-picker.js';
import {map} from './map.js';
import {baseLayers} from "./baseLayers.js";
import {positioningHelper, lineHelper} from './positioningHelper.js';
import {panelHide} from "./panelHide.js";
import {createImageModalLinks} from "./imageModal.js";

import './design.css';

proj4.defs("EPSG:31466", "+proj=tmerc +lat_0=0 +lon_0=6 +k=1 +x_0=2500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs");

let m = map();
baseLayers(m);
let ls = vectorLayers(m);
let tp = new TimePicker('#footer', 'data/time-line.json', ls);
featureDetails(m, ls, tp);


panelHide(m);

// positioningHelper(m);
// lineHelper(m);

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

window.scrollTo(0, 0);

createImageModalLinks(document.body);
