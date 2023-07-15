export function isTouchDevice() {
  return 'ontouchstart' in window
    || 'onmsgesturechange' in window
}

/**
 * 缓动公式
 * @param {*} t 动画执行到当前帧所进过的时间
 * @param {*} b 起始值
 * @param {*} c 需要变化的量
 * @param {*} d duration，动画的总时间
 */
export function easeInOutQuad(t, b, c, d) {
  return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
}

export function query(selector) {
  return document.querySelector(selector)
}

export function queryAll(selector) {
  return [...document.querySelectorAll(selector)]
}

export function show(selector) {
  if (!selector.hasAttribute('display')) {
    // selector.setAttribute('display', 'block')
    selector.style.display = 'block'
  }
}

export function hide(selector) {
  // if (selector.hasAttribute('display')) {
    // selector.removeAttribute('display')
  selector.style.display = ''
  // }
}

