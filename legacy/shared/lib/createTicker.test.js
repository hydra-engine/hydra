/* @vitest-environment jsdom */
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { createTicker } from './createTicker';
/**
 * Test Suite — createTicker (rewritten)
 * -------------------------------------
 * 목표
 *  - 경계값(1/fps)에서의 부동소수 오차로 인한 취약 어서션 제거
 *  - uncapped / capped / long frame / setFixedFps / destroy 전 시나리오 재정의
 *  - 현재 구현에 맞춤: setFixedFps(fps <= 0) => uncapped
 *
 * 테스트 원칙
 *  - "정확히 경계"에 맞추지 않음(예: 90ms 대신 91ms 등)
 *  - deltaTime 검증은 expect.closeTo + 느슨한 카운트 검증 혼합
 */
/** ----------------------- Time & RAF harness ----------------------- **/
/** Simulated monotonic clock (ms) */
let nowMs = 0;
/** RAF callback registry: id -> cb */
const rafCallbacks = new Map();
let nextRafId = 1;
const installTimeAndRafMocks = () => {
    vi.spyOn(performance, 'now').mockImplementation(() => nowMs);
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        const id = nextRafId++;
        rafCallbacks.set(id, cb);
        return id;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
        rafCallbacks.delete(id);
    });
};
const resetHarness = () => {
    nowMs = 0;
    rafCallbacks.clear();
    nextRafId = 1;
};
/**
 * 한 프레임만 진행: 시계를 advanceMs 만큼 전진시키고,
 * 현재 등록된 RAF 콜백들만 실행(콜백 내에서 새로 등록된 것은 다음 step에서 실행)
 */
