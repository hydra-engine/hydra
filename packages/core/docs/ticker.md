# createTicker

`requestAnimationFrame`을 사용해 프레임 루프(Ticker)를 생성하고 관리합니다.

## 사용법

```ts
import { createTicker } from './ticker'

// 기본 사용 (FPS 제한 없음)
const ticker = createTicker({
  onTick: (deltaTime) => {
    // deltaTime: 초 단위 (예: 0.016 ≈ 16ms)
    console.log('Tick!', deltaTime)
  },
})

// 5초 후 ticker 중단
setTimeout(() => ticker.destroy(), 5000)
```

## 반환값

`Ticker`

생성된 ticker를 제어할 수 있는 객체를 반환합니다.

## 매개변수

### fixedFps (선택)

* **타입:** `number | undefined`

FPS 제한(초당 프레임 수).
생략하면 제한 없이 동작합니다.

```ts
const ticker = createTicker({
  fixedFps: 30,
  onTick: (dt) => console.log('Tick @30fps', dt),
})
```

### onTick (필수)

* **타입:** `(deltaTime: number) => void`

매 프레임마다 호출되는 콜백 함수.
`deltaTime`은 직전 프레임으로부터 경과한 **시간(초 단위)** 입니다.

```ts
const ticker = createTicker({
  onTick: (deltaTime) => {
    // deltaTime: 초 단위 (예: 0.016 ≈ 16ms)
    console.log(`프레임이 ${deltaTime.toFixed(3)}초 지남`)
  },
})
```

## Ticker 메서드

### setFixedFps

* **타입:** `(fps: number | undefined) => void`

실행 중 FPS 제한을 동적으로 변경합니다.
`undefined`를 전달하면 FPS 제한이 해제됩니다.

```ts
ticker.setFixedFps(120)

// FPS 제한 해제
ticker.setFixedFps(undefined)
```

### destroy

* **타입:** `() => void`

Ticker 루프를 중단하고 예약된 `requestAnimationFrame`을 취소합니다.

```ts
ticker.destroy()
```

## 예제

FPS를 동적으로 변경하기:

```ts
import { createTicker } from './ticker'

const ticker = createTicker({
  fixedFps: 30,
  onTick: (dt) => console.log('Tick', dt),
})

// 3초 후 FPS를 60으로 변경
setTimeout(() => ticker.setFixedFps(60), 3000)

// 6초 후 FPS 제한 해제
setTimeout(() => ticker.setFixedFps(undefined), 6000)
```

## 내부 동작

* `requestAnimationFrame`을 기반으로 루프를 실행합니다.
* `fixedFps`가 설정된 경우:

  * 고정 시간 간격(`1 / fixedFps`)으로 onTick 실행.
  * 프레임 지연이 생기면 누적 시간(lag)을 보정하여 실행.
* `fixedFps`가 설정되지 않은 경우:

  * 실제 경과 시간(`deltaTime`)을 그대로 전달하는 가변 스텝 모드로 실행합니다.
