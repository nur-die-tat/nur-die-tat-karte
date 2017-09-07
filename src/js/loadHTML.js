import {createImageModalLinks} from "./imageModal";
let loaded = [];

export function loadHTML(targetSelector, url) {
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
        resolve();
      });
      xhr.send();
    } else {
      resolve();
    }
  });
}
