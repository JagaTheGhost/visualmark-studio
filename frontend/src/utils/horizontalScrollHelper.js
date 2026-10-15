/**
 * horizontalScrollHelper.js
 * 
 * Enables smooth horizontal scrolling using a standard mouse scroll wheel (which emits vertical deltaY)
 * while preserving native trackpad gestures (which emit horizontal deltaX).
 */

/**
 * Known classes and attributes that designate dedicated horizontal scroll strips.
 */
const KNOWN_HORIZONTAL_SELECTORS = [
  '.tabs-container',
  '.toolbar-left-group',
  '.editor-sub-toolbar',
  '.templates-category-pills',
  '.doc-tabs-nav',
  '.horizontal-scroll-container',
  '[data-horizontal-scroll="true"]'
]

/**
 * Checks if an element is horizontally scrollable and currently overflowing.
 * @param {HTMLElement} el
 * @param {boolean} isShiftKey
 * @returns {boolean}
 */
export function isHorizontallyScrollable(el, isShiftKey = false) {
  if (!el || el === document.body || el === document.documentElement || !(el instanceof HTMLElement)) {
    return false
  }

  // 1. Check known explicit single-row horizontal strips
  for (const selector of KNOWN_HORIZONTAL_SELECTORS) {
    if (el.matches?.(selector)) {
      return el.scrollWidth > el.clientWidth + 1.5
    }
  }

  // 2. If Shift key is held, allow horizontal scroll on any container with overflowX
  if (isShiftKey) {
    const style = window.getComputedStyle(el)
    const overflowX = style.overflowX
    return (overflowX === 'auto' || overflowX === 'scroll') && el.scrollWidth > el.clientWidth + 1.5
  }

  return false
}

/**
 * Walks up the DOM tree from startEl to find the nearest horizontally scrollable container.
 * @param {EventTarget} startEl
 * @param {boolean} isShiftKey
 * @returns {HTMLElement|null}
 */
export function findHorizontalScrollContainer(startEl, isShiftKey = false) {
  let curr = startEl
  while (curr && curr !== document.body && curr !== document.documentElement) {
    if (curr instanceof HTMLElement && isHorizontallyScrollable(curr, isShiftKey)) {
      return curr
    }
    curr = curr.parentElement
  }
  return null
}

/**
 * Processes a wheel event and translates vertical wheel movement into horizontal scroll
 * for designated horizontal containers without swallowing vertical scrolling at boundaries.
 * @param {WheelEvent} e
 * @returns {boolean} whether the event was handled
 */
export function handleHorizontalWheelEvent(e) {
  // If trackpad 2-finger horizontal swipe is detected (deltaX is dominant),
  // let the browser handle native trackpad scrolling with momentum and bounce!
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    return false
  }

  // If no movement, ignore
  if (e.deltaY === 0 && e.deltaX === 0) {
    return false
  }

  const container = findHorizontalScrollContainer(e.target, e.shiftKey)
  if (!container) {
    return false
  }

  const maxScrollLeft = container.scrollWidth - container.clientWidth
  if (maxScrollLeft <= 1) {
    return false
  }

  // Normalize delta across platforms and devices
  let delta = e.deltaY
  if (e.deltaMode === 1) {
    // DOM_DELTA_LINE (Firefox / some mouse drivers)
    delta *= 33
  } else if (e.deltaMode === 2) {
    // DOM_DELTA_PAGE
    delta *= 100
  }

  // If Shift is held on some OSes, deltaX might carry the scroll
  if (delta === 0 && e.deltaX !== 0) {
    delta = e.deltaX
  }

  const scrollStep = delta

  const canScrollRight = scrollStep > 0 && container.scrollLeft < maxScrollLeft - 0.5
  const canScrollLeft = scrollStep < 0 && container.scrollLeft > 0.5

  if (canScrollRight || canScrollLeft) {
    container.scrollLeft += scrollStep
    e.preventDefault()
    return true
  }

  // Never call e.preventDefault() at boundary! Allow vertical scroll on parent panes to proceed naturally.
  return false
}

/**
 * Initializes the global non-passive window wheel listener.
 * Returns an unmount cleanup function.
 */
let isListenerActive = false

export function initGlobalHorizontalWheelHandler() {
  if (typeof window === 'undefined' || isListenerActive) {
    return () => {}
  }

  const onWheel = (e) => {
    handleHorizontalWheelEvent(e)
  }

  // Must be passive: false to allow e.preventDefault()
  window.addEventListener('wheel', onWheel, { passive: false })
  isListenerActive = true

  return () => {
    window.removeEventListener('wheel', onWheel, { passive: false })
    isListenerActive = false
  }
}
