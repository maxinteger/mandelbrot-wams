async function init() {
  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate('/scripts/mandelbrot.wasm')

  // Get our exports object, with all of our exported Wasm Properties
  return wasmModule.instance.exports
}

const promise = init()

onmessage = function(event) {
  const { workers, canvasHeight, width, index, canvasWidth, y, x } = event.data
  promise.then(exports => {
    // Get our memory object from the exports
    const memory = exports.memory

    // Create a Uint8Array to give us access to Wasm Memory
    const wasmByteMemoryArray = new Uint8Array(memory.buffer)

    // call wasm
    exports.draw(workers, index, canvasWidth, canvasHeight, x, y, width)

    // Pull out the RGBA values from Wasm memory, the we wrote to in wasm,
    // starting at the checkerboard pointer (memory array index)
    const imageDataArray = wasmByteMemoryArray.slice(
      exports.BUFFER_POINTER.valueOf(),
      canvasWidth * canvasHeight * 4 / workers
    )

    postMessage({ index, buffer: imageDataArray }, [imageDataArray.buffer])
  })
}

///

async function wasmBrowserInstantiate(wasmModuleUrl, importObject) {
  let response = undefined

  if (!importObject) {
    importObject = {
      env: {
        abort: () => console.log('Abort!')
      }
    }
  }

  // Check if the browser supports streaming instantiation
  if (WebAssembly.instantiateStreaming) {
    // Fetch the module, and instantiate it as it is downloading
    response = await WebAssembly.instantiateStreaming(fetch(wasmModuleUrl), importObject)
  } else {
    // Fallback to using fetch to download the entire module
    // And then instantiate the module
    const fetchAndInstantiateTask = async () => {
      const wasmArrayBuffer = await fetch(wasmModuleUrl).then(response => response.arrayBuffer())
      return WebAssembly.instantiate(wasmArrayBuffer, importObject)
    }
    response = await fetchAndInstantiateTask()
  }

  return response
}
