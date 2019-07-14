const MAX_ITERATIONS = 1000

onmessage = function(event) {
  const { workers, canvasHeight, width, index, canvasWidth, y, x } = event.data

  // Create a Uint8Array to give us access to Wasm Memory
  const imageDataArray = draw(workers, index, canvasWidth, canvasHeight, x, y, width)

  postMessage({ index, buffer: imageDataArray }, [imageDataArray.buffer])
}

///
const draw = (workers, segment, canvasWidth, canvasHeight, x0, y0, width) => {
  const segmentHeight = canvasHeight / workers
  const offset = segment * segmentHeight
  const w = width / 2
  const dx = width / canvasWidth

  const arr = new Uint8Array(Math.floor(canvasWidth * segmentHeight * 4))

  //  const memoryPage = Math.ceil(canvasW * segmentHeight * 4 / 1024 / 64) as i32

  for (let i = 0; i < canvasWidth; i++) {
    for (let j = 0; j < segmentHeight; j++) {
      // complex number c
      const cx = x0 - w + i * dx
      const ci = y0 + w - (j + offset) * dx

      // return number of iterations
      let n = boundedness(cx, ci)

      // fill color
      let r = n % 255
      let g = n % 255
      let b = n % 255

      const pos = j * canvasWidth + i
      const RGBIndex = pos * 4
      arr[RGBIndex + 0] = r
      arr[RGBIndex + 1] = g
      arr[RGBIndex + 2] = b
      arr[RGBIndex + 3] = 255
    }
  }
  return arr;
}

function boundedness(cx, ci) {
  // 0 + 0i
  let x = 0
  let y = 0
  let i = 0

  for (; i < MAX_ITERATIONS; i++) {
    let xx = x
    // fc(z) = z^2 + c
    x = x * x - y * y + cx
    y = 2 * xx * y + ci

    // if |z| > 2, f(z) -> ∞, return # of iterations
    if (x * x + y * y > 4) {
      return i
    }
  }

  // number might be bounded
  return i
}
