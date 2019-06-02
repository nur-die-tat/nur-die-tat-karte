'use strict'

/**
 * @param {[number,number]} v
 * @returns {number}
 */
function norm (v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1])
}

/**
 * @param {number} s
 * @param {[number,number]} v
 * @returns {[number,number]}
 */
function scalarMul (s, v) {
  return [s * v[0], s * v[1]]
}

/**
 * @param {[number,number]} a
 * @param {[number,number]} b
 * @returns {[number,number]}
 */
function add (a, b) {
  return [a[0] + b[0], a[1] + b[1]]
}

/**
 * @param {[number,number]} a
 * @param {[number,number]} b
 * @returns {[number,number]}
 */
function sub (a, b) {
  return [a[0] - b[0], a[1] - b[1]]
}

export function createMove (start, end) {
  let moveVector = sub(end, start)
  return v => {
    return add(v, moveVector)
  }
}

export function createScaling (anchor, scale) {
  return v => {
    return add(anchor, scalarMul(scale, sub(v, anchor)))
  }
}

export function angle (a, b) {
  let r = -(Math.atan2(a[1], a[0]) - Math.atan2(b[1], b[0]))

  if (r !== 0 && Math.abs(r) < 0.0001) {
    r = Math.sign(r) * 2 * Math.atan2(
      norm(sub(scalarMul(norm(b), a), scalarMul(norm(a), b))),
      norm(add(scalarMul(norm(b), a), scalarMul(norm(a), b)))
    )
  }

  if (r < 0) {
    return (2 * Math.PI + r)
  } else {
    return r % (2 * Math.PI)
  }
}

function rotate (v, angle) {
  let cos = Math.cos(angle)
  let sin = Math.sin(angle)
  return [cos * v[0] - sin * v[1], sin * v[0] + cos * v[1]]
}

export function createRotation (anchor, angle) {
  return v => {
    return add(anchor, rotate(sub(v, anchor), angle))
  }
}

export function calculateExtent (pixG, pix1, coo1, pix2, coo2) {
  let m = createMove(pix1, coo1)
  let s = createScaling(coo1, norm(sub(coo1, coo2)) / norm(sub(pix1, pix2)))
  let r = createRotation(coo1, angle(sub(pix1, pix2), sub(coo1, coo2)))
  return [...r(s(m([0, 0]))), ...r(s(m(pixG)))]
}
