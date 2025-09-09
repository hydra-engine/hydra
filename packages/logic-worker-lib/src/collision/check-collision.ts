import { WorldTransform } from '../logic-node/core/world-transform'
import { CircleCollider, Collider, ColliderType, EllipseCollider, PolygonCollider, RectangleCollider } from './colliders'

// =====================================================================================
// Utilities (scalar-only, no allocations at runtime)
// =====================================================================================

const abs = (v: number) => (v < 0 ? -v : v)

// ---- numeric guards -------------------------------------------------------------
function isFiniteNumber(n: any): n is number {
  return typeof n === 'number' && Number.isFinite(n)
}
function allFinite(...nums: any[]): boolean {
  for (let i = 0; i < nums.length; i++) {
    if (!isFiniteNumber(nums[i])) return false
  }
  return true
}

// ---- collider / transform validators -------------------------------------------
function validTransform(t: WorldTransform): boolean {
  return allFinite(t.x, t.y, t.cos, t.sin, t.scaleX, t.scaleY, t.rotation)
}
function validRect(r: RectangleCollider): boolean {
  return allFinite(r.width, r.height, (r as any).x ?? 0, (r as any).y ?? 0)
}
function validCircle(c: CircleCollider): boolean {
  return allFinite(c.radius, (c as any).x ?? 0, (c as any).y ?? 0)
}
function validEllipse(e: EllipseCollider): boolean {
  return allFinite(e.width, e.height, (e as any).x ?? 0, (e as any).y ?? 0)
}
function validPoly(p: PolygonCollider): boolean {
  if (!Array.isArray(p.vertices) || p.vertices.length === 0) return false
  for (let i = 0; i < p.vertices.length; i++) {
    const v = p.vertices[i]
    if (!allFinite(v?.x, v?.y)) return false
  }
  return allFinite((p as any).x ?? 0, (p as any).y ?? 0)
}

// =====================================================================================
// OBB helpers (scalar-only)
// =====================================================================================

function obbRadiusOnAxis(
  Lx: number, Ly: number,
  ux: number, uy: number, vx: number, vy: number, hx: number, hy: number
) {
  // Guard: invalid → propagate NaN
  if (!allFinite(Lx, Ly, ux, uy, vx, vy, hx, hy)) return NaN
  // hx, hy must be >= 0; project axis onto OBB's local axes and scale by half extents.
  const Lu = Lx * ux + Ly * uy
  const Lv = Lx * vx + Ly * vy
  const a = hx * (Lu < 0 ? -Lu : Lu)
  const b = hy * (Lv < 0 ? -Lv : Lv)
  return a + b
}

function axisSeparates(
  Lx: number, Ly: number, dx: number, dy: number,
  aux: number, auy: number, avx: number, avy: number, ahx: number, ahy: number,
  bux: number, buy: number, bvx: number, bvy: number, bhx: number, bhy: number
) {
  // Invalid input → treat as separated to avoid false-positive overlap
  if (!allFinite(Lx, Ly, dx, dy, aux, auy, avx, avy, ahx, ahy, bux, buy, bvx, bvy, bhx, bhy)) return true
  const dist = dx * Lx + dy * Ly
  const ad = dist < 0 ? -dist : dist
  const rA = obbRadiusOnAxis(Lx, Ly, aux, auy, avx, avy, ahx, ahy)
  const rB = obbRadiusOnAxis(Lx, Ly, bux, buy, bvx, bvy, bhx, bhy)
  if (!allFinite(ad, rA, rB)) return true
  return ad > (rA + rB)
}

// =====================================================================================
// Rectangle–Rectangle (OBB–OBB) — SAT with 4 axes (no allocations)
// =====================================================================================

function checkRectRectCollision(
  ca: RectangleCollider, ta: WorldTransform,
  cb: RectangleCollider, tb: WorldTransform
): boolean {
  // Fast invalid-input exit
  if (!validTransform(ta) || !validTransform(tb) || !validRect(ca) || !validRect(cb)) return false

  // A frame (half extents must be non-negative)
  const asx = ta.scaleX, asy = ta.scaleY
  const ahx = abs(ca.width * asx) * 0.5
  const ahy = abs(ca.height * asy) * 0.5
  const cA = ta.cos, sA = ta.sin
  const aux = cA, auy = sA
  const avx = -sA, avy = cA
  // apply rotated local offset for center
  const aox = (ca.x || 0) * asx
  const aoy = (ca.y || 0) * asy
  const ax = ta.x + aux * aox + avx * aoy
  const ay = ta.y + auy * aox + avy * aoy

  // B frame
  const bsx = tb.scaleX, bsy = tb.scaleY
  const bhx = abs(cb.width * bsx) * 0.5
  const bhy = abs(cb.height * bsy) * 0.5
  const cB = tb.cos, sB = tb.sin
  const bux = cB, buy = sB
  const bvx = -sB, bvy = cB
  const box = (cb.x || 0) * bsx
  const boy = (cb.y || 0) * bsy
  const bx = tb.x + bux * box + bvx * boy
  const by = tb.y + buy * box + bvy * boy

  if (!allFinite(ahx, ahy, bhx, bhy, ax, ay, bx, by, aux, auy, avx, avy, bux, buy, bvx, bvy)) return false

  // Fast axis-aligned branch if both rotations are zero
  const rotA = ta.rotation, rotB = tb.rotation
  if ((rotA === 0 || rotA === 0.0) && (rotB === 0 || rotB === 0.0)) {
    const dx0 = bx - ax; const adx0 = dx0 < 0 ? -dx0 : dx0
    const dy0 = by - ay; const ady0 = dy0 < 0 ? -dy0 : dy0
    if (!allFinite(adx0, ady0)) return false
    return (adx0 <= ahx + bhx) && (ady0 <= ahy + bhy)
  }

  const dx = bx - ax
  const dy = by - ay
  if (!allFinite(dx, dy)) return false

  if (axisSeparates(aux, auy, dx, dy, aux, auy, avx, avy, ahx, ahy, bux, buy, bvx, bvy, bhx, bhy)) return false
  if (axisSeparates(avx, avy, dx, dy, aux, auy, avx, avy, ahx, ahy, bux, buy, bvx, bvy, bhx, bhy)) return false
  if (axisSeparates(bux, buy, dx, dy, aux, auy, avx, avy, ahx, ahy, bux, buy, bvx, bvy, bhx, bhy)) return false
  if (axisSeparates(bvx, bvy, dx, dy, aux, auy, avx, avy, ahx, ahy, bux, buy, bvx, bvy, bhx, bhy)) return false

  return true
}

