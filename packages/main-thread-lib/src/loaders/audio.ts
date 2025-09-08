import { audioContext } from '../audio'
import { Loader } from './loader'

class AudioLoader extends Loader<AudioBuffer> {
  protected override async doLoad(id: number, src: string) {
    const loadingPromise = (async () => {
      const response = await fetch(src)
      if (!response.ok) {
        console.error(`Failed to load audio data: ${src}`)
        return
      }

      try {
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

        this.loadingPromises.delete(id)

        if (this.hasActiveRef(id)) {
          if (this.cachedAssets.has(id)) {
            console.error(`Audio buffer already exists: ${src}`)
          } else {
            this.cachedAssets.set(id, audioBuffer)
            return audioBuffer
          }
        }
      } catch (error) {
        console.error(`Failed to decode audio data: ${src}`, error)
        this.loadingPromises.delete(id)
      }
    })()

    this.loadingPromises.set(id, loadingPromise)
    return await loadingPromise
  }
}

export const audioLoader = new AudioLoader()
