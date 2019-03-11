import $ from 'jquery';
import htmlUrl from 'file-loader?name=assets/[name].[ext]!../../html/time-picker.html';
import '../../css/rangeslider.css';

import {addMonths, monthDiff, minDate, maxDate} from "./time-helper";
import {ICONS} from "../icons";
import {mouseMoveListener} from "./mouse-move-listener";
import {loadHTML} from "../loadHTML";
import {clearElement} from "../utils";

export class TimePicker extends ol.Observable {
  constructor(targetSelector, configFile, layers, view) {
    super();
    this.layers = layers;
    this.view = view;

    this.configFile = configFile;
    this.target = document.querySelector(targetSelector);
  }

  init() {
    return Promise.all([
      loadHTML(this.target, htmlUrl),
      $.getJSON(this.configFile, config => {
        this.begin = new Date(config.begin);
        this.end = new Date(config.end);
        this.events = config.events;
      })
    ]).then(() => {
      this.rangeBackground = this.target.querySelector('.rangeslider-range-background');
      this.leftKnob = this.target.querySelector('.rangeslider-range-knob.rangeslider-left-knob');
      this.rightKnob = this.target.querySelector('.rangeslider-range-knob.rangeslider-right-knob');
      this.betweenKnobs = this.target.querySelector('.rangeslider-range-between-knobs');
      this.lineMarkerContainer = this.target.querySelector('.rangeslider-ruler');
      this.yearMarkersContainer = this.target.querySelector('.rangeslider-yearmarkers');
      this.eventArrowsContainer = this.target.querySelector('.rangeslider-event-arrows');
      this.eventTextsContainer = this.target.querySelector('.rangeslider-event-texts');
      this.featureRange = this.target.querySelector('.rangeslider-feature-range');
      this.featureHighlightIcon = this.target.querySelector('.rangeslider-feature-highlight-icon');
      this.featureIcons = this.target.querySelector('.rangeslider-feature-icons');

      this.diff = monthDiff(this.begin, this.end);
      this.leftStep = 0;
      this.rightStep = this.diff;

      this.update();
      this.attachLeftKnobListeners();
      this.attachRightKnobListeners();
      this.attachBetweenKnobListeners();
      this.attachBackgroundListeners();
    });
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

  unsetFeature() {
    this.featureRange.classList.add('hidden');
    this.featureIcon.classList.add('hidden');
  }

  clearFeatures() {
    clearElement(this.featureIcons);
  }

  setFeatures(features, layer) {
    for (const feature of features) {
      if (this.isFeatureInTimeline(feature)) {
        const featureBegin = new Date(feature.get('begin'));
        const featureEnd = new Date(feature.get('end'));
        const iconId = feature.get('icon');

        const img = document.createElement('img');
        const stepsLeft = monthDiff(this.begin, maxDate(this.begin, featureBegin));
        const stepsRight = monthDiff(this.begin, minDate(this.end, featureEnd));

        const left = stepsLeft * this.stepSize;
        const right = this.width - stepsRight * this.stepSize;

        img.src = ICONS[iconId].normal;
        img.title = feature.get('name');
        img.style.left = (left + this.width - right) / 2 - img.clientWidth / 2 + 10 + 'px';

        img.addEventListener('click', () => {
          this.dispatchEvent({
            type: 'click:feature',
            layer,
            feature
          });
        });

        this.featureIcons.appendChild(img);
      }
    }
  }

  setHighlightFeature(feature) {
    const begin = new Date(feature.get('begin'));
    const end = new Date(feature.get('end'));
    const iconId = feature.get('icon');

    this.featureRange.classList.remove('hidden');
    this.featureHighlightIcon.classList.remove('hidden');

    const stepsLeft = monthDiff(this.begin, maxDate(this.begin, begin));
    const stepsRight = monthDiff(this.begin, minDate(this.end, end));

    const left = stepsLeft * this.stepSize;
    const right = this.width - stepsRight * this.stepSize;

    this.featureRange.style.left = left + 'px';
    this.featureRange.style.right = right + 'px';

    this.featureHighlightIcon.src = ICONS[iconId].active;
    this.featureHighlightIcon.style.left = (left + this.width - right) / 2 - this.featureHighlightIcon.clientWidth / 2 + 'px';
  }

  setLeft(step) {
    step = (step < 0) ? 0 : step;
    step = (step >= this.rightStep) ? this.rightStep - 1 : step;
    this.leftStep = step;
    this.leftKnob.style.left = step * this.stepSize + 'px';
    this.adjustBetweenKnobs();
    this.adjustLayers();
    this.showVisibleFeatures();
  }

  setRight(step) {
    step = (step <= this.leftStep) ? this.leftStep + 1 : step;
    step = (step > this.diff) ? this.diff : step;
    this.rightStep = step;
    this.rightKnob.style.left = this.rightStep * this.stepSize + 'px';
    this.adjustBetweenKnobs();
    this.adjustLayers();
    this.showVisibleFeatures();
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

  isFeatureInTimeline(feature) {
    let timelineBegin = new Date(this.begin);
    timelineBegin.setMonth(timelineBegin.getMonth() + this.leftStep);
    let timelineEnd = new Date(this.begin);
    timelineEnd.setMonth(timelineEnd.getMonth() + this.rightStep);
    let fBegin = new Date(feature.get('begin'));
    let fEnd = new Date(feature.get('end'));
    return (fBegin >= timelineBegin && fBegin <= timelineEnd) || (fEnd >= timelineBegin && fEnd <= timelineEnd)
      || (fBegin < timelineBegin && fEnd > timelineEnd);
  }

  adjustLayers() {
    for (const layer of this.layers) {
      for (const feature of layer.getSource().getFeatures()) {
        if (this.isFeatureInTimeline(feature)) {
          feature.set('hidden', false);
        } else {
          feature.set('hidden', true);
        }
      }
    }
  }

  createLineMarkers() {
    clearElement(this.lineMarkerContainer);

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
    clearElement(this.yearMarkersContainer);

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
    clearElement(this.eventArrowsContainer);
    clearElement(this.eventTextsContainer);

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

  showVisibleFeatures() {
    this.clearFeatures();
    const extent = this.view.calculateExtent();
    for (const layer of this.layers) {
      this.setFeatures(layer.getSource().getFeaturesInExtent(extent), layer);
    }
  }
}