// =====================================================================================
// Circle tools (no allocations)
// =====================================================================================

// scratch for circle center computations (reused everywhere; no runtime object creation)
let _ccx = 0, _ccy = 0

// Writes the world-space center into (_ccx, _ccy).
function circleCenterScratch(c: CircleCollider, t: WorldTransform): void {
  if (!validTransform(t) || !validCircle(c)) { _ccx = NaN as any; _ccy = NaN as any; return }
  const sx = t.scaleX, sy = t.scaleY
  const cos = t.cos, sin = t.sin
  // local axes
  const ux = cos, uy = sin
  const vx = -sin, vy = cos
  // scaled local offset
  const ox = (c.x || 0) * sx
  const oy = (c.y || 0) * sy
  _ccx = t.x + ux * ox + vx * oy
  _ccy = t.y + uy * ox + vy * oy
}

function circleScaledRadius(c: CircleCollider, t: WorldTransform) {
  if (!validTransform(t) || !validCircle(c)) return NaN
  const sx = abs(t.scaleX), sy = abs(t.scaleY)
  return c.radius * (sx > sy ? sx : sy) // conservative
}

function checkCircleCircleCollision(
  ca: CircleCollider, ta: WorldTransform, cb: CircleCollider, tb: WorldTransform
): boolean {
  if (!validTransform(ta) || !validTransform(tb) || !validCircle(ca) || !validCircle(cb)) return false
  circleCenterScratch(ca, ta); const ax = _ccx, ay = _ccy
  circleCenterScratch(cb, tb); const bx = _ccx, by = _ccy
  const ra = circleScaledRadius(ca, ta)
  const rb = circleScaledRadius(cb, tb)
  if (!allFinite(ax, ay, bx, by, ra, rb)) return false
  const dx = bx - ax, dy = by - ay
  const r = ra + rb
  return (dx * dx + dy * dy) <= r * r
}

// =====================================================================================
// Rect–Circle (no allocations)
// =====================================================================================

function checkRectCircleCollision(
  r: RectangleCollider, tr: WorldTransform,
  c: CircleCollider, tc: WorldTransform
): boolean {
  if (!validTransform(tr) || !validTransform(tc) || !validRect(r) || !validCircle(c)) return false

  // Rect frame
  const rsx = tr.scaleX, rsy = tr.scaleY
  const rhx = abs(r.width * rsx) * 0.5
  const rhy = abs(r.height * rsy) * 0.5
  const rc = tr.cos, rs = tr.sin
  const rux = rc, ruy = rs
  const rvx = -rs, rvy = rc
  const rox = (r.x || 0) * rsx
  const roy = (r.y || 0) * rsy
  const rcx = tr.x + rux * rox + rvx * roy
  const rcy = tr.y + ruy * rox + rvy * roy
  if (!allFinite(rhx, rhy, rux, ruy, rvx, rvy, rcx, rcy)) return false

  // Circle center + radius (into scratch scalars)
  circleCenterScratch(c, tc)
  const rr = circleScaledRadius(c, tc)
  if (!allFinite(_ccx, _ccy, rr)) return false

  // Project center delta onto rect local axes and clamp
  const dx = _ccx - rcx, dy = _ccy - rcy
  if (!allFinite(dx, dy)) return false
  const qx = dx * rux + dy * ruy
  const qy = dx * rvx + dy * rvy
  if (!allFinite(qx, qy)) return false
  const clx = qx < -rhx ? -rhx : (qx > rhx ? rhx : qx)
  const cly = qy < -rhy ? -rhy : (qy > rhy ? rhy : qy)
  const ddx = qx - clx
  const ddy = qy - cly
  if (!allFinite(ddx, ddy)) return false
  return (ddx * ddx + ddy * ddy) <= rr * rr
}

// =====================================================================================
// Polygon helpers — SAT (no allocations; polygons are in LOCAL space + Transform)
// =====================================================================================

/*
  Notes:
  - Polygons are stored in LOCAL space. We never allocate world-space copies.
  - For any world axis N = (nx, ny), projection of a local vertex (vx, vy) is:
      dot(N, C) + dot(N, U)*sx*vx + dot(N, V)*sy*vy
    where C is world center, U/V are world unit axes of the polygon frame,
    and sx/sy are scale on those local axes.
  - No objects/arrays are created at runtime. Only scalar computations and loops.
*/

