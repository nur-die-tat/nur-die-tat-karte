import $ from 'jquery';
import html from './time-picker.html';
import './rangeslider.css';

import {addMonths, monthDiff} from "./time-helper";
import {ICONS} from "../icons";
import {mouseMoveListener} from "./mouse-move-listener";

export class TimePicker {
  constructor(targetSelector, configFile, layers) {
    this.target = document.querySelector(targetSelector);
    this.target.innerHTML = html;

    this.layers = layers;
    this.clickTime_ = 20;

    $.getJSON(configFile, config => {
      this.begin = new Date(config.begin);
      this.end = new Date(config.end);
      this.events = config.events;
      this.init();
    });
  }

  init() {
    this.rangeBackground = this.target.querySelector('.rangeslider-range-background');
    this.leftKnob = this.target.querySelector('.rangeslider-range-knob.rangeslider-left-knob');
    this.rightKnob = this.target.querySelector('.rangeslider-range-knob.rangeslider-right-knob');
    this.betweenKnobs = this.target.querySelector('.rangeslider-range-between-knobs');
    this.lineMarkerContainer = this.target.querySelector('.rangeslider-ruler');
    this.yearMarkersContainer = this.target.querySelector('.rangeslider-yearmarkers');
    this.eventArrowsContainer = this.target.querySelector('.rangeslider-event-arrows');
    this.eventTextsContainer = this.target.querySelector('.rangeslider-event-texts');
    this.featureRange = this.target.querySelector('.rangeslider-feature-range');
    this.featureIcon = this.target.querySelector('.rangeslider-feature-icon');

    this.diff = monthDiff(this.begin, this.end);
    this.leftStep = 0;
    this.rightStep = this.diff;

    this.update();
    this.attachLeftKnobListeners();
    this.attachRightKnobListeners();
    this.attachBetweenKnobListeners();
    this.attachBackgroundListeners();
  }

  update() {
    if (this.rangeBackground) {
      this.width = this.rangeBackground.clientWidth; // compensate for border
      this.stepSize = this.width / this.diff;
      this.setLeft(this.leftStep);
      this.setRight(this.rightStep);
      this.createLineMarkers();
      this.createYearMarkers();
      this.createEventMarkers();
    }
  }

  setFeature(begin, end, iconId) {
    this.featureRange.classList.remove('hidden');
    this.featureIcon.classList.remove('hidden');

    let stepsLeft = monthDiff(this.begin, begin);
    let stepsRight = monthDiff(this.begin, end);

    let left = stepsLeft * this.stepSize;
    let right = this.width - stepsRight * this.stepSize;

    this.featureRange.style.left = left + 'px';
    this.featureRange.style.right = right + 'px';

    this.featureIcon.src = ICONS[iconId];
    this.featureIcon.style.left = (left + this.width - right) / 2 - this.featureIcon.clientWidth / 2 + 'px';
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
    this.betweenKnobs.style.right = this.width - this.rightStep * this.stepSize + 'px';
  }

  attachLeftKnobListeners() {
    let startStep;

    mouseMoveListener(this.leftKnob)
      .onMoveStart(e => {
        startStep = this.leftStep;
      })
      .onMove(e => {
        this.setLeft(startStep + Math.round(e.diffX / this.stepSize));
      })
      .onClick(e => {
        this.doClick(e);
      });
  }

  attachRightKnobListeners() {
    let startStep;

    mouseMoveListener(this.rightKnob)
      .onMoveStart(e => {
        startStep = this.rightStep;
      })
      .onMove(e => {
        this.setRight(startStep + Math.round(e.diffX / this.stepSize));
      })
      .onClick(e => {
        this.doClick(e);
      });
  }

  attachBetweenKnobListeners() {
    let startLeft;
    let startRight;

    mouseMoveListener(this.betweenKnobs)
      .onMoveStart(e => {
        startLeft = this.leftStep;
        startRight = this.rightStep;
      })
      .onMove(e => {
        let move = Math.round(e.diffX / this.stepSize);
        this.setLeft(startLeft + move);
        this.setRight(startRight + move);
      })
      .onClick(e => {
        this.doClick(e);
      });
  }

  attachBackgroundListeners() {
    mouseMoveListener(this.rangeBackground)
      .onClick(e => this.doClick(e));
  }

  doClick(e) {
    let offset = this.rangeBackground.offsetLeft + document.querySelector('#footer').offsetLeft;
    let clickStep = Math.round((e.clientX - offset) / this.stepSize);
    if (Math.abs(this.leftStep - clickStep) <= Math.abs(this.rightStep - clickStep)) {
      this.setLeft(clickStep);
    } else {
      this.setRight(clickStep);
    }
    e.stopImmediatePropagation();
  }

  adjustLayers() {
    let begin = new Date(this.begin);
    begin.setMonth(begin.getMonth() + this.leftStep);
    let end = new Date(this.begin);
    end.setMonth(end.getMonth() + this.rightStep);

    for (let l of this.layers) {
      for (let f of l.getSource().getFeatures()) {
        let fBegin = new Date(f.get('begin'));
        let fEnd = new Date(f.get('end'));
        if ((fBegin >= begin && fBegin <= end) || (fEnd >= begin && fEnd <= end)
            || (fBegin < begin && fEnd > end)) {
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

    let date = new Date(this.begin);
    date.setMonth(date.getMonth() + 1);

    for (let i = 1; i < this.diff; i++) {
      let li = document.createElement('li');
      li.style.left = i * this.stepSize - 1 + 'px';
      if (date.getMonth() === 0) {
        li.classList.add('rangeslider-ruler-year');
      } else if (date.getMonth() % 4) {
        li.classList.add('rangeslider-ruler-quarter');
      } else {
        li.classList.add('rangeslider-ruler-month');
      }
      this.lineMarkerContainer.appendChild(li);
      date.setMonth(date.getMonth() + 1);
    }
  }

  createYearMarkers() {
    while (this.yearMarkersContainer.lastChild) {
      this.yearMarkersContainer.removeChild(this.yearMarkersContainer.lastChild);
    }

    let date = new Date(this.begin);
    let steps = 0;
    let lastLeft = -Infinity;

    while (date <= this.end) {
      if (date.getMonth() === 0) {
        let yearNode = document.createElement('div');
        yearNode.textContent = date.getFullYear();
        this.yearMarkersContainer.appendChild(yearNode);

        let left = steps * this.stepSize - yearNode.clientWidth / 2;

        if (left - lastLeft > yearNode.clientWidth) {
          yearNode.style.left = left + 'px';
          lastLeft = left;
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
      eventArrow.style.left = (steps * this.stepSize) + 'px';

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

    let maxRight = this.eventTextsContainer.clientWidth + 2 * overlap;
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


