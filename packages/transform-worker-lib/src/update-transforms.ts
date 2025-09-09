import { NONE, ObjectStateTree } from '@hydraengine/shared'

const APPROACH = 10      // 목표로 붙는 속도(값이 클수록 빠르게 수렴)
const EPS = 1e-3         // 목표 스냅 임계값

export function updateTransforms(tree: ObjectStateTree, dt: number) {
  tree.forEach((id) => {
    const parent = tree.getParent(id)
    if (parent === NONE) return

    const tx = tree.getTargetX(id)
    const ty = tree.getTargetY(id)

    if (!isNaN(tx) || !isNaN(ty)) {

      // 프레임 독립 지수 보간: k = 1 - e^(-a*dt)
      const k = 1 - Math.exp(-APPROACH * dt)

      if (!isNaN(tx)) {
        const lx = tree.getLocalX(id)
        const nx = lx + (tx - lx) * k
        tree.setLocalX(id, nx)

        // 목표에 충분히 가까우면 스냅
        const closeX = Math.abs(tx - nx) <= EPS
        if (closeX) tree.setLocalX(id, tx)
      }

      if (!isNaN(ty)) {
        const ly = tree.getLocalY(id)
        const ny = ly + (ty - ly) * k
        tree.setLocalY(id, ny)

        // 목표에 충분히 가까우면 스냅
        const closeY = Math.abs(ty - ny) <= EPS
        if (closeY) tree.setLocalY(id, ty)
      }
    }

    // 부모 월드 값
    const pCos = tree.getWorldCos(parent)
    const pSin = tree.getWorldSin(parent)
    const pX = tree.getWorldX(parent)
    const pY = tree.getWorldY(parent)

    // 위치(지역) -> 부모 스케일 적용 후 부모 회전
    const rx = tree.getLocalX(id) * tree.getWorldScaleX(parent)
    const ry = tree.getLocalY(id) * tree.getWorldScaleY(parent)

    // 스케일(월드)
    const scaleX = tree.getWorldScaleX(parent) * tree.getLocalScaleX(id)
    const scaleY = tree.getWorldScaleY(parent) * tree.getLocalScaleY(id)
    tree.setWorldScaleX(id, scaleX)
    tree.setWorldScaleY(id, scaleY)

    // 회전(월드) = 부모 + 로컬
    const lCos = tree.getLocalCos(id)
    const lSin = tree.getLocalSin(id)
    // 덧셈정리로 합성 회전의 cos/sin
    const wCos = pCos * lCos - pSin * lSin
    const wSin = pSin * lCos + pCos * lSin

    const rotation = tree.getWorldRotation(parent) + tree.getLocalRotation(id)
    tree.setWorldRotation(id, rotation)
    tree.setWorldCos(id, wCos)
    tree.setWorldSin(id, wSin)

    // 피벗: 월드 스케일로 스케일링 후 **월드 회전(wCos/wSin)** 으로 회전하여 빼기
    const pivotX = tree.getLocalPivotX(id) * scaleX
    const pivotY = tree.getLocalPivotY(id) * scaleY

    const worldX = pX + (rx * pCos - ry * pSin) - (pivotX * wCos - pivotY * wSin)
    const worldY = pY + (rx * pSin + ry * pCos) - (pivotX * wSin + pivotY * wCos)
    tree.setWorldX(id, worldX)
    tree.setWorldY(id, worldY)

    tree.setWorldAlpha(id, tree.getWorldAlpha(parent) * tree.getLocalAlpha(id))
  })
}