// Poly–Poly (LOCAL + Transform)
function checkPolyPolyCollision(
  a: PolygonCollider, ta: WorldTransform,
  b: PolygonCollider, tb: WorldTransform
): boolean {
  if (!validTransform(ta) || !validTransform(tb) || !validPoly(a) || !validPoly(b)) return false

  const av = a.vertices, bv = b.vertices
  const na = av.length, nb = bv.length
  if (na === 0 || nb === 0) return false

  // Frame A
  const asx = ta.scaleX, asy = ta.scaleY
  const acs = ta.cos, asn = ta.sin
  const aux = acs, auy = asn
  const avx = -asn, avy = acs
  const aox = ((a as any).x || 0) * asx
  const aoy = ((a as any).y || 0) * asy
  const acx = ta.x + aux * aox + avx * aoy
  const acy = ta.y + auy * aox + avy * aoy

  // Frame B
  const bsx = tb.scaleX, bsy = tb.scaleY
  const bcs = tb.cos, bsn = tb.sin
  const bux = bcs, buy = bsn
  const bvx = -bsn, bvy = bcs
  const box = ((b as any).x || 0) * bsx
  const boy = ((b as any).y || 0) * bsy
  const bcx = tb.x + bux * box + bvx * boy
  const bcy = tb.y + buy * box + bvy * boy

  if (!allFinite(asx, asy, aux, auy, avx, avy, acx, acy, bsx, bsy, bux, buy, bvx, bvy, bcx, bcy)) return false

  let i = 0, j = 0, k = 0

  // A's edge axes
  for (i = 0; i < na; i++) {
    j = (i + 1) % na
    const adx = av[j].x - av[i].x
    const ady = av[j].y - av[i].y
    const ewx = aux * (asx * adx) + avx * (asy * ady)
    const ewy = auy * (asx * adx) + avy * (asy * ady)
    const nx = -ewy, ny = ewx
    if (!allFinite(nx, ny)) return false

    // project A on (nx,ny)
    const kUa = (nx * aux + ny * auy) * asx
    const kVa = (nx * avx + ny * avy) * asy
    const baseA = nx * acx + ny * acy
    if (!allFinite(kUa, kVa, baseA)) return false
    let minA = Infinity, maxA = -Infinity
    for (k = 0; k < na; k++) {
      const s = baseA + kUa * av[k].x + kVa * av[k].y
      if (!isFiniteNumber(s)) return false
      if (s < minA) minA = s
      if (s > maxA) maxA = s
    }

    // project B on (nx,ny)
    const kUb = (nx * bux + ny * buy) * bsx
    const kVb = (nx * bvx + ny * bvy) * bsy
    const baseB = nx * bcx + ny * bcy
    if (!allFinite(kUb, kVb, baseB)) return false
    let minB = Infinity, maxB = -Infinity
    for (k = 0; k < nb; k++) {
      const s = baseB + kUb * bv[k].x + kVb * bv[k].y
      if (!isFiniteNumber(s)) return false
      if (s < minB) minB = s
      if (s > maxB) maxB = s
    }

    if (maxA < minB || maxB < minA) return false
  }

  // B's edge axes
  for (i = 0; i < nb; i++) {
    j = (i + 1) % nb
    const bdx = bv[j].x - bv[i].x
    const bdy = bv[j].y - bv[i].y
    const ewx = bux * (bsx * bdx) + bvx * (bsy * bdy)
    const ewy = buy * (bsx * bdx) + bvy * (bsy * bdy)
    const nx = -ewy, ny = ewx
    if (!allFinite(nx, ny)) return false

    // project A
    const kUa = (nx * aux + ny * auy) * asx
    const kVa = (nx * avx + ny * avy) * asy
    const baseA = nx * acx + ny * acy
    if (!allFinite(kUa, kVa, baseA)) return false
    let minA = Infinity, maxA = -Infinity
    for (k = 0; k < na; k++) {
      const s = baseA + kUa * av[k].x + kVa * av[k].y
      if (!isFiniteNumber(s)) return false
      if (s < minA) minA = s
      if (s > maxA) maxA = s
    }

    // project B
    const kUb = (nx * bux + ny * buy) * bsx
    const kVb = (nx * bvx + ny * bvy) * bsy
    const baseB = nx * bcx + ny * bcy
    if (!allFinite(kUb, kVb, baseB)) return false
    let minB = Infinity, maxB = -Infinity
    for (k = 0; k < nb; k++) {
      const s = baseB + kUb * bv[k].x + kVb * bv[k].y
      if (!isFiniteNumber(s)) return false
      if (s < minB) minB = s
      if (s > maxB) maxB = s
    }

    if (maxA < minB || maxB < minA) return false
  }

  return true
}

