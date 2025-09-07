const sab = new SharedArrayBuffer(1024)

new Worker('logic-worker.js').postMessage(sab)
new Worker('physics-worker.js').postMessage(sab)
new Worker('render-worker.js').postMessage(sab)
