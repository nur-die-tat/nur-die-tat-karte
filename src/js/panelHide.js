import {Subject} from "rxjs/Subject";

export class PanelHide {
  constructor () {
    this.leftPanel = document.querySelector('#left-panel');
    this.hideButton = document.querySelector('#left-panel-hide-button');
    this.showButton = document.querySelector('#left-panel-show-button');

    this.visible = true;

    this.hideButton.addEventListener('click', () => {
      this.hideButton.classList.add('hidden');
      this.showButton.classList.remove('hidden');
      this.leftPanel.classList.add('hidden');
      this.visible = false;
      this.update();
      this.toggleSubject.next('hide');
    });

    this.showButton.addEventListener('click', () => {
      this.hideButton.classList.remove('hidden');
      this.showButton.classList.add('hidden');
      this.leftPanel.classList.remove('hidden');
      this.visible = true;
      this.update();
      this.toggleSubject.next('show');
    });

    this.toggleSubject = new Subject();

    this.update();
  }

  getToggleObservable () {
    return this.toggleSubject.asObservable();
  }

  update () {
    if (this.visible) {
      this.hideButton.style.left = this.leftPanel.clientWidth + 'px';

      this.showButton.style.top = this.hideButton.style.top
        = this.leftPanel.clientHeight / 2 + 'px';
    }
  }
}