// Poly–Circle (LOCAL + Transform)
function checkPolyCircleCollision(poly: PolygonCollider, tp: WorldTransform, c: CircleCollider, tc: WorldTransform): boolean {
  if (!validTransform(tp) || !validTransform(tc) || !validPoly(poly) || !validCircle(c)) return false

  const v = poly.vertices; const n = v.length; if (n === 0) return false

  // Poly frame
  const psx = tp.scaleX, psy = tp.scaleY
  const pcs = tp.cos, psn = tp.sin
  const pux = pcs, puy = psn
  const pvx = -psn, pvy = pcs
  const pox = ((poly as any).x || 0) * psx
  const poy = ((poly as any).y || 0) * psy
  const pcx = tp.x + pux * pox + pvx * poy
  const pcy = tp.y + puy * pox + pvy * poy
  if (!allFinite(psx, psy, pux, puy, pvx, pvy, pcx, pcy)) return false

  // Circle center + radius
  circleCenterScratch(c, tc)
  const CCx = _ccx, CCy = _ccy
  const rr = circleScaledRadius(c, tc)
  if (!allFinite(CCx, CCy, rr)) return false

  let i = 0, j = 0, k = 0

  // (A) Polygon edge axes
  for (i = 0; i < n; i++) {
    j = (i + 1) % n
    const dx = v[j].x - v[i].x
    const dy = v[j].y - v[i].y
    const ewx = pux * (psx * dx) + pvx * (psy * dy)
    const ewy = puy * (psx * dx) + pvy * (psy * dy)
    const nx = -ewy, ny = ewx
    if (!allFinite(nx, ny)) return false
    const kUp = (nx * pux + ny * puy) * psx
    const kVp = (nx * pvx + ny * pvy) * psy
    const baseP = nx * pcx + ny * pcy
    if (!allFinite(kUp, kVp, baseP)) return false
    let minP = Infinity, maxP = -Infinity
    for (k = 0; k < n; k++) {
      const s = baseP + kUp * v[k].x + kVp * v[k].y
      if (!isFiniteNumber(s)) return false
      if (s < minP) minP = s
      if (s > maxP) maxP = s
    }
    const nlen = Math.hypot(nx, ny)
    if (!isFiniteNumber(nlen)) return false
    const cProj = nx * CCx + ny * CCy
    if (!isFiniteNumber(cProj)) return false
    const minC = cProj - rr * nlen
    const maxC = cProj + rr * nlen
    if (!allFinite(minC, maxC)) return false
    if (maxP < minC || maxC < minP) return false
  }

  // (B) Closest-vertex axis
  let bestDx = 0, bestDy = 0, bestD2 = Infinity
  for (i = 0; i < n; i++) {
    const wx = pcx + pux * (psx * v[i].x) + pvx * (psy * v[i].y)
    const wy = pcy + puy * (psx * v[i].x) + pvy * (psy * v[i].y)
    if (!allFinite(wx, wy)) return false
    const dx = CCx - wx
    const dy = CCy - wy
    if (!allFinite(dx, dy)) return false
    const d2 = dx * dx + dy * dy
    if (!isFiniteNumber(d2)) return false
    if (d2 < bestD2) { bestD2 = d2; bestDx = dx; bestDy = dy }
  }
  if (!isFiniteNumber(bestD2)) return false
  if (bestD2 === 0) return true
  {
    const nx = bestDx, ny = bestDy
    if (!allFinite(nx, ny)) return false
    const kUp = (nx * pux + ny * puy) * psx
    const kVp = (nx * pvx + ny * pvy) * psy
    const baseP = nx * pcx + ny * pcy
    if (!allFinite(kUp, kVp, baseP)) return false
    let minP = Infinity, maxP = -Infinity
    for (i = 0; i < n; i++) {
      const s = baseP + kUp * v[i].x + kVp * v[i].y
      if (!isFiniteNumber(s)) return false
      if (s < minP) minP = s
      if (s > maxP) maxP = s
    }
    const nlen = Math.hypot(nx, ny)
    if (!isFiniteNumber(nlen)) return false
    const cProj = nx * CCx + ny * CCy
    if (!isFiniteNumber(cProj)) return false
    const minC = cProj - rr * nlen
    const maxC = cProj + rr * nlen
    if (!allFinite(minC, maxC)) return false
    if (maxP < minC || maxC < minP) return false
  }

  return true
}

// Poly–Rect (LOCAL + Transform)
function checkPolyRectCollision(poly: PolygonCollider, tp: WorldTransform, r: RectangleCollider, tr: WorldTransform): boolean {
  if (!validTransform(tp) || !validTransform(tr) || !validPoly(poly) || !validRect(r)) return false

  const v = poly.vertices; const n = v.length; if (n === 0) return false

  // Poly frame
  const psx = tp.scaleX, psy = tp.scaleY
  const pcs = tp.cos, psn = tp.sin
  const pux = pcs, puy = psn
  const pvx = -psn, pvy = pcs
  const pox = ((poly as any).x || 0) * psx
  const poy = ((poly as any).y || 0) * psy
  const pcx = tp.x + pux * pox + pvx * poy
  const pcy = tp.y + puy * pox + pvy * poy
  if (!allFinite(psx, psy, pux, puy, pvx, pvy, pcx, pcy)) return false

  // Rect frame
  const rsx = tr.scaleX, rsy = tr.scaleY
  const rhx = abs(r.width * rsx) * 0.5
  const rhy = abs(r.height * rsy) * 0.5
  const rc = tr.cos, rs = tr.sin
  const rux = rc, ruy = rs
  const rvx = -rs, rvy = rc
  const rox = (r.x || 0) * rsx, roy = (r.y || 0) * rsy
  const rcx = tr.x + rux * rox + rvx * roy
  const rcy = tr.y + ruy * rox + rvy * roy
  if (!allFinite(rhx, rhy, rux, ruy, rvx, rvy, rcx, rcy)) return false

  let i = 0, j = 0, k = 0

  // (A) polygon edge axes
  for (i = 0; i < n; i++) {
    j = (i + 1) % n
    const dx = v[j].x - v[i].x
    const dy = v[j].y - v[i].y
    const ewx = pux * (psx * dx) + pvx * (psy * dy)
    const ewy = puy * (psx * dx) + pvy * (psy * dy)
    const nx = -ewy, ny = ewx
    if (!allFinite(nx, ny)) return false

    // poly projection
    const kUp = (nx * pux + ny * puy) * psx
    const kVp = (nx * pvx + ny * pvy) * psy
    const baseP = nx * pcx + ny * pcy
    if (!allFinite(kUp, kVp, baseP)) return false
    let minP = Infinity, maxP = -Infinity
    for (k = 0; k < n; k++) {
      const s = baseP + kUp * v[k].x + kVp * v[k].y
      if (!isFiniteNumber(s)) return false
      if (s < minP) minP = s
      if (s > maxP) maxP = s
    }

    // rect projection radius on axis
    const nu = nx * rux + ny * ruy
    const nv = nx * rvx + ny * rvy
    if (!allFinite(nu, nv)) return false
    const rRad = rhx * (nu < 0 ? -nu : nu) + rhy * (nv < 0 ? -nv : nv)
    const cProj = nx * rcx + ny * rcy
    if (!allFinite(rRad, cProj)) return false
    const minR = cProj - rRad
    const maxR = cProj + rRad
    if (!allFinite(minR, maxR)) return false
    if (maxP < minR || maxR < minP) return false
  }

  // (B) rect axis u
  {
    const nx = rux, ny = ruy
    const kUp = (nx * pux + ny * puy) * psx
    const kVp = (nx * pvx + ny * pvy) * psy
    const baseP = nx * pcx + ny * pcy
    if (!allFinite(nx, ny, kUp, kVp, baseP)) return false
    let minP = Infinity, maxP = -Infinity
    for (i = 0; i < n; i++) {
      const s = baseP + kUp * v[i].x + kVp * v[i].y
      if (!isFiniteNumber(s)) return false
      if (s < minP) minP = s
      if (s > maxP) maxP = s
    }
    const cProj = nx * rcx + ny * rcy
    if (!isFiniteNumber(cProj)) return false
    const minR = cProj - rhx
    const maxR = cProj + rhx
    if (!allFinite(minR, maxR)) return false
    if (maxP < minR || maxR < minP) return false
  }
  // (C) rect axis v
  {
    const nx = rvx, ny = rvy
    const kUp = (nx * pux + ny * puy) * psx
    const kVp = (nx * pvx + ny * pvy) * psy
    const baseP = nx * pcx + ny * pcy
    if (!allFinite(nx, ny, kUp, kVp, baseP)) return false
    let minP = Infinity, maxP = -Infinity
    for (i = 0; i < n; i++) {
      const s = baseP + kUp * v[i].x + kVp * v[i].y
      if (!isFiniteNumber(s)) return false
      if (s < minP) minP = s
      if (s > maxP) maxP = s
    }
    const cProj = nx * rcx + ny * rcy
    if (!isFiniteNumber(cProj)) return false
    const minR = cProj - rhy
    const maxR = cProj + rhy
    if (!allFinite(minR, maxR)) return false
    if (maxP < minR || maxR < minP) return false
  }

  return true
}