const step = (advanceMs) => {
    nowMs += advanceMs;
    const cbs = [...rafCallbacks.values()];
    rafCallbacks.clear();
    for (const cb of cbs)
        cb(nowMs);
};
/** 여러 프레임 전진 (helper) */
const advance = (totalMs, stepMs = 16) => {
    const n = Math.floor(totalMs / stepMs);
    for (let i = 0; i < n; i++)
        step(stepMs);
    const remain = totalMs - n * stepMs;
    if (remain > 0)
        step(remain);
};
/** ----------------------- Lifecycle -------------------------- **/
beforeEach(() => {
    resetHarness();
    vi.restoreAllMocks();
    installTimeAndRafMocks();
});
afterEach(() => {
    vi.restoreAllMocks();
    resetHarness();
});
/** ----------------------- Tests ------------------------------ **/
describe('uncapped mode', () => {
    it('calls onTick once per frame with raw deltaTime (seconds)', () => {
        const spy = vi.fn();
        const ticker = createTicker({ onTick: spy }); // fps omitted -> uncapped
        step(10); // 0.010
        step(20); // 0.020
        step(30); // 0.030
        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).toHaveBeenNthCalledWith(1, expect.closeTo(0.010, 1e-6));
        expect(spy).toHaveBeenNthCalledWith(2, expect.closeTo(0.020, 1e-6));
        expect(spy).toHaveBeenNthCalledWith(3, expect.closeTo(0.030, 1e-6));
        ticker.destroy();
    });
    it('does not call onTick when deltaTime <= 0', () => {
        const spy = vi.fn();
        const ticker = createTicker({ onTick: spy });
        step(0);
        expect(spy).not.toHaveBeenCalled();
        step(5);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenLastCalledWith(expect.closeTo(0.005, 1e-6));
        ticker.destroy();
    });
});
describe('capped mode (fps > 0)', () => {
    it('accumulates lag and calls at fixed-step boundaries (avoid exact boundary)', () => {
        // fps=10 -> fixedStep=0.1s
        const spy = vi.fn();
        const ticker = createTicker({ fixedFps: 10, onTick: spy });
        // 40 + 40 = 0.08 -> no call yet
        step(40);
        step(40);
        expect(spy).toHaveBeenCalledTimes(0);
        // +31ms -> 0.11 -> crosses boundary -> one call fixedStep
        step(31);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenLastCalledWith(expect.closeTo(0.1, 1e-6));
        // lag ≈ 0.11 - 0.1 = 0.01
        // +91ms -> 0.01 + 0.091 = 0.101 -> crosses again
        step(91);
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenLastCalledWith(expect.closeTo(0.1, 1e-6));
        ticker.destroy();
    });
    it('long frame (delta >= 2*fixedStep) triggers two calls: fixedStep, then raw delta; then lag resets', () => {
        // fps=5 -> fixedStep=0.2s, 2*fixedStep=0.4s
        const spy = vi.fn();
        const ticker = createTicker({ fixedFps: 5, onTick: spy });
        step(500); // 0.5s (>= 0.4)
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenNthCalledWith(1, expect.closeTo(0.2, 1e-6));
        expect(spy).toHaveBeenNthCalledWith(2, expect.closeTo(0.5, 1e-6));
        // 다시 한 번 동일 패턴
        step(500);
        expect(spy).toHaveBeenCalledTimes(4);
        expect(spy).toHaveBeenNthCalledWith(3, expect.closeTo(0.2, 1e-6));
        expect(spy).toHaveBeenNthCalledWith(4, expect.closeTo(0.5, 1e-6));
        ticker.destroy();
    });
});
describe('setFixedFps runtime transitions', () => {
    it('uncapped -> capped (fps>0) enforces fixed-step boundaries', () => {
        const spy = vi.fn();
        const ticker = createTicker({ onTick: spy }); // uncapped
        step(16);
        step(20);
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenNthCalledWith(1, expect.closeTo(0.016, 1e-6));
        expect(spy).toHaveBeenNthCalledWith(2, expect.closeTo(0.020, 1e-6));
        // switch to 10fps
        ticker.setFixedFps(10);
        // 40 + 40 = 0.08 -> no call yet
        step(40);
        step(40);
        expect(spy).toHaveBeenCalledTimes(2);
        // +31ms -> boundary cross -> fixedStep call
        step(31);
        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).toHaveBeenLastCalledWith(expect.closeTo(0.1, 1e-6));
        ticker.destroy();
    });
    it('capped -> uncapped by setFixedFps(0 or <=0) returns to raw delta behavior', () => {
        const spy = vi.fn();
        const ticker = createTicker({ fixedFps: 10, onTick: spy }); // capped initially
        // make at least one fixed-step call to prove capped first
        step(101);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenLastCalledWith(expect.closeTo(0.1, 1e-6));
        // switch to uncapped
        ticker.setFixedFps(0); // <= 0 => uncapped per current implementation
        spy.mockClear();
        step(16);
        step(33);
        expect(spy).toHaveBeenCalledTimes(2);
        // raw deltas now
        expect(spy).toHaveBeenNthCalledWith(1, expect.closeTo(0.016, 1e-6));
        expect(spy).toHaveBeenNthCalledWith(2, expect.closeTo(0.033, 1e-6));
        ticker.destroy();
    });
});
describe('destroy', () => {
    it('cancels next RAF and stops future ticks', () => {
        const spy = vi.fn();
        const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');
        const ticker = createTicker({ onTick: spy });
        step(16);
        expect(spy).toHaveBeenCalledTimes(1);
        ticker.destroy();
        expect(cancelSpy).toHaveBeenCalled();
        spy.mockClear();
        advance(200, 16);
        expect(spy).not.toHaveBeenCalled();
    });
});
describe('long-running sanity (ragged frames, fps=10)', () => {
    it('produces a reasonable number of calls; includes fixedStep calls', () => {
        const spy = vi.fn();
        const ticker = createTicker({ fixedFps: 10, onTick: spy }); // fixedStep = 0.1
        // 총 1000ms. 몇몇 프레임은 "긴 프레임"으로 extra-call 분기 유발
        const frames = [33, 33, 35, 101, 51, 61, 41, 201, 201, 251]; // 경계 회피용 약간의 +1ms
        for (const ms of frames)
            step(ms);
        const calls = spy.mock.calls.length;
        // 긴 프레임의 lag 리셋과 라운딩에 따라 정확한 10보다는 다소 흔들릴 수 있음.
        // 합리적인 범위 내에서 검증(최소 9, 최대 13)
        expect(calls).toBeGreaterThanOrEqual(9);
        expect(calls).toBeLessThanOrEqual(13);
        // 적어도 일부 호출은 정확히 0.1의 고정 스텝일 것
        const hasFixedStep = spy.mock.calls.some(([dt]) => Math.abs(dt - 0.1) < 1e-6);
        expect(hasFixedStep).toBe(true);
        ticker.destroy();
    });
});
//# sourceMappingURL=createTicker.test.js.map