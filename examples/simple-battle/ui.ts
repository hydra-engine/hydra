import { HERO_MAX_HP } from './shared/constants'

let score = 0

function createTextElement() {
  const el = document.createElement('div')
  el.style.color = 'white'
  el.style.position = 'absolute'
  el.style.top = '10px'
  el.style.zIndex = '1'
  return el
}

const hpText = createTextElement()
const scoreText = createTextElement()

export function initUI() {
  hpText.textContent = `HP: ${HERO_MAX_HP}`
  scoreText.textContent = 'Score: 0'

  hpText.style.left = '50%'
  hpText.style.transform = 'translate(-50%, 0)'
  scoreText.style.right = '10px'

  document.body.appendChild(hpText)
  document.body.appendChild(scoreText)
}

export function changeHP(hp: number) {
  hpText.textContent = `HP: ${hp}`
}

export function addScore(s: number) {
  score += s
  scoreText.textContent = `Score: ${score}`
}
