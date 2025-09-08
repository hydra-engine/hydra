export declare const audioContext: AudioContext;
declare class MusicPlayer {
    #private;
    constructor();
    get volume(): number;
    set volume(volume: number);
    play(assetId: number): void;
    pause(): void;
    stop(): void;
}
declare class SfxPlayer {
    #private;
    constructor();
    get volume(): number;
    set volume(volume: number);
    play(assetId: number): void;
    playRandom(...assetIds: number[]): void;
}
export declare const musicPlayer: MusicPlayer;
export declare const sfxPlayer: SfxPlayer;
export {};
//# sourceMappingURL=audio.d.ts.map