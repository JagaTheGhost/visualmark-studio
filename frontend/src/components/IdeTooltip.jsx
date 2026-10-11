import React, { useState, useEffect, useRef } from 'react'

export default function IdeTooltip() {
  const [tooltipState, setTooltipState] = useState({
    visible: false,
    text: '',
    x: 0,
    y: 0,
    arrowOffset: '50%',
    position: 'top' // 'top' | 'bottom' | 'right'
  })

  const timerRef = useRef(null)
  const lastActiveTimeRef = useRef(0)
  const currentTargetRef = useRef(null)

  useEffect(() => {
    function findTooltipTarget(target) {
      if (!target || !(target instanceof Element)) return null
      return target.closest('[data-tooltip], [title]')
    }

    function handleMouseOver(e) {
      const target = findTooltipTarget(e.target)
      if (!target) {
        handleMouseOut()
        return
      }

      // If element has a title, convert to data-tooltip to suppress native OS tooltip
      if (target.hasAttribute('title') && target.getAttribute('title')) {
        const titleText = target.getAttribute('title')
        target.setAttribute('data-tooltip', titleText)
        target.removeAttribute('title')
      }

      const text = target.getAttribute('data-tooltip')
      if (!text || !text.trim()) {
        handleMouseOut()
        return
      }

      if (currentTargetRef.current === target && tooltipState.visible) {
        return
      }
      currentTargetRef.current = target

      clearTimeout(timerRef.current)

      const now = Date.now()
      // If user recently hovered another tooltip (< 400ms ago), show quickly (30ms), else wait 150ms
      const delay = (now - lastActiveTimeRef.current < 400) ? 30 : 150

      timerRef.current = setTimeout(() => {
        if (!currentTargetRef.current) return
        calculatePosition(currentTargetRef.current, text)
        lastActiveTimeRef.current = Date.now()
      }, delay)
    }

    function calculatePosition(target, text) {
      const rect = target.getBoundingClientRect()
      const explicitPos = target.getAttribute('data-tooltip-pos')

      let pos = explicitPos || 'top'
      if (!explicitPos) {
        if (rect.left < 55 && rect.top > 30 && rect.bottom < window.innerHeight - 30) {
          pos = 'right'
        } else if (rect.top < 45) {
          pos = 'bottom'
        } else {
          pos = 'top'
        }
      }

      // Measure tooltip dimensions
      const measurer = document.createElement('div')
      measurer.className = 'ide-tooltip-measure'
      measurer.textContent = text
      document.body.appendChild(measurer)
      const measuredRect = measurer.getBoundingClientRect()
      const measuredWidth = Math.max(20, Math.ceil(measuredRect.width || 100))
      const measuredHeight = Math.max(16, Math.ceil(measuredRect.height || 22))
      document.body.removeChild(measurer)

      if (pos === 'top' && rect.top - measuredHeight - 6 < 4) {
        pos = 'bottom'
      } else if (pos === 'bottom' && rect.bottom + measuredHeight + 6 > window.innerHeight - 4) {
        pos = 'top'
      }

      let x = 0
      let y = 0
      let arrowOffset = '50%'

      if (pos === 'top') {
        // Tooltip placed above target
        y = Math.round(rect.top - measuredHeight - 6)
        const idealX = Math.round(rect.left + rect.width / 2 - measuredWidth / 2)
        const minX = 8
        const maxX = window.innerWidth - measuredWidth - 8
        x = Math.max(minX, Math.min(idealX, maxX))

        // Position arrow pointing to center of target
        const targetCenterX = rect.left + rect.width / 2
        const relativeArrowX = targetCenterX - x
        arrowOffset = `${Math.round(Math.max(10, Math.min(relativeArrowX, measuredWidth - 10)))}px`
      } else if (pos === 'bottom') {
        // Tooltip placed below target
        y = Math.round(rect.bottom + 6)
        const idealX = Math.round(rect.left + rect.width / 2 - measuredWidth / 2)
        const minX = 8
        const maxX = window.innerWidth - measuredWidth - 8
        x = Math.max(minX, Math.min(idealX, maxX))

        const targetCenterX = rect.left + rect.width / 2
        const relativeArrowX = targetCenterX - x
        arrowOffset = `${Math.round(Math.max(10, Math.min(relativeArrowX, measuredWidth - 10)))}px`
      } else if (pos === 'right') {
        // Tooltip placed right of target
        x = Math.round(rect.right + 6)
        const idealY = Math.round(rect.top + rect.height / 2 - measuredHeight / 2)
        const minY = 8
        const maxY = window.innerHeight - measuredHeight - 8
        y = Math.max(minY, Math.min(idealY, maxY))

        const targetCenterY = rect.top + rect.height / 2
        const relativeArrowY = targetCenterY - y
        arrowOffset = `${Math.round(Math.max(8, Math.min(relativeArrowY, measuredHeight - 8)))}px`
      }

      setTooltipState({
        visible: true,
        text,
        x,
        y,
        arrowOffset,
        position: pos
      })
    }

    function handleMouseOut(e) {
      if (e && e.relatedTarget && findTooltipTarget(e.relatedTarget)) {
        return
      }
      clearTimeout(timerRef.current)
      currentTargetRef.current = null
      setTooltipState((prev) => (prev.visible ? { ...prev, visible: false } : prev))
      lastActiveTimeRef.current = Date.now()
    }

    function handleAction() {
      clearTimeout(timerRef.current)
      currentTargetRef.current = null
      setTooltipState((prev) => (prev.visible ? { ...prev, visible: false } : prev))
    }

    document.addEventListener('mouseover', handleMouseOver, true)
    document.addEventListener('mouseout', handleMouseOut, true)
    document.addEventListener('mousedown', handleAction, true)
    document.addEventListener('keydown', handleAction, true)
    window.addEventListener('scroll', handleAction, true)
    window.addEventListener('resize', handleAction, true)

    return () => {
      document.removeEventListener('mouseover', handleMouseOver, true)
      document.removeEventListener('mouseout', handleMouseOut, true)
      document.removeEventListener('mousedown', handleAction, true)
      document.removeEventListener('keydown', handleAction, true)
      window.removeEventListener('scroll', handleAction, true)
      window.removeEventListener('resize', handleAction, true)
      clearTimeout(timerRef.current)
    }
  }, [tooltipState.visible])

  if (!tooltipState.visible && !tooltipState.text) return null

  return (
    <div
      className={`ide-tooltip pos-${tooltipState.position} ${tooltipState.visible ? 'visible' : ''}`}
      style={{
        left: `${tooltipState.x}px`,
        top: `${tooltipState.y}px`,
        '--arrow-offset': tooltipState.arrowOffset
      }}
      aria-hidden="true"
    >
      {tooltipState.text}
    </div>
  )
}
