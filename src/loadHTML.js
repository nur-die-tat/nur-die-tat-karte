let loaded = [];

export function loadHTML(targetSelector, url) {
  return new Promise(resolve => {
    if (loaded.indexOf(url) < 0) {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'text';
      xhr.addEventListener('load', function () {
        loaded.push(url);
        document.querySelector(targetSelector).innerHTML = this.response;
        resolve();
      });
      xhr.send();
    } else {
      resolve();
    }
  });
}
