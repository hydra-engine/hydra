let score = 0

function createTextElement() {
  const el = document.createElement('div')
  el.style.color = 'white'
  el.style.position = 'absolute'
  el.style.top = '10px'
  el.style.zIndex = '1'
  document.body.appendChild(el)
  return el
}

const hpText = createTextElement()
const scoreText = createTextElement()

hpText.textContent = 'HP: ...'
scoreText.textContent = 'Score: 0'

hpText.style.left = '50%'
hpText.style.transform = 'translate(-50%, 0)'
scoreText.style.right = '10px'

export function changeHp(hp: number) {
  hpText.textContent = `HP: ${hp}`
}

export function addScore(s: number) {
  score += s
  scoreText.textContent = `Score: ${score}`
}
