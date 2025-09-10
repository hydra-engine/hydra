import { setStyle } from '@hydraengine/main-thread-lib'

const ARROW_CODES = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'])

function isArrow(code: string): boolean {
  return ARROW_CODES.has(code)
}

function clampVector(dx: number, dy: number, maxR: number) {
  const dist = Math.hypot(dx, dy)
  if (dist <= maxR || dist === 0) return { x: dx, y: dy, dist }
  const s = maxR / dist
  return { x: dx * s, y: dy * s, dist: maxR }
}

function setPosition(el: HTMLElement | undefined, left: number, top: number) {
  if (!el) return
  el.style.left = `${left}px`
  el.style.top = `${top}px`
}

export type JoystickOptions = {
  // 공통 필수 콜백
  onMove: (radian: number, strength: number) => void // 키보드일 때 strength=1
  onRelease: () => void

  // 선택 콜백
  onKeyDown?: (code: string) => void

  // (선택) 터치 전용 리소스/옵션
  joystickImage?: HTMLElement         // 조이스틱 배경
  knobImage?: HTMLElement             // 노브(스틱)
  maxKnobDistance?: number            // px (기본 80)
  moveThreshold?: number              // px (기본 0)
  idlePosition?: { left: number; top: number } // 이미지 기본 위치 (기본값은 숨김 위치 -999999, -999999)
}

export class Joystick {
  // 키보드 상태
  #codesPressed = new Set<string>()
  #arrowCodesPressed = new Set<string>()

  // 터치 상태
  #activeTouchId?: number
  #touchStartX = 0
  #touchStartY = 0
  #moving = false

  // DOM (터치용)
  #joystickImage?: HTMLElement
  #knobImage?: HTMLElement
  #maxKnobDistance: number
  #moveThreshold: number
  #idlePosition: { left: number; top: number }

  // 콜백
  #onMove: (radian: number, strength: number) => void
  #onRelease: () => void
  #onKeydown?: (code: string) => void

