'use strict';

import {expect} from 'chai';
import {createMove, createScaling, angle, createRotation, calculateExtent} from '../src/calculateExtent';


describe('createMove from [1,1] to [3,4]', function() {
  let move = createMove([1,1], [3,4]);

  it('should properly translate [1,1]', function() {
    expect(move([1,1])).to.be.deep.equal([3, 4]);
  });

  it('should properly translate [0,0]', function() {
    expect(move([0,0])).to.be.deep.equal([2, 3]);
  });

  it('should properly translate [-3,4]', function() {
    expect(move([-3,4])).to.be.deep.equal([-1, 7]);
  });
});

describe('createScaling with anchor [2,3] and scaling by 2', function () {
  let scale = createScaling([2,3], 2);

  it('should properly translate [2,3]', function () {
    expect(scale([2,3])).to.be.deep.equal([2,3]);
  });

  it('should properly translate [0,0]', function () {
    expect(scale([0,0])).to.be.deep.equal([-2,-3]);
  });

  it('should properly translate [4,4]', function () {
    expect(scale([4,4])).to.be.deep.equal([6,5]);
  });

  it('should properly translate [-2,4]', function () {
    expect(scale([-2,4])).to.be.deep.equal([-6,5]);
  });
});

describe('calculateAngle', function () {
  let error = 0.0000001;
  let range = 0.0001;

  it('between [1, 0] and [1,0]', function () {
    let r = angle([1, 0], [1, 0]);
    expect(r).to.be.equal(0);
  });

  it('between [1, 0] and [0,1]', function () {
    let r = angle([1, 0], [0, 1]);
    expect(r).to.be.within((Math.PI / 2) - error, (Math.PI / 2) + error);
  });

  it('between [1, 0] and [-1,0]', function () {
    let r = angle([1, 0], [-1, 0]);
    expect(r).to.be.within(Math.PI - error, Math.PI + error);
  });

  it('between [1, 0] and [0,-1]', function () {
    let r = angle([1, 0], [0,-1]);
    expect(r).to.be.within((3 * Math.PI / 2) - error, (3 * Math.PI / 2) + error);
  });

  it('between [1,0] and [10000,1]', function () {
    let r = angle([1,0], [10000,1]);
    expect(r).to.be.within(0, range);
  });

  it('between [1,0] and [10000,-1]', function () {
    let r = angle([1,0], [10000,-1]);
    expect(r).to.be.within(2 * Math.PI - range, 2 * Math.PI);
  });
});

describe('createRotation rotates around [1,1] by Math.PI / 2', function () {
  let rotate = createRotation([1,1], Math.PI / 2);
  let error = 0.0000001;

  it('should rotate [4,1] to [1,4]', function () {
    let r = rotate([4,1]);
    expect(r[0]).to.be.within(1 - error, 1 + error);
    expect(r[1]).to.be.within(4 - error, 4 + error);
  });

  it('should rotate [1,7] to [-5,1]', function () {
    let r = rotate([1,7]);
    expect(r[0]).to.be.within(-5 - error, -5 + error);
    expect(r[1]).to.be.within(1 - error, 1 + error);
  });

  it('should rotate [-2,1] to [1,-1]', function () {
    let r = rotate([-2,1]);
    expect(r[0]).to.be.within(1 - error, 1 + error);
    expect(r[1]).to.be.within(-2 - error, -2 + error);
  });

  it('should rotate [1,-5] to [7,1]', function () {
    let r = rotate([1,-5]);
    expect(r[0]).to.be.within(7 - error, 7 + error);
    expect(r[1]).to.be.within(1 - error, 1 + error);
  });
});

describe('calculateExtent', function () {
  let error = 0.0000001;

  it('should calculate the extent for 4 x 4 pixel area correctly', function () {
    let e = calculateExtent([4, 4], [1,1], [-3, 5], [3,3], [-7, 9]);
    expect(e[0]).to.be.within(-1 - error, -1 + error);
    expect(e[1]).to.be.within(3 - error, 3 + error);
    expect(e[2]).to.be.within(-9 - error, -9 + error);
    expect(e[3]).to.be.within(11 - error, 11 + error);
  });
});