// Set up our memory
// By growing our Wasm Memory by 1 page (64KB)
memory.grow(256) // maximum image resolution 2048 x 2048

declare namespace console {
  @external("console", "logi")
  export function logi(i: i32): void
}

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
  canvasWidth: i32,
  canvasHeight: i32,
  verticalOffset: i32,
  viewX: f64,
  viewY: f64,
  viewWidth: f64
): void {
  const w = viewWidth / 2
  const dx = viewWidth / canvasWidth

  // console.logi(42)

  for (let i: i32 = 0; i < canvasWidth; i++) {
    for (let j: i32 = 0; j < canvasHeight; j++) {
      // complex number c
      const cx = viewX - w + i * dx
      const ci = viewY + w - (j + verticalOffset) * dx

      // return number of iterations
      const n = boundedness(cx, ci)

      // fill color
      const r = n % 255
      const g = n % 255
      const b = n % 255
      storePixel(canvasWidth, i, j, r as i32, g as i32, b as i32)
    }
  }
}

function storePixel(canvasW: i32, x: i32, y: i32, r: i32, g: i32, b: i32): void {
  // And then multiple by 4, for each pixel property (r,g,b,a).
  const pos = (y * canvasW + x) * 4

  store<u8>(BUFFER_POINTER + pos + 0, r) // Red
  store<u8>(BUFFER_POINTER + pos + 1, g) // Green
  store<u8>(BUFFER_POINTER + pos + 2, b) // Blue
  store<u8>(BUFFER_POINTER + pos + 3, 255) // Alpha (Always opaque)
}

function boundedness(cx: f64, ci: f64): i32 {
  // 0 + 0i
  let ax: f64 = 0
  let ai: f64 = 0
  let i: i32 = 0

  for (; i < MAX_ITERATIONS; i++) {
    const axx = ax
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
