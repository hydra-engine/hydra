export function textStroke<T extends HTMLElement>(target: T, width: number, color: string) {
  let shadow = ''
  for (let i = -width; i <= width; i++) {
    for (let j = -width; j <= width; j++) {
      if (i !== 0 || j !== 0) {
        shadow += `${i}px ${j}px 0 ${color},`
      }
    }
  }
  shadow = shadow.slice(0, -1) // Remove last comma
  target.style.textShadow = shadow
  return target
}

export function setStyle(el: HTMLElement | undefined, styles: Partial<CSSStyleDeclaration>) {
  if (!el) return
  Object.assign(el.style, styles)
  return el
}
