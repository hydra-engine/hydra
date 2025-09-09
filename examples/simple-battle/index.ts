import { createObjectStateBuffer, FpsDisplay, musicPlayer, Preloader, setStyle, sfxPlayer } from '@hydraengine/main-thread-lib'
import { debugMode, enableDebug } from '@hydraengine/shared'
import { Joystick } from './joystick'
import { AssetId, assetSources } from './shared/assets'
import { changeHP, changeScore, initUI, showGameOver } from './ui'

enableDebug()

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
const offscreenCanvas = canvas.transferControlToOffscreen()

const joystick = new Joystick(document.body)

const fpsDisplayContainer = document.createElement('div')
setStyle(fpsDisplayContainer, { position: 'absolute', top: '0', left: '0', display: 'flex', flexDirection: 'column' })
document.body.appendChild(fpsDisplayContainer)

const logicWorkerFpsDisplay = debugMode ? new FpsDisplay(fpsDisplayContainer, 'Logic') : undefined
const physicsWorkerFpsDisplay = debugMode ? new FpsDisplay(fpsDisplayContainer, 'Physics') : undefined
const transformWorkerFpsDisplay = debugMode ? new FpsDisplay(fpsDisplayContainer, 'Transform') : undefined
const renderWorkerFpsDisplay = debugMode ? new FpsDisplay(fpsDisplayContainer, 'Render') : undefined

const logicWorker = new Worker('logic-worker.js')
logicWorker.onmessage = (event) => {
  const type = event.data.type

  if (logicWorkerFpsDisplay && type === 'fps') {
    logicWorkerFpsDisplay.fps = event.data.value
  }

  if (type === 'changeHp') {
    changeHP(event.data.hp)
    if (event.data.hp <= 0) {
      showGameOver()
    }
  }

  if (type === 'changeScore') {
    changeScore(event.data.score)
  }

  if (type === 'playMusic') musicPlayer.play(event.data.asset)
  if (type === 'pauseMusic') musicPlayer.pause()
  if (type === 'stopMusic') musicPlayer.stop()
  if (type === 'playSfx') sfxPlayer.play(event.data.asset)
  if (type === 'playSfxRandom') sfxPlayer.playRandom(...event.data.assets)
}

const physicsWorker = new Worker('physics-worker.js')
physicsWorker.onmessage = (event) => {
  const type = event.data.type

  if (physicsWorkerFpsDisplay && type === 'fps') {
    physicsWorkerFpsDisplay.fps = event.data.value
  }
}

const transformWorker = new Worker('transform-worker.js')
transformWorker.onmessage = (event) => {
  const type = event.data.type

  if (transformWorkerFpsDisplay && type === 'fps') {
    transformWorkerFpsDisplay.fps = event.data.value
  }
}

const renderWorker = new Worker('render-worker.js')
renderWorker.onmessage = (event) => {
  const type = event.data.type

  if (type === 'graphicAssetLoaded') {
    preloader.markLoaded(event.data.id)
  }

  if (renderWorkerFpsDisplay && type === 'fps') {
    renderWorkerFpsDisplay.fps = event.data.value
  }
}

const preloader = new Preloader(assetSources, [
  AssetId.SPRITE_HERO,
  AssetId.SPRITE_ORC,
  AssetId.SPRITE_POTION,
  AssetId.FONT_WHITE_PEABERRY,
  AssetId.BGM_BATTLE,
  AssetId.SFX_HERO_HIT_1,
  AssetId.SFX_HERO_HIT_2,
  AssetId.SFX_HERO_HIT_3,
  AssetId.SFX_HERO_MISS_1,
  AssetId.SFX_HERO_MISS_2,
  AssetId.SFX_HERO_MISS_3,
  AssetId.SFX_HERO_HEAL,
  AssetId.SFX_HERO_DIE,
  AssetId.SFX_ORC_HIT_1,
  AssetId.SFX_ORC_HIT_2,
  AssetId.SFX_ORC_HIT_3,
  AssetId.SFX_ORC_MISS_1,
  AssetId.SFX_ORC_MISS_2,
  AssetId.SFX_ORC_MISS_3,
  AssetId.SFX_ORC_DIE,
])

renderWorker.postMessage({
  type: 'loadGraphicAssets',
  assets: [
    AssetId.SPRITE_HERO,
    AssetId.SPRITE_ORC,
    AssetId.SPRITE_POTION,
    AssetId.FONT_WHITE_PEABERRY,
  ]
})

await preloader.preload()

const sab = createObjectStateBuffer()
const messageChannel = new MessageChannel()

logicWorker.postMessage({ type: 'init', sab, port: messageChannel.port1 }, [messageChannel.port1])
physicsWorker.postMessage({ type: 'init', sab })
transformWorker.postMessage({ type: 'init', sab })
renderWorker.postMessage({
  type: 'init',
  offscreenCanvas,
  devicePixelRatio: window.devicePixelRatio,
  sab,
  port: messageChannel.port2
}, [offscreenCanvas, messageChannel.port2])

function updateCanvasSize(containerWidth: number, containerHeight: number) {
  setStyle(canvas, {
    width: `${containerWidth}px`,
    height: `${containerHeight}px`,
  })
  renderWorker.postMessage({ type: 'resize', containerWidth, containerHeight })
}

updateCanvasSize(window.innerWidth, window.innerHeight)
window.addEventListener('resize', () => updateCanvasSize(window.innerWidth, window.innerHeight))

if (process.env.NODE_ENV === 'development') {
  function setFpsCap(fps: number | undefined) {
    logicWorker.postMessage({ type: 'setFpsCap', fps })
    physicsWorker.postMessage({ type: 'setFpsCap', fps })
    renderWorker.postMessage({ type: 'setFpsCap', fps })
    transformWorker.postMessage({ type: 'setFpsCap', fps })
  }

  if (!document.hasFocus()) setFpsCap(6)
  window.addEventListener('blur', () => { setFpsCap(6) })
  window.addEventListener('focus', () => { setFpsCap(undefined) })
  window.addEventListener('pageshow', (event: PageTransitionEvent) => {
    if (event.persisted) setFpsCap(undefined)
  })
}

initUI()
