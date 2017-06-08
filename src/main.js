import {vectorLayers} from 'vectorLayers.js';
import {featureDetails} from 'featureDetails.js';
import {timePicker} from 'timePicker.js';
import {map} from 'map.js';
import {baseLayers} from "baseLayers.js";
import {positioningHelper} from 'positioningHelper.js';
import {panelHide} from "./panelHide.js";

proj4.defs("EPSG:31466","+proj=tmerc +lat_0=0 +lon_0=6 +k=1 +x_0=2500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs");

let m = map();
baseLayers(m);
let ls = vectorLayers(m);
featureDetails(m);
timePicker(ls);

panelHide(m);

positioningHelper(m);