// =====================================================================================
// GJK (no allocations: global scratch + selectable supports) — FIXED/ROBUST
// =====================================================================================

// Global scratch for support result
let _sx = 0, _sy = 0

// Support selectors
const enum SupportType { None = 0, Ellipse = 1, OBB = 2, Circle = 3, Poly = 4, PolyLocal = 5 }
let _supportAType = SupportType.None
let _supportBType = SupportType.None

// A-shape params
let _Acx = 0, _Acy = 0, _Aux = 0, _Auy = 0, _Avx = 0, _Avy = 0, _Arx = 0, _Ary = 0, _Ahx = 0, _Ahy = 0, _Arr = 0
let _Apoly: { x: number, y: number }[] | null = null

// B-shape params
let _Bcx = 0, _Bcy = 0, _Bux = 0, _Buy = 0, _Bvx = 0, _Bvy = 0, _Brx = 0, _Bry = 0, _Bhx = 0, _Bhy = 0, _Brr = 0
let _Bpoly: { x: number, y: number }[] | null = null

function setSupportCircle(dx: number, dy: number, cx: number, cy: number, r: number) {
  const len = Math.hypot(dx, dy)
  if (!isFiniteNumber(len)) { _sx = NaN as any; _sy = NaN as any; return }
  if (len === 0) { _sx = cx; _sy = cy; return }
  const inv = 1 / len
  _sx = cx + dx * inv * r
  _sy = cy + dy * inv * r
}

function setSupportOBB(
  dx: number, dy: number,
  cx: number, cy: number, ux: number, uy: number, vx: number, vy: number, hx: number, hy: number
) {
  if (!allFinite(dx, dy, cx, cy, ux, uy, vx, vy, hx, hy)) { _sx = NaN as any; _sy = NaN as any; return }
  const du = dx * ux + dy * uy
  const dv = dx * vx + dy * vy
  const sx = du >= 0 ? 1 : -1
  const sy = dv >= 0 ? 1 : -1
  _sx = cx + ux * hx * sx + vx * hy * sy
  _sy = cy + uy * hx * sx + vy * hy * sy
}

function dvDy(dy: number, a: number) { return dy * a } // tiny inline helper

function setSupportEllipse(
  dx: number, dy: number,
  cx: number, cy: number, ux: number, uy: number, vx: number, vy: number, rx: number, ry: number
) {
  if (!allFinite(dx, dy, cx, cy, ux, uy, vx, vy, rx, ry)) { _sx = NaN as any; _sy = NaN as any; return }
  const du = dx * ux + dvDy(dy, uy)
  const dv = dx * vx + dvDy(dy, vy)
  const denom = Math.hypot(rx * du, ry * dv)
  if (!isFiniteNumber(denom)) { _sx = NaN as any; _sy = NaN as any; return }
  if (denom === 0) { _sx = cx; _sy = cy; return }
  const kU = (rx * rx * du) / denom
  const kV = (ry * ry * dv) / denom
  _sx = cx + kU * ux + kV * vx
  _sy = cy + kU * uy + kV * vy
}

function setSupportPoly(dx: number, dy: number, verts: { x: number, y: number }[]) {
  if (!allFinite(dx, dy)) { _sx = NaN as any; _sy = NaN as any; return }
  let best = 0, bestDot = -Infinity
  for (let i = 0, n = verts.length; i < n; i++) {
    const vx = verts[i].x, vy = verts[i].y
    const d = dx * vx + dy * vy
    if (!isFiniteNumber(d)) { _sx = NaN as any; _sy = NaN as any; return }
    if (d > bestDot) { bestDot = d; best = i }
  }
  _sx = verts[best].x
  _sy = verts[best].y
}

