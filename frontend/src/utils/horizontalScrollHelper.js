/**
 * horizontalScrollHelper.js
 * 
 * Enables smooth horizontal scrolling using a standard mouse scroll wheel (which emits vertical deltaY)
 * while preserving native trackpad gestures (which emit horizontal deltaX).
 */

/**
 * Known classes and attributes that designate horizontal scroll strips.
 */
const KNOWN_HORIZONTAL_SELECTORS = [
  '.tabs-container',
  '.toolbar-left-group',
  '.editor-sub-toolbar',
  '.templates-category-pills',
  '.badge-mode-nav',
  '.brand-plates-rack',
  '.badge-style-rack',
  '.doc-tabs-nav',
  '.horizontal-scroll-container',
  '[data-horizontal-scroll="true"]'
]

/**
 * Checks if an element is horizontally scrollable and currently overflowing.
 * @param {HTMLElement} el
 * @returns {boolean}
 */
export function isHorizontallyScrollable(el) {
  if (!el || el === document.body || el === document.documentElement || !(el instanceof HTMLElement)) {
    return false
  }

  // 1. Check known explicit classes/attributes
  for (const selector of KNOWN_HORIZONTAL_SELECTORS) {
    if (el.matches?.(selector)) {
      return el.scrollWidth > el.clientWidth + 1.5
    }
  }

  // 2. Generic dynamic style inspection
  const style = window.getComputedStyle(el)
  const overflowX = style.overflowX
  const overflowY = style.overflowY

  const canScrollX = (overflowX === 'auto' || overflowX === 'scroll') && el.scrollWidth > el.clientWidth + 1.5
  // Check if primarily vertically scrollable
  const canScrollY = (overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 1.5

  // If it can scroll horizontally and is NOT a vertical-scrolling pane
  return canScrollX && !canScrollY
}

/**
 * Walks up the DOM tree from startEl to find the nearest horizontally scrollable container.
 * @param {EventTarget} startEl
 * @returns {HTMLElement|null}
 */
export function findHorizontalScrollContainer(startEl) {
  let curr = startEl
  while (curr && curr !== document.body && curr !== document.documentElement) {
    if (curr instanceof HTMLElement && isHorizontallyScrollable(curr)) {
      return curr
    }
    curr = curr.parentElement
  }
  return null
}

/**
 * Processes a wheel event and translates vertical wheel movement into horizontal scroll
 * for horizontal containers, preventing default vertical scrolling.
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

  const container = findHorizontalScrollContainer(e.target)
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

  // Speed scaling factor: feels natural and responsive for tab bars and pill rows
  const scrollStep = delta

  const canScrollRight = scrollStep > 0 && container.scrollLeft < maxScrollLeft - 0.5
  const canScrollLeft = scrollStep < 0 && container.scrollLeft > 0.5

  if (canScrollRight || canScrollLeft) {
    container.scrollLeft += scrollStep
    e.preventDefault()
    return true
  } else {
    // At scroll boundary: prevent vertical page scroll from jumping
    e.preventDefault()
    return true
  }
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
