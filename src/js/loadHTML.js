import {createImageModalLinks} from "./imageModal";
import {createTabLinks} from "./pages";
import {createFeatureLinks} from './featureLinks';
import {isString} from 'lodash/lang'
let loaded = [];

export function loadHTML(targetOrSelector, url, featureDetails) {
  return new Promise(resolve => {
    if (loaded.indexOf(url) < 0) {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'text';
      xhr.addEventListener('load', function () {
        loaded.push(url);
        let target = isString(targetOrSelector) ? document.querySelector(targetOrSelector) : targetOrSelector;
        target.innerHTML = this.response;
        createImageModalLinks(target);
        createTabLinks(target);
        createFeatureLinks(target);
        resolve();
      });
      xhr.send();
    } else {
      resolve();
    }
  });
}
