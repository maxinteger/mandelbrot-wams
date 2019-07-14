importScripts('/scripts/utils/wasm-loader.js')

async function init() {
  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate('/scripts/render/wasm-rust.wasm', {
    log: a => console.log(a)
  })

  // Get our exports object, with all of our exported Wasm Properties
  return wasmModule.instance.exports
}

const promise = init()

onmessage = function(event) {
  const { workers, canvasHeight, width, index, canvasWidth, y, x } = event.data
  promise.then(exports => {
    // Get our memory object from the exports

    // Create a Uint8Array to give us access to Wasm Memory

    // call wasm
    const bufferPtr = exports.draw(workers, index, canvasWidth, canvasHeight, x, y, width)

    const memory = exports.memory
    const wasmByteMemoryArray = new Uint8Array(memory.buffer)

    // Pull out the RGBA values from Wasm memory, the we wrote to in wasm,
    // starting at the checkerboard pointer (memory array index)
    const imageDataArray = wasmByteMemoryArray.slice(
      bufferPtr,
      bufferPtr + (canvasWidth * canvasHeight * 4) / workers
    )

    postMessage({ index, buffer: imageDataArray }, [imageDataArray.buffer])
  })
}
