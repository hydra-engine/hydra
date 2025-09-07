// 워커 (worker.js)
onmessage = (event) => {
  const buffer = event.data
  const sharedArray = new Int32Array(buffer)

  console.log("워커에서 받은 값:", sharedArray[0])

  // 값 갱신
  sharedArray[0] = 100
  Atomics.store(sharedArray, 1, 123)
  Atomics.notify(sharedArray, 1, 1)

  postMessage({ value: sharedArray[0] })
}
