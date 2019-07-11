import { range } from './utils/utils.js'
import { PWorker } from './utils/PWorker.js'

export class App {
  constructor(canvasCtx, appConfig) {
    this.workers = range(appConfig.workers).map(() => new PWorker('./scripts/worker.js'))
    this.canvas = canvasCtx
    this.canvasImageData = canvasCtx.createImageData(appConfig.width, appConfig.height)
    canvasCtx.clearRect(0, 0, appConfig.width, appConfig.height)
    this.appConfig = appConfig
  }

  async render({ x, y, width }) {
    const workers = this.workers.length
    const { height: canvasHeight, width: canvasWidth } = this.appConfig

    const baseMessage = { workers, x, y, width, canvasWidth, canvasHeight }

    const label = `Render Mandelbrot set with ${workers} worker(s)`
    console.time(label)

    const res = await Promise.all(
      this.workers.map((worker, index) => worker.postMessage({ index, ...baseMessage }))
    )

    res.reduce((offset, data) => {
      this.canvasImageData.data.set(data.buffer, offset)
      return offset + data.buffer.length
    }, 0)

    this.canvas.putImageData(this.canvasImageData, 0, 0)

    console.timeEnd(label)
  }

  terminate() {
    this.workers.map(worker => worker.terminate())
  }
}
