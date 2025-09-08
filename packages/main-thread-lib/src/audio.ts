import { audioLoader } from './loaders/audio'
import { isMobile } from './utils/device'

export const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
window.addEventListener('mousedown', () => audioContext.resume())
window.addEventListener('touchend', () => audioContext.resume())

async function getAvailableContext(): Promise<AudioContext> {
  if (audioContext.state === 'suspended') await audioContext.resume()
  return audioContext
}

let isPageVisible = !document.hidden
window.addEventListener('visibilitychange', () => isPageVisible = !document.hidden)

type BasicStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

type SafeStorage = BasicStorage & {
  persistent: boolean
}

function createSafeStorage(): SafeStorage {
  const memory = (() => {
    const m = new Map<string, string>()
    const api: SafeStorage = {
      persistent: false,
      getItem: (k) => (m.has(k) ? m.get(k)! : null),
      setItem: (k, v) => { m.set(k, String(v)) },
      removeItem: (k) => { m.delete(k) },
    }
    return api
  })()

  if (typeof window === 'undefined') return memory

  try {
    const ls = window.localStorage
    const probeKey = '__safe_ls_probe__' + Math.random().toString(36).slice(2)
    ls.setItem(probeKey, '1')
    ls.removeItem(probeKey)

    const safe: SafeStorage = {
      persistent: true,
      getItem: (k) => ls.getItem(k),
      setItem: (k, v) => ls.setItem(k, v),
      removeItem: (k) => ls.removeItem(k),
    }
    return safe
  } catch {
    return memory
  }
}

const safeStorage = createSafeStorage()

class Audio {
  assetId: number

  #volume: number
  #loop: boolean

  #audioBuffer?: AudioBuffer
  #audioContext?: AudioContext
  #gainNode?: GainNode
  #source?: AudioBufferSourceNode

  #isPlaying = false
  #isPaused = false
  #startTime = 0
  #pauseTime = 0
  #offset = 0

  constructor(assetId: number, volume: number, loop: boolean) {
    this.assetId = assetId
    this.#volume = volume
    this.#loop = loop
    this.play()
  }

  get volume() { return this.#volume }
  set volume(volume: number) {
    this.#volume = volume
    if (this.#gainNode) this.#gainNode.gain.value = Math.max(0, Math.min(1, volume))
  }

  async play() {
    if (isMobile && !isPageVisible) return

    if (!this.#audioBuffer) {
      if (audioLoader.checkCached(this.assetId)) {
        this.#audioBuffer = audioLoader.getCached(this.assetId)
      } else {
        console.info(`Audio not preloaded. Loading now: ${this.assetId}`)
        this.#audioBuffer = await audioLoader.load(this.assetId)
      }
    }
    if (!this.#audioBuffer) return

    if (this.#isPlaying) this.stop()
    if (!this.#isPaused) this.#offset = 0
    this.#isPlaying = true
    this.#isPaused = false
    if (!this.#audioContext) this.#audioContext = await getAvailableContext()
    if (!this.#isPlaying) return

    if (!this.#gainNode) {
      this.#gainNode = this.#audioContext.createGain()
      this.#gainNode.gain.value = this.#volume
      this.#gainNode.connect(this.#audioContext.destination)
    }

    this.#source = this.#audioContext.createBufferSource()
    this.#source.buffer = this.#audioBuffer
    this.#source.loop = this.#loop
    this.#source.connect(this.#gainNode)
    this.#source.start(0, this.#offset)
    this.#startTime = this.#audioContext.currentTime
    this.#source.onended = () => { if (!this.#isPaused && !this.#loop) this.stop() }
  }

  #clear(): void {
    if (this.#source) {
      this.#source.stop()
      this.#source.disconnect()
      this.#source = undefined
    }
  }

  pause() {
    if (this.#isPlaying && !this.#isPaused) {
      if (this.#audioContext) {
        this.#pauseTime = this.#audioContext.currentTime
        this.#offset += this.#pauseTime - this.#startTime
      }
      this.#isPaused = true
      this.#isPlaying = false
      this.#clear()
    }
  }

  stop() {
    this.#isPlaying = false
    this.#isPaused = false
    this.#offset = 0
    this.#clear()
  }
}

class MusicPlayer {
  #volume = 0.7
  #currentAudio?: Audio

  constructor() {
    const stored = parseFloat(safeStorage.getItem('musicVolume') || '')
    this.#volume = Number.isNaN(stored) ? this.#volume : stored

    if (isMobile) {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) this.pause()
        else {
          isPageVisible = true
          this.#currentAudio?.play()
        }
      })
    }
  }

  get volume() {
    return this.#volume
  }

  set volume(volume: number) {
    this.#volume = volume
    safeStorage.setItem('musicVolume', volume.toString())
    if (this.#currentAudio) this.#currentAudio.volume = volume
  }

  play(assetId: number) {
    if (this.#currentAudio?.assetId === assetId) return
    this.#currentAudio?.stop()
    this.#currentAudio = new Audio(assetId, this.#volume, true)
  }

  pause() {
    this.#currentAudio?.pause()
  }

  stop() {
    this.#currentAudio?.stop()
    this.#currentAudio = undefined
  }
}

class SfxPlayer {
  #volume = 1

  constructor() {
    const stored = parseFloat(safeStorage.getItem('sfxVolume') || '')
    this.#volume = Number.isNaN(stored) ? this.#volume : stored
  }

  get volume() {
    return this.#volume
  }

  set volume(volume: number) {
    this.#volume = volume
    safeStorage.setItem('sfxVolume', volume.toString())
  }

  play(assetId: number) {
    new Audio(assetId, this.#volume, false)
  }

  playRandom(...assetIds: number[]) {
    this.play(assetIds[Math.floor(Math.random() * assetIds.length)])
  }
}

export const musicPlayer = new MusicPlayer()
export const sfxPlayer = new SfxPlayer()
