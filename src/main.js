import {vectorLayers} from 'vectorLayers.js';
import {featureDetails} from 'featureDetails.js';
import {timePicker} from 'timePicker.js';
import {map} from 'map.js';

let m = map();
let ls = vectorLayers(m);
featureDetails(m);
timePicker(ls);
