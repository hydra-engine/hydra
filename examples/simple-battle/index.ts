// 메인 스레드 (main.js)
const worker = new Worker("logic-worker.js")

// 1KB 크기의 공유 버퍼 생성
const sab = new SharedArrayBuffer(1024)
const sharedArray = new Int32Array(sab)

// 초기값 설정
sharedArray[0] = 42

// 워커로 전달
worker.postMessage(sab)

worker.onmessage = (event) => {
  console.log("메인 스레드에서 받은 값:", event.data)
}
