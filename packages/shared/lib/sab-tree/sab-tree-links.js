export const ROOT_ID = 0;
export const NONE = 0xFFFFFFFF;
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
        let u = ROOT_ID;
        while (true) {
            visitor(u);
            const f = this.#first(u);
            if (f !== NONE) {
                u = f;
                continue;
            }
            while (true) {
                if (u === ROOT_ID)
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
        let n = 0;
        let head = this.#first(p);
        while (head !== NONE) {
            n++;
            head = this.#next(head);
        }
        if (n <= 1)
            return;
        let runSize = 1;
        while (runSize < n) {
            let mergedHead = NONE;
            let mergedTail = NONE;
            let cur = this.#first(p);
            while (cur !== NONE) {
                let left = cur;
                let i = 1;
                while (i < runSize && this.#next(cur) !== NONE) {
                    cur = this.#next(cur);
                    i++;
                }
                let right = this.#next(cur);
                const afterRightStart = right;
                this.#meta[this.#o(cur) + NEXT_IDX] = NONE;
                if (right !== NONE)
                    this.#meta[this.#o(right) + PREV_IDX] = NONE;
                let nextStart = afterRightStart;
                i = 0;
                while (i < runSize && nextStart !== NONE) {
                    nextStart = this.#next(nextStart);
                    i++;
                }
                if (nextStart !== NONE) {
                    const prev = this.#meta[this.#o(nextStart) + PREV_IDX];
                    if (prev !== NONE)
                        this.#meta[this.#o(prev) + NEXT_IDX] = NONE;
                    this.#meta[this.#o(nextStart) + PREV_IDX] = NONE;
                }
                cur = nextStart;
                let merged = NONE;
                let mergedT = NONE;
                let a = left;
                let b = right;
                while (a !== NONE || b !== NONE) {
                    let takeFromA = false;
                    if (b === NONE)
                        takeFromA = true;
                    else if (a === NONE)
                        takeFromA = false;
                    else {
                        const ka = getCompValue(a);
                        const kb = getCompValue(b);
                        takeFromA = (ka <= kb);
                    }
                    const id = takeFromA ? a : b;
                    if (takeFromA)
                        a = this.#next(a);
                    else
                        b = this.#next(b);
                    const no = this.#o(id);
                    this.#meta[no + PREV_IDX] = mergedT;
                    this.#meta[no + NEXT_IDX] = NONE;
                    this.#meta[no + PARENT_IDX] = p;
                    if (merged === NONE)
                        merged = id;
                    else
                        this.#meta[this.#o(mergedT) + NEXT_IDX] = id;
                    mergedT = id;
                }
                if (mergedHead === NONE)
                    mergedHead = merged;
                else {
                    this.#meta[this.#o(mergedTail) + NEXT_IDX] = merged;
                    this.#meta[this.#o(merged) + PREV_IDX] = mergedTail;
                }
                mergedTail = mergedT;
            }
            const po = this.#o(p);
            this.#meta[po + FIRST_IDX] = mergedHead;
            this.#meta[po + LAST_IDX] = mergedTail;
            runSize <<= 1;
        }
    }
}
//# sourceMappingURL=sab-tree-links.js.map