// PolyLocal support: verts in LOCAL, with frame (cx,cy, U/V, sx/sy)
function setSupportPolyLocal(
  dx: number, dy: number,
  verts: { x: number, y: number }[],
  cx: number, cy: number, ux: number, uy: number, vx: number, vy: number, sx: number, sy: number
) {
  if (!allFinite(dx, dy, cx, cy, ux, uy, vx, vy, sx, sy)) { _sx = NaN as any; _sy = NaN as any; return }
  const kU = (dx * ux + dy * uy) * sx
  const kV = (dx * vx + dy * vy) * sy
  if (!allFinite(kU, kV)) { _sx = NaN as any; _sy = NaN as any; return }
  let best = 0, bestDot = -Infinity
  for (let i = 0, n = verts.length; i < n; i++) {
    const s = kU * verts[i].x + kV * verts[i].y
    if (!isFiniteNumber(s)) { _sx = NaN as any; _sy = NaN as any; return }
    if (s > bestDot) { bestDot = s; best = i }
  }
  const lx = verts[best].x, ly = verts[best].y
  _sx = cx + ux * (sx * lx) + vx * (sy * ly)
  _sy = cy + uy * (sx * lx) + vy * (sy * ly)
}

function supportA(dx: number, dy: number) {
  if (_supportAType === SupportType.Ellipse) setSupportEllipse(dx, dy, _Acx, _Acy, _Aux, _Auy, _Avx, _Avy, _Arx, _Ary)
  else if (_supportAType === SupportType.OBB) setSupportOBB(dx, dy, _Acx, _Acy, _Aux, _Auy, _Avx, _Avy, _Ahx, _Ahy)
  else if (_supportAType === SupportType.Circle) setSupportCircle(dx, dy, _Acx, _Acy, _Arr)
  else if (_supportAType === SupportType.Poly) setSupportPoly(dx, dy, _Apoly!)
  else if (_supportAType === SupportType.PolyLocal) setSupportPolyLocal(dx, dy, _Apoly!, _Acx, _Acy, _Aux, _Auy, _Avx, _Avy, _Arx, _Ary)
  else { _sx = NaN as any; _sy = NaN as any }
}
function supportB(dx: number, dy: number) {
  if (_supportBType === SupportType.Ellipse) setSupportEllipse(dx, dy, _Bcx, _Bcy, _Bux, _Buy, _Bvx, _Bvy, _Brx, _Bry)
  else if (_supportBType === SupportType.OBB) setSupportOBB(dx, dy, _Bcx, _Bcy, _Bux, _Buy, _Bvx, _Bvy, _Bhx, _Bhy)
  else if (_supportBType === SupportType.Circle) setSupportCircle(dx, dy, _Bcx, _Bcy, _Brr)
  else if (_supportBType === SupportType.Poly) setSupportPoly(dx, dy, _Bpoly!)
  else if (_supportBType === SupportType.PolyLocal) setSupportPolyLocal(dx, dy, _Bpoly!, _Bcx, _Bcy, _Bux, _Buy, _Bvx, _Bvy, _Brx, _Bry)
  else { _sx = NaN as any; _sy = NaN as any }
}

// GJK core — returns true if intersection (robust; no allocations)
function gjkIntersectsNoAlloc(): boolean {
  // EPS guards degenerate directions/points
  const EPS = 1e-9
  const EPS2 = EPS * EPS

  // simplex points (A = most recently added)
  let ax = 0, ay = 0, bx = 0, by = 0, cx = 0, cy = 0
  let n = 0

  // search direction
  let dx = 1, dy = 0

  // Adds a new support point as A and shifts previous (C<-B, B<-A)
  function addPointAsA() {
    supportA(dx, dy); const pax = _sx, pay = _sy
    supportB(-dx, -dy); const pbx = _sx, pby = _sy
    if (!allFinite(pax, pay, pbx, pby)) { ax = ay = bx = by = cx = cy = NaN as any; return }

    const px = pax - pbx, py = pay - pby
    cx = bx; cy = by
    bx = ax; by = ay
    ax = px; ay = py
    if (n < 3) n++
  }

  addPointAsA()
  if (!allFinite(ax, ay)) return false
  if (ax * ax + ay * ay <= EPS2) return true // origin exactly (or ~) hit
  dx = -ax; dy = -ay

  for (let iter = 0; iter < 32; iter++) {
    const dLen2 = dx * dx + dy * dy
    if (!isFiniteNumber(dLen2)) return false
    if (dLen2 <= EPS2) return true // direction collapsed → enclosed

    addPointAsA()
    if (!allFinite(ax, ay, bx, by, cx, cy)) return false

    // If new point A does not pass beyond origin along d, shapes are separated
    const Ad = ax * dx + ay * dy
    if (!isFiniteNumber(Ad)) return false
    if (Ad <= 0) return false
    if (ax * ax + ay * ay <= EPS2) return true

    if (n === 2) {
      // Segment (B-A). d = triple(AB, AO, AB)
      const abx = bx - ax, aby = by - ay
      const aox = -ax, aoy = -ay
      const ac = abx * abx + aby * aby
      const bc = aox * abx + aoy * aby
      if (!allFinite(abx, aby, aox, aoy, ac, bc)) return false
      dx = aox * ac - abx * bc
      dy = aoy * ac - aby * bc
      continue
    }

    // Triangle (C-B-A), A is the latest point
    const abx = bx - ax, aby = by - ay
    const acx = cx - ax, acy = cy - ay
    const aox = -ax, aoy = -ay
    if (!allFinite(abx, aby, acx, acy, aox, aoy)) return false

    // abPerp = triple(AC, AO, AB)
    const ac_ab = acx * abx + acy * aby
    const ao_ab = aox * abx + aoy * aby
    let t1x = aox * ac_ab - acx * ao_ab
    let t1y = aoy * ac_ab - acy * ao_ab
    if (!allFinite(ac_ab, ao_ab, t1x, t1y)) return false
    if (t1x * aox + t1y * aoy > 0) {
      // Origin is in the AB region: drop C -> segment(B-A)
      cx = bx; cy = by; n = 2
      dx = t1x; dy = t1y
      continue
    }

    // acPerp = triple(AB, AO, AC)
    const ab_ac = abx * acx + aby * acy
    const ao_ac = aox * acx + aoy * acy
    let t2x = aox * ab_ac - abx * ao_ac
    let t2y = aoy * ab_ac - aby * ao_ac
    if (!allFinite(ab_ac, ao_ac, t2x, t2y)) return false
    if (t2x * aox + t2y * aoy > 0) {
      // Origin is in the AC region: drop B -> segment(C-A)
      bx = cx; by = cy; n = 2
      dx = t2x; dy = t2y
      continue
    }

    // Origin is inside triangle
    return true
  }

  // Conservative fallback
  return false
}

