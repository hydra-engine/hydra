import { NONE, ROOT } from '../constants';
export const TREE_LINK_V_COUNT = 5;
const PARENT_IDX = 0;
const FIRST_IDX = 1;
const LAST_IDX = 2;
const PREV_IDX = 3;
const NEXT_IDX = 4;
export class SabTreeLinks {
    #meta;
    constructor(sab, byteOffset, cap) {
        this.#meta = new Uint32Array(sab, byteOffset, cap * TREE_LINK_V_COUNT);
    }
    static bytesRequired(cap) { return cap * TREE_LINK_V_COUNT * Uint32Array.BYTES_PER_ELEMENT; }
    get byteLength() { return this.#meta.byteLength; }
    #o(id) { return id * TREE_LINK_V_COUNT; }
    parent(id) { return this.#meta[this.#o(id) + PARENT_IDX]; }
    #first(id) { return this.#meta[this.#o(id) + FIRST_IDX]; }
    #last(id) { return this.#meta[this.#o(id) + LAST_IDX]; }
    #next(id) { return this.#meta[this.#o(id) + NEXT_IDX]; }
    remove(id) {
        const o = this.#o(id);
        const p = this.#meta[o + PARENT_IDX];
        const l = this.#meta[o + PREV_IDX];
        const r = this.#meta[o + NEXT_IDX];
        if (p !== NONE) {
            const po = this.#o(p);
            if (this.#meta[po + FIRST_IDX] === id)
                this.#meta[po + FIRST_IDX] = r;
            if (this.#meta[po + LAST_IDX] === id)
                this.#meta[po + LAST_IDX] = l;
        }
        if (l !== NONE)
            this.#meta[this.#o(l) + NEXT_IDX] = r;
        if (r !== NONE)
            this.#meta[this.#o(r) + PREV_IDX] = l;
    }
    #linkAsOnlyChild(p, c) {
        const po = this.#o(p), co = this.#o(c);
        this.#meta[co + PARENT_IDX] = p;
        this.#meta[co + PREV_IDX] = NONE;
        this.#meta[co + NEXT_IDX] = NONE;
        this.#meta[po + FIRST_IDX] = c;
        this.#meta[po + LAST_IDX] = c;
    }
    #insertAfterSibling(p, left, c) {
        const lo = this.#o(left);
        const right = this.#meta[lo + NEXT_IDX];
        const co = this.#o(c);
        this.#meta[co + PARENT_IDX] = p;
        this.#meta[co + PREV_IDX] = left;
        this.#meta[co + NEXT_IDX] = right;
        this.#meta[lo + NEXT_IDX] = c;
        if (right !== NONE)
            this.#meta[this.#o(right) + PREV_IDX] = c;
        else
            this.#meta[this.#o(p) + LAST_IDX] = c;
    }
    #insertBeforeSibling(p, right, c) {
        const ro = this.#o(right);
        const left = this.#meta[ro + PREV_IDX];
        const co = this.#o(c);
        this.#meta[co + PARENT_IDX] = p;
        this.#meta[co + NEXT_IDX] = right;
        this.#meta[co + PREV_IDX] = left;
        this.#meta[ro + PREV_IDX] = c;
        if (left !== NONE)
            this.#meta[this.#o(left) + NEXT_IDX] = c;
        else
            this.#meta[this.#o(p) + FIRST_IDX] = c;
    }
    insert(p, c) {
        this.remove(c);
        const last = this.#last(p);
        if (last === NONE)
            this.#linkAsOnlyChild(p, c);
        else
            this.#insertAfterSibling(p, last, c);
    }
    insertAt(p, c, idx) {
        this.remove(c);
        const f = this.#first(p);
        if (f === NONE) {
            this.#linkAsOnlyChild(p, c);
            return;
        }
        if (idx <= 0) {
            this.#insertBeforeSibling(p, f, c);
            return;
        }
        let i = 0, cur = f;
        while (cur !== NONE && i < idx) {
            cur = this.#next(cur);
            i++;
        }
        if (cur === NONE)
            this.insert(p, c);
        else
            this.#insertBeforeSibling(p, cur, c);
    }
    forEach(visitor) {
        let u = ROOT;
        while (true) {
            visitor(u);
            const f = this.#first(u);
            if (f !== NONE) {
                u = f;
                continue;
            }
            while (true) {
                if (u === ROOT)
                    return;
                const n = this.#next(u);
                if (n !== NONE) {
                    u = n;
                    break;
                }
                u = this.parent(u);
            }
        }
    }
    sortChildren(p, getCompValue) {
        // 1) p의 현재 자식들을 안전하게 수집 (사이클/오염 방지)
        const ids = [];
        const seen = new Set();
        let x = this.#first(p);
        while (x !== NONE && !seen.has(x)) {
            // 다른 부모로 잘못 연결된 노드를 만나면 정지 (오염 구간을 더 확산시키지 않음)
            if (this.parent(x) !== p)
                break;
            seen.add(x);
            ids.push(x);
            const nx = this.#next(x);
            // 자기 자신을 가리키는 등 이상 링크 방지
            if (nx === x)
                break;
            x = nx;
        }
        if (ids.length <= 1)
            return;
        // 2) 값/원래 인덱스를 함께 들고 안정 정렬 (엔진 안정성에 의존하지 않도록)
        const items = ids.map((id, idx) => ({ id, k: getCompValue(id), idx }));
        items.sort((a, b) => {
            if (a.k < b.k)
                return -1;
            if (a.k > b.k)
                return 1;
            return a.idx - b.idx; // 같은 값이면 원래 순서 유지 (stable)
        });
        // 3) 링크를 깨끗하게 재구성
        const po = this.#o(p);
        const first = items[0].id;
        const last = items[items.length - 1].id;
        this.#meta[po + FIRST_IDX] = first;
        this.#meta[po + LAST_IDX] = last;
        for (let i = 0; i < items.length; i++) {
            const id = items[i].id;
            const prev = (i === 0) ? NONE : items[i - 1].id;
            const next = (i === items.length - 1) ? NONE : items[i + 1].id;
            const o = this.#o(id);
            this.#meta[o + PARENT_IDX] = p;
            this.#meta[o + PREV_IDX] = prev;
            this.#meta[o + NEXT_IDX] = next;
        }
    }
}
//# sourceMappingURL=sab-tree-links.js.map