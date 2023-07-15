import { easeInOutQuad, hide, isTouchDevice, query, show } from './utils.js';
import { keyframes } from './constants.js';

export class Parallax {
  constructor() {
    this.scrollTop = 0
    this.windowHeight = 0
    this.windowWidth = 0

    this.bodyHeight = 0

    this.wrappers = []

    this.currentWrapper = null
    this.prevKeyframesDurations = 0
    this.relativeScrollTop = 0
    this.currentKeyframe = 0

    this.init()
  }

  init() {
    let scrollIntervalID = setInterval(() => this.updatePage(), 10)
    this.setupValues()
    window.addEventListener('resize', this.throwError)
    if (isTouchDevice()) {
      window.addEventListener('resize', this.throwError)
    }
  }

  setupValues() {
    this.scrollTop = window.scrollY
    this.windowHeight = window.innerHeight
    this.windowWidth = window.innerWidth
    this.convertAllPropsToPx()
    this.buildPage()
  }

  convertAllPropsToPx() {
    for (let i = 0; i < keyframes.length; i++) {
      keyframes[i].duration = this.convertPercentToPx(keyframes[i].duration, 'y')
      for (let j = 0; j < keyframes[i].animations.length; j++) {
        Object.keys(keyframes[i].animations[j]).forEach((key) => {
          let value = keyframes[i].animations[j][key]
          if (key !== 'selector') {
            if (value instanceof Array) {
              for (let k = 0; k < value.length; k++) {
                if (typeof value[k] === 'string') {
                  if (key === 'translateY') {
                    value[k] = this.convertPercentToPx(value[k], 'y')
                  } else {
                    value[k] = this.convertPercentToPx(value[k], 'x')
                  }
                }
              }
            } else {
              if (typeof value === 'string') {
                if (key === 'translateY') {
                  value = this.convertPercentToPx(value, 'y')
                } else {
                  value = this.convertPercentToPx(value, 'x')
                }
              }
            }
            keyframes[i].animations[j][key] = value
          }
        })
      }
      
    }
  }

  buildPage() {
    for (let i = 0; i < keyframes.length; i++) {
      this.bodyHeight += keyframes[i].duration
      if (!this.wrappers.includes(keyframes[i].wrapper)) {
        this.wrappers.push(keyframes[i].wrapper)
      }

      for (let j = 0; j < keyframes[i].animations.length; j++) {
        Object.keys(keyframes[i].animations[j]).forEach(key => {
          let value = keyframes[i].animations[j][key]
          if (key !== 'selector' && value instanceof Array) {
            let valueSet = []
            valueSet.push(this.getDefaultPropertyValue(key))
            value = valueSet
          }
          keyframes[i].animations[j][key] = value
        })
      }
    }

    // 
    query('body').style.height = this.bodyHeight + 'px'
    window.scrollTo({ left: 0, top: 0 })
    this.currentWrapper = this.wrappers[0]
    show(query(this.currentWrapper))
  }

  updatePage() {
    const that = this
    window.requestAnimationFrame(function() {
      that.setScrollTops()
      if (that.scrollTop > 0 && that.scrollTop <= (that.bodyHeight - that.windowHeight)) {
        that.animateElements()
      }
    })
  }

  getDefaultPropertyValue(property) {
    switch (property) {
      case 'translateX':
        return 0
      case 'translateY':
        return 0
      case 'scale':
        return 1
      case 'rotate':
        return 0
      case 'opacity':
        return 1
      default:
        return null
    }
  }

  setScrollTops() {
    this.scrollTop = window.scrollY
    this.relativeScrollTop = this.scrollTop - this.prevKeyframesDurations
  }

  animateElements() {
    let animation, translateX, translateY, scale, rotate, opacity
    for (let i = 0; i < keyframes[this.currentKeyframe].animations.length; i++) {
      animation = keyframes[this.currentKeyframe].animations[i]
      translateX = this.calcPropValue(animation, 'translateX')
      translateY = this.calcPropValue(animation, 'translateY')
      scale = this.calcPropValue(animation, 'scale')
      rotate = this.calcPropValue(animation, 'rotate')
      opacity = this.calcPropValue(animation, 'opacity')
      
      const selector = query(animation.selector)
      console.log(selector, '-- animateElements');
      selector.style.transform = `translate3d(${translateX}px, ${translateY}px, 0}) scale(${scale}) rotate(${rotate}deg)`
      selector.style.opacity = opacity
    }
  }

  setKeyframe() {
    const { scrollTop, currentKeyframe, prevKeyframesDurations } = this
    if (scrollTop > (keyframes[currentKeyframe].duration + prevKeyframesDurations)) {
      this.prevKeyframesDurations += keyframes[currentKeyframe].duration
      this.currentKeyframe++
      this.showCurrentWrappers()
    } else if (scrollTop < prevKeyframesDurations) {
      this.currentKeyframe--
      this.prevKeyframesDurations -= keyframes[currentKeyframe].duration
      this.showCurrentWrappers()
    }
  }

  showCurrentWrappers() {
    const { currentKeyframe, currentWrapper } = this
    if (keyframes[currentKeyframe].wrapper !== currentWrapper) {
      hide(currentWrapper)
      show(query(keyframes[currentKeyframe].wrapper))
      this.currentWrapper = keyframes[currentKeyframe].wrapper
    }
  }

  calcPropValue(animation, property) {
    let value = animation[property]
    if (value) {
      value = easeInOutQuad(this.relativeScrollTop, value[0], (value[1] - value[0]), keyframes[this.currentKeyframe].duration)
    } else {
      value = this.getDefaultPropertyValue(property)
    }

    return value
  }

  throwError() {
    const body = query('body')
    if (!body.className.includes('page-error')) {
      body.className += ' page-error'
    }
  }

  /**
   * @private
   */
  convertPercentToPx(value, axis) {
    if (typeof value === 'string' && value.match(/%/g)) {
      if (axis === 'y') value = (parseFloat(value) / 100) * this.windowHeight
      if (axis === 'x') value = (parseFloat(value) / 100) * this.windowWidth
    }
  
    return value
  }
}

// export function parallax() {
//   document.addEventListener('load', function() {
//     var parallax = new Parallax()
//   })
// }

(function() {
  console.log(1);
  var parallax = new Parallax()
  console.log(parallax, 'parallax');
})()