// =====================================================================================
// Ellipse interactions via GJK (no allocations)
// =====================================================================================

function checkEllipseRectCollision(
  e: EllipseCollider, te: WorldTransform,
  r: RectangleCollider, tr: WorldTransform
): boolean {
  if (!validTransform(te) || !validTransform(tr) || !validEllipse(e) || !validRect(r)) return false

  // A = Ellipse
  const esx = te.scaleX, esy = te.scaleY
  _Arx = abs(e.width * esx) * 0.5
  _Ary = abs(e.height * esy) * 0.5
  const ecs = te.cos, esn = te.sin
  _Aux = ecs; _Auy = esn; _Avx = -esn; _Avy = ecs
  const eox = (e.x || 0) * esx, eoy = (e.y || 0) * esy
  _Acx = te.x + _Aux * eox + _Avx * eoy
  _Acy = te.y + _Auy * eox + _Avy * eoy
  _supportAType = SupportType.Ellipse
  _Apoly = null

  // B = OBB (rect)
  const rsx = tr.scaleX, rsy = tr.scaleY
  _Bhx = abs(r.width * rsx) * 0.5
  _Bhy = abs(r.height * rsy) * 0.5
  const rcs = tr.cos, rsn = tr.sin
  _Bux = rcs; _Buy = rsn; _Bvx = -rsn; _Bvy = rcs
  const rox = (r.x || 0) * rsx, roy = (r.y || 0) * rsy
  _Bcx = tr.x + _Bux * rox + _Bvx * roy
  _Bcy = tr.y + _Buy * rox + _Bvy * roy
  _supportBType = SupportType.OBB
  _Bpoly = null

  if (!allFinite(_Arx, _Ary, _Aux, _Auy, _Avx, _Avy, _Acx, _Acy, _Bhx, _Bhy, _Bux, _Buy, _Bvx, _Bvy, _Bcx, _Bcy)) return false
  return gjkIntersectsNoAlloc()
}

function checkEllipseCircleCollision(
  e: EllipseCollider, te: WorldTransform,
  c: CircleCollider, tc: WorldTransform
): boolean {
  if (!validTransform(te) || !validTransform(tc) || !validEllipse(e) || !validCircle(c)) return false

  // A = Ellipse
  const esx = te.scaleX, esy = te.scaleY
  _Arx = abs(e.width * esx) * 0.5
  _Ary = abs(e.height * esy) * 0.5
  const ecs = te.cos, esn = te.sin
  _Aux = ecs; _Auy = esn; _Avx = -esn; _Avy = ecs
  const eox = (e.x || 0) * esx, eoy = (e.y || 0) * esy
  _Acx = te.x + _Aux * eox + _Avx * eoy
  _Acy = te.y + _Auy * eox + _Avy * eoy
  _supportAType = SupportType.Ellipse
  _Apoly = null

  // B = Circle
  circleCenterScratch(c, tc)
  _Bcx = _ccx; _Bcy = _ccy
  _Brr = circleScaledRadius(c, tc)
  _supportBType = SupportType.Circle
  _Bpoly = null

  if (!allFinite(_Arx, _Ary, _Aux, _Auy, _Avx, _Avy, _Acx, _Acy, _Bcx, _Bcy, _Brr)) return false
  return gjkIntersectsNoAlloc()
}

function checkEllipseEllipseCollision(
  a: EllipseCollider, ta: WorldTransform,
  b: EllipseCollider, tb: WorldTransform
): boolean {
  if (!validTransform(ta) || !validTransform(tb) || !validEllipse(a) || !validEllipse(b)) return false

  // A
  const asx = ta.scaleX, asy = ta.scaleY
  _Arx = abs(a.width * asx) * 0.5
  _Ary = abs(a.height * asy) * 0.5
  const acs = ta.cos, asn = ta.sin
  _Aux = acs; _Auy = asn; _Avx = -asn; _Avy = acs
  const aox = (a.x || 0) * asx, aoy = (a.y || 0) * asy
  _Acx = ta.x + _Aux * aox + _Avx * aoy
  _Acy = ta.y + _Auy * aox + _Avy * aoy
  _supportAType = SupportType.Ellipse
  _Apoly = null

  // B
  const bsx = tb.scaleX, bsy = tb.scaleY
  _Brx = abs(b.width * bsx) * 0.5
  _Bry = abs(b.height * bsy) * 0.5
  const bcs = tb.cos, bsn = tb.sin
  _Bux = bcs; _Buy = bsn; _Bvx = -bsn; _Bvy = bcs
  const box = (b.x || 0) * bsx, boy = (b.y || 0) * bsy
  _Bcx = tb.x + _Bux * box + _Bvx * boy
  _Bcy = tb.y + _Buy * box + _Bvy * boy
  _supportBType = SupportType.Ellipse
  _Bpoly = null

  if (!allFinite(_Arx, _Ary, _Aux, _Auy, _Avx, _Avy, _Acx, _Acy, _Brx, _Bry, _Bux, _Buy, _Bvx, _Bvy, _Bcx, _Bcy)) return false
  return gjkIntersectsNoAlloc()
}

