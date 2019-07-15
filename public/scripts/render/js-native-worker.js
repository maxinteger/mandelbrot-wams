const MAX_ITERATIONS = 1000

onmessage = function(event) {
  const { workers, canvasHeight, width, index, canvasWidth, y, x } = event.data

  // Create a Uint8Array to give us access to Wasm Memory
  const segmentHeight = Math.floor(canvasHeight / workers)
  const verticalOffset = index * segmentHeight

  const imageDataArray = draw(canvasWidth, segmentHeight, verticalOffset, x, y, width)

  postMessage({ index, buffer: imageDataArray }, [imageDataArray.buffer])
}

///

const draw = (canvasWidth, canvasHeight, verticalOffset, viewX, viewY, viewWidth) => {
  const w = viewWidth / 2
  const dx = viewWidth / canvasWidth
  const arr = new Uint8Array(Math.floor(canvasWidth * canvasHeight * 4))

  for (let i = 0; i < canvasWidth; i++) {
    for (let j = 0; j < canvasHeight; j++) {
      // complex number c
      const cx = viewX - w + i * dx
      const ci = viewY + w - (j + verticalOffset) * dx

      // return number of iterations
      const n = boundedness(cx, ci)

      // fill color
      const r = n % 255
      const g = n % 255
      const b = n % 255

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
  let ax = 0
  let ai = 0
  let i = 0

  for (; i < MAX_ITERATIONS; i++) {
    let axx = ax
    // fc(z) = z^2 + c
    ax = ax * ax - ai * ai + cx
    ai = 2 * axx * ai + ci

    // if |z| > 2, f(z) -> ∞, return # of iterations
    if (ax * ax + ai * ai > 4) {
      return i
    }
  }

  // number might be bounded
  return i
}
