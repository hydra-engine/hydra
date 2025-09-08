import { Loader } from './loader';
declare class AudioLoader extends Loader<AudioBuffer> {
    protected doLoad(id: number, src: string): Promise<AudioBuffer | undefined>;
}
export declare const audioLoader: AudioLoader;
export {};
//# sourceMappingURL=audio.d.ts.map