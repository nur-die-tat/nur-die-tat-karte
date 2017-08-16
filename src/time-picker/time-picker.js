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

    this.stepSize = (this.rangeBackground.clientWidth - 18) / this.diff; // cheat

    this.leftKnob = this.target.querySelector('.rangeslider-range-knob.rangeslider-left-knob');
    this.rightKnob = this.target.querySelector('.rangeslider-range-knob.rangeslider-right-knob');

    this.betweenKnobs = this.target.querySelector('.rangeslider-range-between-knobs');

    this.lineMarkerContainer = this.target.querySelector('.rangeslider-ruler');

    this.yearMarkersContainer = this.target.querySelector('.rangeslider-yearmarkers');
    this.eventArrowsContainer = this.target.querySelector('.rangeslider-event-arrows');
    this.eventTextsContainer = this.target.querySelector('.rangeslider-event-texts');

    this.setLeft(0);
    this.setRight(this.diff);
    this.attachLeftKnobListeners();
    this.attachRightKnobListeners();
    this.attachBetweenKnobListeners();

    this.createLineMarkers();
    this.createYearMarkers();
    this.createEventMarkers();
  }

  update() {
    if (this.rangeBackground) {
      this.stepSize = this.rangeBackground.clientWidth / this.diff;
      this.setLeft(this.leftStep);
      this.setRight(this.rightStep);
      this.createLineMarkers();
      this.createYearMarkers();
      this.createEventMarkers();
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

  createLineMarkers() {
    // clear
    while (this.lineMarkerContainer.lastChild) {
      this.lineMarkerContainer.removeChild(this.lineMarkerContainer.lastChild);
    }

    for (let i = 1; i < this.diff; i++) {
      let li = document.createElement('li');
      li.style.left = i * this.stepSize - 1 + 'px';
      this.lineMarkerContainer.appendChild(li);
    }
  }

  createYearMarkers() {
    while (this.yearMarkersContainer.lastChild) {
      this.yearMarkersContainer.removeChild(this.yearMarkersContainer.lastChild);
    }

    let date = new Date(this.begin);
    let steps = 0;
    let lastLeft = -Infinity;
    let overlap = 25;

    while (date <= this.end) {
      if (date.getMonth() === 0) {
        let yearNode = document.createElement('div');
        this.yearMarkersContainer.appendChild(yearNode);
        yearNode.textContent = date.getFullYear();

        let left = steps * this.stepSize - yearNode.clientWidth / 2 - overlap;

        if (left - lastLeft > yearNode.clientWidth) {
          yearNode.style.left = left + 'px';
          lastLeft = left;
          this.yearMarkersContainer.style.height =
            Math.max(this.yearMarkersContainer.clientHeight, yearNode.clientHeight) + 'px';
        }
        else {
          this.yearMarkersContainer.removeChild(yearNode);
        }
      }

      steps++;
      date.setMonth(date.getMonth() + 1);
    }
  }

  createEventMarkers() {
    while (this.eventArrowsContainer.lastChild) {
      this.eventArrowsContainer.removeChild(this.eventArrowsContainer.lastChild);
    }
    while (this.eventTextsContainer.lastChild) {
      this.eventTextsContainer.removeChild(this.eventTextsContainer.lastChild);
    }

    let spacing = 10;
    let overlap = 25;
    let lastTextRight = -overlap;
    for (let event of this.events) {
      let steps = monthDiff(this.begin, new Date(event.time));

      let eventArrow = document.createElement('img');
      eventArrow.src = '../../images/arrow.png';
      this.eventArrowsContainer.appendChild(eventArrow);
      eventArrow.style.left = (steps * this.stepSize - 6) + 'px'; // arrow.png is 11px wide

      let eventText = document.createElement('li');
      eventText.innerHTML = event.name;
      this.eventTextsContainer.appendChild(eventText);
      let left = steps * this.stepSize - eventText.clientWidth / 2;
      if (left < -overlap) {
        left = -overlap;
      } else if (left < lastTextRight) {
        left = lastTextRight + spacing;
      }
      eventText.style.left = left + 'px';
      lastTextRight = left + eventText.clientWidth;
    }

    let maxRight = this.eventTextsContainer.clientWidth + overlap;
    let nextTextLeft = maxRight;
    for (let i = this.events.length -1; i>= 0; i--) {
      let eventText = this.eventTextsContainer.childNodes[i];
      let left = eventText.offsetLeft;
      let right = left + eventText.clientWidth;
      if (right > maxRight) {
        left = maxRight - eventText.clientWidth;
      } else if (right > nextTextLeft) {
        left = nextTextLeft - spacing - eventText.clientWidth;
      } else {
        break;
      }
      eventText.style.left = left + 'px';
      let nextTextLeft = left;
    }
  }
}


