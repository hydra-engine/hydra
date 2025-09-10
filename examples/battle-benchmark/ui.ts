import { HERO_MAX_HP } from './shared/constants'

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

export function changeScore(score: number) {
  scoreText.textContent = `Score: ${score}`
}

export function showGameOver() {
  const gameOverText = createTextElement()
  gameOverText.textContent = 'Game Over'
  gameOverText.style.left = '50%'
  gameOverText.style.top = '50%'
  gameOverText.style.transform = 'translate(-50%, -50%)'
  document.body.append(gameOverText)
}
