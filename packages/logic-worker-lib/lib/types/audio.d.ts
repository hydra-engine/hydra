declare class MusicPlayer {
    play(asset: number): void;
    pause(): void;
    stop(): void;
}
declare class SfxPlayer {
    play(asset: number): void;
    playRandom(...assets: number[]): void;
}
export declare const musicPlayer: MusicPlayer;
export declare const sfxPlayer: SfxPlayer;
export {};
//# sourceMappingURL=audio.d.ts.map