  constructor(public container: HTMLElement, options: JoystickOptions) {
    this.#onMove = options.onMove
    this.#onRelease = options.onRelease
    this.#onKeydown = options.onKeyDown
    this.#joystickImage = options.joystickImage
    this.#knobImage = options.knobImage
    this.#maxKnobDistance = options.maxKnobDistance ?? 80
    this.#moveThreshold = options.moveThreshold ?? 0
    this.#idlePosition = options.idlePosition ?? { left: -999999, top: -999999 }

    window.addEventListener('keydown', this.#onKeyDown)
    window.addEventListener('keyup', this.#onKeyUp)
    window.addEventListener('blur', this.#onBlur)

    container.addEventListener('touchstart', this.#onTouchStart, { passive: false })
    container.addEventListener('touchmove', this.#onTouchMove, { passive: false })
    container.addEventListener('touchend', this.#onTouchEnd)
    container.addEventListener('touchcancel', this.#onTouchEnd)

    if (this.#joystickImage) {
      setStyle(this.#joystickImage, {
        position: 'absolute',
        left: `${this.#idlePosition.left}px`,
        top: `${this.#idlePosition.top}px`,
        zIndex: '999998',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      })
      container.appendChild(this.#joystickImage)
    }

    if (this.#knobImage) {
      setStyle(this.#knobImage, {
        position: 'absolute',
        left: `${this.#idlePosition.left}px`,
        top: `${this.#idlePosition.top}px`,
        zIndex: '999999',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      })
      container.appendChild(this.#knobImage)
    }
  }

  #onTouchStart = (event: TouchEvent) => {
    event.preventDefault()

    if (this.#activeTouchId !== undefined) return

    const touch = event.changedTouches[0]
    this.#activeTouchId = touch.identifier
    this.#touchStartX = touch.clientX
    this.#touchStartY = touch.clientY
    this.#moving = false

    const r = this.container.getBoundingClientRect()
    const left = this.#touchStartX - r.left
    const top = this.#touchStartY - r.top

    setPosition(this.#joystickImage, left, top)
    setPosition(this.#knobImage, left, top)
  }

  #onTouchMove = (event: TouchEvent) => {
    event.preventDefault()

    if (this.#activeTouchId === undefined) return

    for (let i = 0; i < event.changedTouches.length; i++) {
      const t = event.changedTouches[i]
      if (t.identifier !== this.#activeTouchId) continue

      const dx = t.clientX - this.#touchStartX
      const dy = t.clientY - this.#touchStartY

      const { x: cx, y: cy, dist } = clampVector(dx, dy, this.#maxKnobDistance)

      const r = this.container.getBoundingClientRect()
      const left = this.#touchStartX - r.left + cx
      const top = this.#touchStartY - r.top + cy
      setPosition(this.#knobImage, left, top)

      if (this.#moving || dist >= this.#moveThreshold) {
        this.#moving = true
        if (cx !== 0 || cy !== 0) {
          const radian = Math.atan2(cy, cx)
          const normalized = this.#maxKnobDistance === 0 ? 0 : dist / this.#maxKnobDistance
          this.#onMove(radian, normalized)
        }
      }
      break
    }
  }

  #onTouchEnd = (event: TouchEvent) => {
    if (this.#activeTouchId === undefined) return

    let ended = false
    for (let i = 0; i < event.changedTouches.length; i++) {
      if (event.changedTouches[i].identifier === this.#activeTouchId) {
        ended = true
        break
      }
    }
    if (!ended) return

    this.#activeTouchId = undefined

    // 기본 위치로 복귀
    const { left, top } = this.#idlePosition
    setPosition(this.#joystickImage, left, top)
    setPosition(this.#knobImage, left, top)

    if (this.#moving) {
      this.#moving = false
      this.#onRelease()
    }
  }

  #emitFromArrowKeys() {
    let dx = 0
    let dy = 0

    if (this.#arrowCodesPressed.has('ArrowUp')) dy -= 1
    if (this.#arrowCodesPressed.has('ArrowDown')) dy += 1
    if (this.#arrowCodesPressed.has('ArrowLeft')) dx -= 1
    if (this.#arrowCodesPressed.has('ArrowRight')) dx += 1

    if (dx !== 0 || dy !== 0) {
      const radian = Math.atan2(dy, dx)
      // 키보드: strength=1 로 일관 전달
      this.#onMove(radian, 1)
    }
  }

  #onKeyDown = (event: KeyboardEvent) => {
    const code = event.code
    if (this.#codesPressed.has(code)) return

    this.#codesPressed.add(code)
    this.#onKeydown?.(code)

    if (isArrow(code)) {
      const target = event.target as HTMLElement | null
      const isEditing =
        !!target?.closest('input, textarea, [contenteditable]:not([contenteditable="false"])')
      if (!isEditing) event.preventDefault()

      this.#arrowCodesPressed.add(code)
      this.#emitFromArrowKeys()
    }
  }

  #onKeyUp = (event: KeyboardEvent) => {
    const code = event.code
    this.#codesPressed.delete(code)

    if (isArrow(code)) {
      this.#arrowCodesPressed.delete(code)

      if (this.#arrowCodesPressed.size === 0) {
        this.#onRelease()
      } else {
        this.#emitFromArrowKeys()
      }
    }
  }

  #onBlur = () => {
    // 키보드/터치 공통 릴리즈
    this.#codesPressed.clear()
    this.#arrowCodesPressed.clear()
    this.#activeTouchId = undefined
    this.#moving = false

    // 기본 위치로 복귀
    const { left, top } = this.#idlePosition
    setPosition(this.#joystickImage, left, top)
    setPosition(this.#knobImage, left, top)

    this.#onRelease()
  }

  // 조이스틱 이미지의 기본 위치(숨김 좌표) 설정
  setIdlePosition(p: { left: number; top: number }): void {
    this.#idlePosition = p

    // 드래그 중이면 즉시 반영하지 않음
    if (this.#activeTouchId !== undefined) return

    setPosition(this.#joystickImage, p.left, p.top)
    setPosition(this.#knobImage, p.left, p.top)
  }

  remove() {
    this.container.removeEventListener('touchstart', this.#onTouchStart)
    this.container.removeEventListener('touchmove', this.#onTouchMove)
    this.container.removeEventListener('touchend', this.#onTouchEnd)
    this.container.removeEventListener('touchcancel', this.#onTouchEnd)

    // 윈도우 리스너 정리
    window.removeEventListener('keydown', this.#onKeyDown)
    window.removeEventListener('keyup', this.#onKeyUp)
    window.removeEventListener('blur', this.#onBlur)

    // DOM 노드 제거
    this.#joystickImage?.remove()
    this.#knobImage?.remove()
  }
}
