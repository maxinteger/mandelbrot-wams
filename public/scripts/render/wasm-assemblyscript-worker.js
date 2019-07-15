importScripts('/scripts/utils/wasm-loader.js')

async function init() {
  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate('/scripts/render/wasm-assemblyscript.wasm', {
    env: {
      abort: () => console.log('Abort!'),
    },
    console: {
      logi: a => console.log(a),
    }
  })

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

    const segmentHeight = Math.floor(canvasHeight / workers)
    const verticalOffset = index * segmentHeight
    // call wasm
    exports.draw(canvasWidth, segmentHeight, verticalOffset, x, y, width)

    // Pull out the RGBA values from Wasm memory, the we wrote to in wasm,
    // starting at the checkerboard pointer (memory array index)
    const imageDataArray = wasmByteMemoryArray.slice(
      exports.BUFFER_POINTER.valueOf(),
      (canvasWidth * canvasHeight * 4) / workers
    )

    postMessage({ index, buffer: imageDataArray }, [imageDataArray.buffer])
  })
}
