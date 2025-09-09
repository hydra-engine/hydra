class MusicPlayer {
    play(asset) { postMessage({ type: 'playMusic', asset }); }
    pause() { postMessage({ type: 'pauseMusic' }); }
    stop() { postMessage({ type: 'stopMusic' }); }
}
class SfxPlayer {
    play(asset) { postMessage({ type: 'playSfx', asset }); }
    playRandom(...assets) { this.play(assets[Math.floor(Math.random() * assets.length)]); }
}
export const musicPlayer = new MusicPlayer();
export const sfxPlayer = new SfxPlayer();
//# sourceMappingURL=audio.js.map