import { $ } from './utils/utils.js'
import { CPU_CORS } from './utils/constants.js'
import { App } from './App.js'
import { History } from './History.js'

///
let app

let appConfig = {
  workers: 1,
  resX: 1000,
  resY: 1000
}

const viewHistory = new History()

///

export const initApp = (canvas, workers) => {
  appConfig = Object.assign({}, appConfig, { width: canvas.width, height: canvas.height, workers })

  const context = canvas.getContext('2d', {
    alpha: false
    // desynchronized: true,
    // preserveDrawingBuffer: true
  })

  if (app) {
    app.terminate()
  }

  app = new App(context, appConfig)
  app.render(viewHistory.get())
}

///

const canvas = $('#id-canvas')
const workerSlider = $('#id-workers')
const workersCurrentLabel = $('#id-workers-current')
const workersMaxLabel = $('#id-workers-max')
const resolutionSelector = $('#id-resolution')
const resetBtn = $('#id-reset')
const backBtn = $('#id-back')
const forwardBtn = $('#id-forward')

workerSlider.setAttribute('max', CPU_CORS.toString())
workersMaxLabel.textContent = CPU_CORS

workerSlider.addEventListener('change', event => {
  const workers = parseFloat(event.currentTarget.value)
  workersCurrentLabel.textContent = workers
  initApp(canvas, workers)
})

resolutionSelector.addEventListener('change', (event) => {
  const value = event.currentTarget.value
  if (value !== 'fill') {
    const [w, h] = value.split('x')
    canvas.width = parseInt(w)
    canvas.height = parseInt(h)
  } else {
    canvas.width = window.innerWidth - window.innerWidth % 2
    canvas.height = window.innerHeight - window.innerHeight % 2
  }

  initApp(canvas, appConfig.workers)
})

canvas.addEventListener('click', event => {
  const viewConfig = Object.assign({}, viewHistory.get())
  let i = event.pageX - canvas.offsetLeft
  let j = event.pageY - canvas.offsetTop
  let dx = viewConfig.width / canvas.width
  let w = viewConfig.width / 2

  viewConfig.x = viewConfig.x - w + i * dx
  viewConfig.y = viewConfig.y + w - j * dx

  viewConfig.width /= viewConfig.zoom

  updateHistory(viewHistory.add(viewConfig))
})

resetBtn.addEventListener('click', () => updateHistory(viewHistory.home()))
backBtn.addEventListener('click', () => updateHistory(viewHistory.back()))
forwardBtn.addEventListener('click', () => updateHistory(viewHistory.forward()))

const updateHistory = data => {
  if (app) {
    app.render(data)
  }

  backBtn.toggleAttribute('disabled', !viewHistory.canGoBack())
  forwardBtn.toggleAttribute('disabled', !viewHistory.canGoForward())
}

///

updateHistory(viewHistory.add({ x: -0.5, y: 0, width: 4, zoom: 4 }))
initApp(canvas, 1)
