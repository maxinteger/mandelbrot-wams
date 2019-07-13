// Set up our memory
// By growing our Wasm Memory by 1 page (64KB)
memory.grow(256)

// Define the size of our checkerboard
const MAX_ITERATIONS = 1000

// Create a buffer/pointer (array index and size) to where
// in memory we are storing the pixels.
// NOTE: Be sure to set a correct --memoryBase when
// when writing to memory directly like we are here.
// https://docs.assemblyscript.org/details/compiler
export const BUFFER_POINTER: i32 = 0

// Function to generate our checkerboard, pixel by pixel
export function draw(
  workers: i32,
  segment: i32,
  canvasW: i32,
  canvasH: i32,
  x0: f64,
  y0: f64,
  width: f64
): void {
  const segmentHeight = (canvasH / workers) as i32
  const offset = segment * segmentHeight
  const w = width / 2
  const dx = width / canvasW


//  const memoryPage = Math.ceil(canvasW * segmentHeight * 4 / 1024 / 64) as i32


  for (let i: i32 = 0; i < canvasW; i++) {
    for (let j: i32 = 0; j < segmentHeight; j++) {
      // complex number c
      const cx = x0 - w + i * dx
      const ci = y0 + w - (j + offset) * dx

      // return number of iterations
      let n = boundedness(cx, ci)

      // fill color
      let r = (n % 255)
      let g = (n % 255)
      let b = (n % 255)
      storePixel(canvasW, i, j, r as i32, g as i32, b as i32)
    }
  }
}

function storePixel(canvasW: i32, x: i32, y: i32, r: i32, g: i32, b: i32): void {
  // Let's calculate our index, using our 2d -> 1d mapping.
  // And then multiple by 4, for each pixel property (r,g,b,a).
  let squareNumber = y * canvasW + x
  let RGBIndex = squareNumber * 4

  // Finally store the values.
  store<u8>(BUFFER_POINTER + RGBIndex + 0, r) // Red
  store<u8>(BUFFER_POINTER + RGBIndex + 1, g) // Green
  store<u8>(BUFFER_POINTER + RGBIndex + 2, b) // Blue
  store<u8>(BUFFER_POINTER + RGBIndex + 3, 255) // Alpha (Always opaque)
}

function boundedness(cx: f64, ci: f64): i32 {
  // 0 + 0i
  let x: f64 = 0
  let y: f64 = 0
  let i: i32 = 0

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
