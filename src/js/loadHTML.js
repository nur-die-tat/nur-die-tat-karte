import {createImageModalLinks} from "./imageModal";
import {createTabLinks} from "./tabs";
import {createFeatureLinks} from './featureLinks';
let loaded = [];

export function loadHTML(targetSelector, url, featureDetails) {
  return new Promise(resolve => {
    if (loaded.indexOf(url) < 0) {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'text';
      xhr.addEventListener('load', function () {
        loaded.push(url);
        let target = document.querySelector(targetSelector);
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
