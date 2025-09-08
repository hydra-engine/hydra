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
                        // Parse XML using fast-xml-parser
                        const parser = new XMLParser({
                            ignoreAttributes: false,
                            attributeNamePrefix: '',
                            parseAttributeValue: true,
                            trimValues: true,
                        });
                        const xmlObj = parser.parse(text);
                        const infoEl = xmlObj?.font?.info;
                        const commonEl = xmlObj?.font?.common;
                        let charNodes = xmlObj?.font?.chars?.char ?? [];
                        if (!Array.isArray(charNodes)) {
                            charNodes = [charNodes];
                        }
                        const size = typeof infoEl?.size === 'number'
                            ? infoEl.size
                            : parseInt(infoEl?.size ?? '16', 10);
                        const lineHeight = typeof commonEl?.lineHeight === 'number'
                            ? commonEl.lineHeight
                            : parseInt(commonEl?.lineHeight ?? '32', 10);
                        const chars = {};
                        for (let i = 0; i < charNodes.length; i++) {
                            const ch = charNodes[i];
                            const charId = Number(ch.id);
                            const x = Number(ch.x);
                            const y = Number(ch.y);
                            const width = Number(ch.width);
                            const height = Number(ch.height);
                            const xoffset = Number(ch.xoffset);
                            const yoffset = Number(ch.yoffset);
                            const xadvance = Number(ch.xadvance);
                            chars[charId] = { x, y, width, height, xoffset, yoffset, xadvance };
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