// Poly–Ellipse via GJK (Poly in LOCAL + Transform, Ellipse in LOCAL + Transform)
function checkPolyEllipseCollision(poly: PolygonCollider, tp: WorldTransform, e: EllipseCollider, te: WorldTransform): boolean {
  if (!validTransform(tp) || !validTransform(te) || !validPoly(poly) || !validEllipse(e)) return false

  // A = Poly (LOCAL + Transform) → use PolyLocal support; reuse A scratch slots
  const psx = tp.scaleX, psy = tp.scaleY
  const pcs = tp.cos, psn = tp.sin
  const pux = pcs, puy = psn
  const pvx = -psn, pvy = pcs
  const pox = ((poly as any).x || 0) * psx
  const poy = ((poly as any).y || 0) * psy
  _Acx = tp.x + pux * pox + pvx * poy
  _Acy = tp.y + puy * pox + pvy * poy
  _Aux = pux; _Auy = puy; _Avx = pvx; _Avy = pvy
  _Arx = psx; _Ary = psy
  _Apoly = poly.vertices
  _supportAType = SupportType.PolyLocal

  // B = Ellipse
  const esx = te.scaleX, esy = te.scaleY
  _Brx = abs(e.width * esx) * 0.5
  _Bry = abs(e.height * esy) * 0.5
  const ecs = te.cos, esn = te.sin
  _Bux = ecs; _Buy = esn; _Bvx = -esn; _Bvy = ecs
  const eox = (e.x || 0) * esx, eoy = (e.y || 0) * esy
  _Bcx = te.x + _Bux * eox + _Bvx * eoy
  _Bcy = te.y + _Buy * eox + _Bvy * eoy
  _Bpoly = null
  _supportBType = SupportType.Ellipse

  if (!allFinite(_Acx, _Acy, _Aux, _Auy, _Avx, _Avy, _Arx, _Ary, _Bcx, _Bcy, _Bux, _Buy, _Bvx, _Bvy, _Brx, _Bry)) return false
  return gjkIntersectsNoAlloc()
}

// =====================================================================================
// Dispatcher (no allocations)
// =====================================================================================

export function checkCollision(ca: Collider, ta: WorldTransform, cb: Collider, tb: WorldTransform): boolean {
  // global transform validity first
  if (!validTransform(ta) || !validTransform(tb)) return false

  // Rectangle–Rectangle
  if (ca.type === ColliderType.Rectangle && cb.type === ColliderType.Rectangle)
    return checkRectRectCollision(ca, ta, cb, tb)

  // Circle–Circle
  if (ca.type === ColliderType.Circle && cb.type === ColliderType.Circle)
    return checkCircleCircleCollision(ca, ta, cb, tb)

  // Rect–Circle (both orders)
  if (ca.type === ColliderType.Rectangle && cb.type === ColliderType.Circle)
    return checkRectCircleCollision(ca, ta, cb, tb)
  if (ca.type === ColliderType.Circle && cb.type === ColliderType.Rectangle)
    return checkRectCircleCollision(cb, tb, ca, ta)

  // Polygon–Polygon (LOCAL + Transform)
  if (ca.type === ColliderType.Polygon && cb.type === ColliderType.Polygon)
    return checkPolyPolyCollision(ca, ta, cb, tb)

  // Polygon–Circle (both orders; LOCAL + Transform for polygon)
  if (ca.type === ColliderType.Polygon && cb.type === ColliderType.Circle)
    return checkPolyCircleCollision(ca, ta, cb, tb)
  if (ca.type === ColliderType.Circle && cb.type === ColliderType.Polygon)
    return checkPolyCircleCollision(cb, tb, ca, ta)

  // Polygon–Rect (both orders; LOCAL + Transform for polygon)
  if (ca.type === ColliderType.Polygon && cb.type === ColliderType.Rectangle)
    return checkPolyRectCollision(ca, ta, cb, tb)
  if (ca.type === ColliderType.Rectangle && cb.type === ColliderType.Polygon)
    return checkPolyRectCollision(cb, tb, ca, ta)

  // Ellipse interactions via GJK
  if (ca.type === ColliderType.Ellipse && cb.type === ColliderType.Rectangle)
    return checkEllipseRectCollision(ca, ta, cb, tb)
  if (ca.type === ColliderType.Rectangle && cb.type === ColliderType.Ellipse)
    return checkEllipseRectCollision(cb, tb, ca, ta)

  if (ca.type === ColliderType.Ellipse && cb.type === ColliderType.Circle)
    return checkEllipseCircleCollision(ca, ta, cb, tb)
  if (ca.type === ColliderType.Circle && cb.type === ColliderType.Ellipse)
    return checkEllipseCircleCollision(cb, tb, ca, ta)

  if (ca.type === ColliderType.Ellipse && cb.type === ColliderType.Ellipse)
    return checkEllipseEllipseCollision(ca, ta, cb, tb)

  // Polygon–Ellipse (both orders; polygon is LOCAL + Transform via PolyLocal support)
  if (ca.type === ColliderType.Polygon && cb.type === ColliderType.Ellipse)
    return checkPolyEllipseCollision(ca, ta, cb, tb)
  if (ca.type === ColliderType.Ellipse && cb.type === ColliderType.Polygon)
    return checkPolyEllipseCollision(cb, tb, ca, ta)

  return false
}
