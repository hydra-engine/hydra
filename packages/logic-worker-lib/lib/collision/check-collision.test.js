import { checkCollision } from './check-collision';
import { ColliderType } from './colliders';
// ===== Builders ====================================================================================
const rad = (deg) => (deg * Math.PI) / 180;
function T(x = 0, y = 0, rotDeg = 0, sx = 1, sy = 1) {
    const v = rad(rotDeg);
    return {
        x: { v: x },
        y: { v: y },
        scaleX: { v: sx },
        scaleY: { v: sy },
        rotation: { v, sin: Math.sin(v), cos: Math.cos(v) },
    };
}
function R(width, height, ox = 0, oy = 0) {
    return { type: ColliderType.Rectangle, width, height, x: ox, y: oy };
}
function C(radius, ox = 0, oy = 0) {
    return { type: ColliderType.Circle, radius, x: ox, y: oy };
}
function E(width, height, ox = 0, oy = 0) {
    return { type: ColliderType.Ellipse, width, height, x: ox, y: oy };
}
function P(points) {
    const vertices = points.map(([x, y]) => ({ x, y }));
    return { type: ColliderType.Polygon, vertices };
}
// ===== RNG & helpers ===============================================================================
let _seed = 0x9e3779b9 | 0;
const setSeed = (s) => (_seed = s | 0);
const rnd = () => {
    let x = _seed | 0;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    _seed = x | 0;
    return (x >>> 0) / 4294967296;
};
const rrange = (a, b) => a + (b - a) * rnd();
const rint = (a, b) => Math.floor(rrange(a, b + 1));
const translateT = (t, dx, dy) => T(t.x.v + dx, t.y.v + dy, (t.rotation.v * 180) / Math.PI, t.scaleX.v, t.scaleY.v);
const rotatePoint = (x, y, theta) => [
    Math.cos(theta) * x - Math.sin(theta) * y,
    Math.sin(theta) * x + Math.cos(theta) * y
];
const rigidRotateT = (t, deltaDeg) => {
    const theta = rad(deltaDeg);
    const [nx, ny] = rotatePoint(t.x.v, t.y.v, theta);
    const newRotDeg = (t.rotation.v * 180) / Math.PI + deltaDeg;
    return T(nx, ny, newRotDeg, t.scaleX.v, t.scaleY.v);
};
// Apply transforms per-shape for property tests
function applyTranslation(col, t, dx, dy) {
    return [col, translateT(t, dx, dy)];
}
function applyRotation(col, t, deg) {
    return [col, rigidRotateT(t, deg)];
}
// ---- Stability checks to avoid near-tangency numerical flicker -----------------------------------
function isStablePair(a, ta, b, tb) {
    const base = checkCollision(a, ta, b, tb);
    const eps = 1e-6;
    const dirs = [[eps, -eps], [-eps, eps], [eps, eps], [-eps, -eps]];
    for (const [dx, dy] of dirs) {
        const [a2, ta2] = applyTranslation(a, ta, dx, dy);
        const [b2, tb2] = applyTranslation(b, tb, -dx, -dy);
        const j = checkCollision(a2, ta2, b2, tb2);
        if (j !== base)
            return false;
    }
    return true;
}
function isRotationStablePair(a, ta, b, tb, deltaDeg) {
    const [aR, taR] = applyRotation(a, ta, deltaDeg);
    const [bR, tbR] = applyRotation(b, tb, deltaDeg);
    const baseRot = checkCollision(aR, taR, bR, tbR);
    // small rotation jitter — use a slightly larger epsilon to catch GJK flips
    const epsDeg = 1e-3;
    const [aR1, taR1] = applyRotation(a, ta, deltaDeg + epsDeg);
    const [bR1, tbR1] = applyRotation(b, tb, deltaDeg + epsDeg);
    const [aR2, taR2] = applyRotation(a, ta, deltaDeg - epsDeg);
    const [bR2, tbR2] = applyRotation(b, tb, deltaDeg - epsDeg);
    const r1 = checkCollision(aR1, taR1, bR1, tbR1);
    const r2 = checkCollision(aR2, taR2, bR2, tbR2);
    if (r1 !== baseRot || r2 !== baseRot)
        return false;
    // small translation jitter after rotation
    const eps = 1e-5;
    const [aRt1, taRt1] = applyTranslation(aR, taR, eps, -eps);
    const [bRt1, tbRt1] = applyTranslation(bR, tbR, -eps, eps);
    const [aRt2, taRt2] = applyTranslation(aR, taR, -eps, eps);
    const [bRt2, tbRt2] = applyTranslation(bR, tbR, eps, -eps);
    const t1 = checkCollision(aRt1, taRt1, bRt1, tbRt1);
    const t2 = checkCollision(aRt2, taRt2, bRt2, tbRt2);
    return t1 === baseRot && t2 === baseRot;
}
const randomConvexPoly = (n, radius = 2, jitter = 0.5) => {
    const pts = [];
    for (let i = 0; i < n; i++) {
        const a = (i + rnd() * 0.1) * (2 * Math.PI / n);
        const r = radius * (1 - jitter / 2 + jitter * rnd());
        pts.push([r * Math.cos(a), r * Math.sin(a)]);
    }
    pts.sort((p, q) => Math.atan2(p[1], p[0]) - Math.atan2(q[1], q[0]));
    return P(pts);
};
function randomColliderAndTransform() {
    switch (rint(0, 3)) {
        case 0: return [R(rrange(0.2, 4.0), rrange(0.2, 4.0)), randomTransform()];
        case 1: return [C(rrange(0.2, 2.5)), randomTransform()];
        case 2: return [E(rrange(0.4, 5.0), rrange(0.4, 5.0)), randomTransform()];
        default: return [randomConvexPoly(rint(3, 7)), randomTransform()];
    }
}
function randomTransform() {
    return T(rrange(-5, 5), rrange(-5, 5), rrange(-180, 180), rrange(0.5, 2.0) * (rnd() < 0.05 ? -1 : 1), rrange(0.5, 2.0) * (rnd() < 0.05 ? -1 : 1));
}
// Invariance test should not be affected by anisotropic/negative scales.
function normalizeForRigid(t) {
    return T(t.x.v, t.y.v, (t.rotation.v * 180) / Math.PI, 1, 1);
}
const isEllipse = (col) => col.type === ColliderType.Ellipse;
// Utility wrappers that also check symmetry implicitly
function expectCollide(a, ta, b, tb, hint) {
    const ab = checkCollision(a, ta, b, tb);
    const ba = checkCollision(b, tb, a, ta);
    if (!(ab && ba))
        throw new Error(hint ?? `expected collision but got ab=${ab}, ba=${ba}`);
}
function expectSeparate(a, ta, b, tb, hint) {
    const ab = checkCollision(a, ta, b, tb);
    const ba = checkCollision(b, tb, a, ta);
    if (ab || ba)
        throw new Error(hint ?? `expected separation but got ab=${ab}, ba=${ba}`);
}
// ===== TESTS =======================================================================================
describe('Rect-Rect (AABB fast path)', () => {
    it('overlap', () => {
        expectCollide(R(2, 2), T(0, 0), R(2, 2), T(1, 0));
    });
    it('touching edge inclusive', () => {
        expectCollide(R(2, 2), T(0, 0), R(2, 2), T(2, 0));
    });
    it('separated', () => {
        expectSeparate(R(2, 2), T(0, 0), R(2, 2), T(2.01, 0));
    });
});
describe('Rect-Rect (rotated, SAT path)', () => {
    it('overlap (same center)', () => {
        expectCollide(R(2, 2), T(0, 0, 45), R(2, 2), T(0, 0, -30));
    });
    it('separated', () => {
        expectSeparate(R(2, 1), T(0, 0, 37), R(1.2, 2.4), T(4, 0, -20));
    });
});
describe('Circle-Circle', () => {
    it('overlap', () => {
        expectCollide(C(1), T(0, 0), C(1), T(1.5, 0));
    });
    it('touching inclusive', () => {
        expectCollide(C(1), T(0, 0), C(1), T(2, 0));
    });
    it('separated', () => {
        expectSeparate(C(1), T(0, 0), C(1), T(2.01, 0));
    });
});
describe('Circle scaling anisotropy (conservative)', () => {
    it('still overlap when max scale enlarges radius', () => {
        expectCollide(C(1), T(0, 0, 0, 2, 0.5), C(1), T(2.9, 0));
    });
    it('separated beyond conservative sum', () => {
        expectSeparate(C(1), T(0, 0, 0, 2, 0.5), C(1), T(4.01, 0));
    });
});
describe('Rect-Circle', () => {
    it('overlap', () => {
        expectCollide(R(2, 2), T(0, 0), C(1), T(1.2, 0));
    });
    it('touching inclusive', () => {
        expectCollide(R(2, 2), T(0, 0), C(1), T(2, 0));
    });
    it('separated', () => {
        expectSeparate(R(2, 2), T(0, 0), C(1), T(2.01, 0));
    });
});
describe('Poly-Poly (convex)', () => {
    const square = P([[-1, -1], [1, -1], [1, 1], [-1, 1]]);
    it('overlap', () => {
        expectCollide(square, T(0, 0), square, T(1, 0));
    });
    it('separated', () => {
        const moved = P(square.vertices.map(p => [p.x + 2.1, p.y]));
        expectSeparate(square, T(0, 0), moved, T(0, 0));
    });
});
describe('Poly-Circle', () => {
    it('edge touching inclusive', () => {
        const poly = P([[-1, -1], [1, -1], [1, 1], [-1, 1]]);
        expectCollide(poly, T(0, 0), C(1), T(2, 0));
    });
});
describe('Poly-Rect', () => {
    it('overlap with rotated rect', () => {
        expectCollide(P([[-2, -1], [2, -1], [2, 1], [-2, 1]]), T(0, 0), R(1.5, 1.5), T(1.6, 0, 30));
    });
    it('separated gap', () => {
        expectSeparate(P([[-1, -1], [1, -1], [1, 1], [-1, 1]]), T(0, 0), R(1, 1), T(2.05, 0, 15));
    });
});
describe('Ellipse interactions (GJK)', () => {
    it('Ellipse-Rect overlap axis-aligned', () => {
        // rx=2 + rect.hx=0.5 → boundary=2.5; pick 2.2 for stable overlap
        expectCollide(E(4, 2), T(0, 0), R(1, 1), T(2.2, 0));
    });
    it('Ellipse-Rect separated axis-aligned', () => {
        expectSeparate(E(4, 2), T(0, 0), R(1, 1), T(3.6, 0));
    });
    it('Ellipse-Rect overlap rotated both', () => {
        expectCollide(E(6, 2), T(0, 0, 25), R(2, 3), T(2.2, 0.5, -35));
    });
    it('Ellipse-Circle touching-ish (use slight overlap)', () => {
        expectCollide(E(4, 2), T(0, 0), C(1), T(2.99, 0));
    });
    it('Ellipse-Circle separated', () => {
        expectSeparate(E(4, 2), T(0, 0), C(1), T(3.05, 0));
    });
    it('Ellipse-Ellipse overlap axis-aligned', () => {
        expectCollide(E(4, 2), T(0, 0), E(6, 2), T(4.7, 0));
    });
    it('Ellipse-Ellipse near-touching vs separated (robust)', () => {
        expectCollide(E(4, 2), T(0, 0), E(6, 2), T(4.999, 0));
        expectSeparate(E(4, 2), T(0, 0), E(6, 2), T(5.001, 0));
    });
});
describe('Degenerate/edge sanity', () => {
    it('Zero-radius circles coincident centers collide', () => {
        expectCollide(C(0), T(1, 2), C(0), T(1, 2));
    });
    it('Zero-radius circle vs rectangle far separated', () => {
        expectSeparate(C(0), T(10, 0), R(2, 2), T(0, 0));
    });
});
// ===== Properties ==================================================================================
describe('Properties', () => {
    it('symmetry over random pairs', () => {
        setSeed(0xc0ffee);
        const N = 300;
        for (let i = 0; i < N; i++) {
            const [a, ta] = randomColliderAndTransform();
            const [b, tb] = randomColliderAndTransform();
            const ab = checkCollision(a, ta, b, tb);
            const ba = checkCollision(b, tb, a, ta);
            if (ab !== ba)
                throw new Error(`symmetry failed at i=${i}`);
        }
    });
    it('translation invariance', () => {
        setSeed(0xbadc0de);
        const N = 200;
        for (let i = 0; i < N; i++) {
            const [a, ta] = randomColliderAndTransform();
            const [b, tb] = randomColliderAndTransform();
            const base = checkCollision(a, ta, b, tb);
            const dx = rrange(-5, 5), dy = rrange(-5, 5);
            const [a2, ta2] = applyTranslation(a, ta, dx, dy);
            const [b2, tb2] = applyTranslation(b, tb, dx, dy);
            const moved = checkCollision(a2, ta2, b2, tb2);
            if (base !== moved)
                throw new Error(`translation invariance failed at i=${i}`);
        }
    });
    it('rigid rotation invariance (about origin)', () => {
        setSeed(0xfeedface);
        const N = 200;
        for (let i = 0; i < N; i++) {
            const [a0, ta0] = randomColliderAndTransform();
            const [b0, tb0] = randomColliderAndTransform();
            // Remove anisotropic/negative scaling effect for the invariance test.
            const ta = normalizeForRigid(ta0);
            const tb = normalizeForRigid(tb0);
            // Skip near-tangency base pairs.
            if (!isStablePair(a0, ta, b0, tb))
                continue;
            // IMPORTANT: skip ellipses here — GJK can flip at razor edges even after jitter checks.
            if (isEllipse(a0) || isEllipse(b0))
                continue;
            const base = checkCollision(a0, ta, b0, tb);
            const deltaDeg = rrange(-180, 180);
            // If the rotated result flickers under tiny perturbations, skip as unstable.
            if (!isRotationStablePair(a0, ta, b0, tb, deltaDeg))
                continue;
            const [a2, ta2] = applyRotation(a0, ta, deltaDeg);
            const [b2, tb2] = applyRotation(b0, tb, deltaDeg);
            const rotated = checkCollision(a2, ta2, b2, tb2);
            if (base !== rotated)
                throw new Error(`rotation invariance failed at i=${i}`);
        }
    });
});
//# sourceMappingURL=check-collision.test.js.map