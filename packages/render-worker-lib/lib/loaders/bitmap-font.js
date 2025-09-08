import { XMLParser } from 'fast-xml-parser';
import { Loader } from './loader';
import { textureLoader } from './texture';
class BitmapFontLoader extends Loader {
    async doLoad(id, fnt, src) {
        const loadingPromise = (async () => {
            const texture = await textureLoader.load(id, src);
            if (!texture) {
                console.error(`Failed to load texture: ${src}`);
                return;
            }
            const response = await fetch(fnt);
            if (!response.ok) {
                console.error(`Failed to load font xml: ${fnt}`);
                return;
            }
            try {
                const text = await response.text();
                this.loadingPromises.delete(id);
                if (this.hasActiveRef(id)) {
                    if (this.cachedAssets.has(id)) {
                        textureLoader.release(id);
                        console.error(`Bitmap font already exists: ${fnt}`);
                    }
                    else {
                        const parser = new XMLParser({
                            ignoreAttributes: false,
                            attributeNamePrefix: '',
                        });
                        const xml = parser.parse(text);
                        const info = xml.font?.info;
                        const common = xml.font?.common;
                        const charArr = xml.font?.chars?.char ?? [];
                        const size = parseInt(info?.size ?? '16', 10);
                        const lineHeight = parseInt(common?.lineHeight ?? '32', 10);
                        const chars = {};
                        for (const c of charArr) {
                            const idNum = parseInt(c.id, 10);
                            chars[idNum] = {
                                x: parseInt(c.x, 10),
                                y: parseInt(c.y, 10),
                                width: parseInt(c.width, 10),
                                height: parseInt(c.height, 10),
                                xoffset: parseInt(c.xoffset, 10),
                                yoffset: parseInt(c.yoffset, 10),
                                xadvance: parseInt(c.xadvance, 10),
                            };
                        }
                        const bitmapFont = { src, chars, texture, size, lineHeight };
                        this.cachedAssets.set(id, bitmapFont);
                        return bitmapFont;
                    }
                }
                else {
                    textureLoader.release(id);
                }
            }
            catch (error) {
                console.error(`Failed to decode font xml: ${fnt}`, error);
                this.loadingPromises.delete(id);
            }
        })();
        this.loadingPromises.set(id, loadingPromise);
        return await loadingPromise;
    }
    cleanup(id) {
        textureLoader.release(id);
    }
}
export const bitmapFontLoader = new BitmapFontLoader();
//# sourceMappingURL=bitmap-font.js.map