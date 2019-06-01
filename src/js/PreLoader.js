import {loadHTML} from "./loadHTML";

export class PreLoader extends ol.Observable {
  constructor () {
    super();
    this.files = {};
    this.types = {};
    this.loaded = false;
  }

  add (fileName, type = null) {
    this.files[fileName] = null;
    this.types[fileName] = type || fileName.match(/\.([^.]*)$/)[1];
  }

  load () {
    const fileNames = Object.keys(this.files);
    let loading = fileNames.length;

    const loaded = () => {
      loading--;
      if (loading === 0) {
        this.loaded = true;
        this.dispatchEvent('ready');
      }
    };

    const onError = () => { throw new Error(`Preloader: Failed to load file '${fileName}'`) };

    for (const fileName of fileNames) {
      const type = this.types[fileName];
      let xhr;
      switch (type) {
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
          const img = new Image();
          img.src = fileName;
          img.addEventListener('load', () => {
            this.files[fileName] = img;
            loaded();
          });
          img.addEventListener('error', onError);
          break;
        case 'json':
          xhr = new XMLHttpRequest();
          xhr.responseType = 'json';
          xhr.open('GET', fileName);
          xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
              this.files[fileName] = xhr.response;
              loaded();
            } else {
              onError();
            }
          });
          xhr.send();
          break;
        case 'txt':
          xhr = new XMLHttpRequest();
          xhr.responseType = 'text';
          xhr.open('GET', fileName);
          xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
              this.files[fileName] = xhr.response;
              loaded();
            } else {
              onError();
            }
          });
          xhr.send();
          break;
        default:
          throw new Error(`Preloader: The file '${fileName}' has an unknown type '${type}'`);
      }
    }

    return new Promise(resolve => {
      this.once('ready', resolve)
    })
  }

  get (fileName) {
    if (!this.loaded || !this.files.hasOwnProperty(fileName) || this.files[fileName] === null) {
        throw new Error(`Preloader: File has not been fetched. Are you trying to get/add after the load?`)
    }
    return this.files[fileName];
  }
}