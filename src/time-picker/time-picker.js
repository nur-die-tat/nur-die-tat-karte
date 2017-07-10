import $ from 'jquery';
import {Subject} from '../../node_modules/rxjs/bundles/rx.js';

import html from './time-picker.html';
import './rangeslider.css';

import {addMonths, monthDiff} from "./time-helper";

export class TimePicker {
  constructor(targetSelector, configFile, layers) {
    this.target = document.querySelector(targetSelector);
    this.target.innerHTML = html;

    this.layers = layers;

    $.getJSON(configFile, config => {
      this.begin = new Date(config.begin);
      this.end = new Date(config.end);
      this.events = config.events;
      this.init();
    });
  }

  init() {
    this.diff = monthDiff(this.begin, this.end);

    this.rangeBackground = this.target.querySelector('.rangeslider-range-background');

    this.stepSize = this.rangeBackground.clientWidth / this.diff;

    // this.rangeBackground.style['background-image'] = `repeating-linear-gradient(90deg, transparent, transparent ${this.stepSize - 1}px, black  ${this.stepSize - 1}px, black  ${this.stepSize}px)`;

    this.leftKnob = this.target.querySelector('.rangeslider-range-knob.rangeslider-left-knob');
    this.rightKnob = this.target.querySelector('.rangeslider-range-knob.rangeslider-right-knob');

    this.betweenKnobs = this.target.querySelector('.rangeslider-range-between-knobs');

    this.lineMarkerContainer = this.target.querySelector('.rangeslider-ruler');

    this.yearMarkersContainer = this.target.querySelector('.rangeslider-yearmarkers');
    this.eventsContainer = this.target.querySelector('.rangeslider-time-events');

    this.setLeft(0);
    this.setRight(this.diff);
    this.attachLeftKnobListeners();
    this.attachRightKnobListeners();
    this.attachBetweenKnobListeners();

    this.createLineMarkers();
    this.createEventMarkers();
  }

  update() {
    if (this.rangeBackground) {
      this.stepSize = this.rangeBackground.clientWidth / this.diff;
      //this.rangeBackground.style['background-image'] = `repeating-linear-gradient(90deg, transparent, transparent ${this.stepSize - 1}px, black  ${this.stepSize - 1}px, black  ${this.stepSize}px)`;
      this.setLeft(this.leftStep);
      this.setRight(this.rightStep);
      this.createEventMarkers();
      this.createLineMarkers();
    }
  }

  createLineMarkers() {
    // clear
    while (this.lineMarkerContainer.lastChild) {
      this.lineMarkerContainer.removeChild(this.lineMarkerContainer.lastChild);
    }

    for (let i = 1; i < this.diff; i++) {
      let li = document.createElement('li');
      li.style['left'] = i * this.stepSize - 1 + 'px';
      this.lineMarkerContainer.appendChild(li);
    }
  }

  setLeft(step) {
    step = (step < 0) ? 0 : step;
    step = (step >= this.rightStep) ? this.rightStep - 1 : step;
    this.leftStep = step;
    this.leftKnob.style.left = step * this.stepSize + 'px';
    this.adjustBetweenKnobs();
    this.adjustLayers();
  }

  setRight(step) {
    step = (step <= this.leftStep) ? this.leftStep + 1 : step;
    step = (step > this.diff) ? this.diff : step;
    this.rightStep = step;
    this.rightKnob.style.left = this.rightStep * this.stepSize + 'px';
    this.adjustBetweenKnobs();
    this.adjustLayers();
  }

  adjustBetweenKnobs() {
    this.betweenKnobs.style.left = this.leftStep * this.stepSize + 'px';
    this.betweenKnobs.style.right = this.rangeBackground.clientWidth - this.rightStep * this.stepSize + 'px';
  }

  attachLeftKnobListeners() {
    let mouseDown = false;

    let startStep;
    let startX;

    this.leftKnob.addEventListener('mousedown', e => {
      startStep = this.leftStep;
      startX = e.screenX;
      mouseDown = true;
      e.stopImmediatePropagation();
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (mouseDown) {
        let x = e.screenX - startX;
        this.setLeft(startStep + Math.round(x / this.stepSize));
      }
    });

    document.addEventListener('mouseup', () => {
      mouseDown = false;
    });
  }

  attachRightKnobListeners() {
    let mouseDown = false;

    let startStep;
    let startX;

    this.rightKnob.addEventListener('mousedown', e => {
      startStep = this.rightStep;
      startX = e.screenX;
      mouseDown = true;
      e.stopImmediatePropagation();
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (mouseDown) {
        let x = e.screenX - startX;
        this.setRight(startStep + Math.round(x / this.stepSize));
      }
    });

    document.addEventListener('mouseup', () => {
      mouseDown = false;
    });
  }

  attachBetweenKnobListeners() {
    let mouseDown = false;

    let startLeft;
    let startRight;
    let startX;

    this.betweenKnobs.addEventListener('mousedown', e => {
      mouseDown = true;
      startLeft = this.leftStep;
      startRight = this.rightStep;
      startX = e.screenX;
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (mouseDown) {
        let x = e.screenX - startX;
        let move = Math.round(x / this.stepSize);
        this.setLeft(startLeft + move);
        this.setRight(startRight + move);
      }
    });

    document.addEventListener('mouseup', () => {
      mouseDown = false;
    });
  }

  adjustLayers() {
    for (let l of this.layers) {
      for (let f of l.getSource().getFeatures()) {
        let fBegin = new Date(f.get('begin'));
        let fEnd = new Date(f.get('end'));
        if ((fBegin >= this.begin && fBegin <= this.end) || (fEnd >= this.begin && fEnd <= this.end)) {
          f.set('hidden', false);
        }
        else {
          f.set('hidden', true);
        }
      }
    }
  }

  createEventMarkers() {
    for (let event of this.events) {
      let eventNode = document.createElement('li');
      eventNode.innerHTML = event.name;

      this.eventsContainer.appendChild(eventNode);

      let steps = monthDiff(this.begin, new Date(event.time));
      eventNode.style.left = (25 + steps * this.stepSize - eventNode.clientWidth / 2) + 'px';
    }
  }

  // createNumberMarkers() {
  //   if (this.markerContainer) {
  //     this.element.removeChild(this.markerContainer);
  //   }
  //   this.markerContainer = document.createElement('div');
  //   this.element.appendChild(this.markerContainer);
  //   this.markerContainer.classList.add('rangeslider-yearmarker-container');
  //
  //   let date = new Date(this.begin);
  //   let steps = 0;
  //   let lastLeft = -Infinity;
  //
  //   while (date <= this.end) {
  //     if (date.getMonth() === 0) {
  //       let yearNode = document.createElement('div');
  //       this.markerContainer.appendChild(yearNode);
  //       yearNode.classList.add('rangeslider-yearmarker');
  //       yearNode.textContent = date.getFullYear();
  //
  //       let newLeft = steps * this.stepSize - yearNode.offsetWidth / 2;
  //
  //       if (newLeft - lastLeft > yearNode.offsetWidth) {
  //         yearNode.style.left = newLeft + 'px';
  //         lastLeft = newLeft;
  //       }
  //       else {
  //         this.markerContainer.removeChild(yearNode);
  //       }
  //     }
  //
  //     steps++;
  //     date.setMonth(date.getMonth() + this.gridSize);
  //   }
  // }
}


