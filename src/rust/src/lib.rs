extern crate wasm_bindgen;
// Add the wasm-pack crate
use wasm_bindgen::prelude::*;

const MAX_RES: usize = 2048;
const MAX_ITERATIONS: i32 = 1000;
const OUTPUT_BUFFER_SIZE: usize = MAX_RES * MAX_RES * 4;

#[wasm_bindgen]
extern {
    pub fn log(f: f64);
}

// Our Add function
// wasm-pack requires "exported" functions
// return a pointer to our buffer
// to include #[wasm_bindgen]
#[wasm_bindgen]
pub fn draw(workers: i32, segment: i32, canvas_w: i32, canvas_h: i32, x0: f64, y0: f64, width: f64) -> *const u8{
    let mut memory: Vec<u8> = vec![0; OUTPUT_BUFFER_SIZE];
    let segment_height: i32 = canvas_h / workers;
    let offset: i32 = segment * segment_height;
    let w: f64 = width / 2.0;
    let dx: f64 = width / canvas_w as f64;

    for i in 0..canvas_w {
        for j in 0..segment_height {
            let cx: f64 = x0 - w + (i as f64) * dx;
            let ci: f64 = y0 + w - (j + offset) as f64 * dx;

            let n = boundedness(cx, ci);

            let r = (n % 255) as u8;
            let g = (n % 255) as u8;
            let b = (n % 255) as u8;

            store_pixel(&mut memory, canvas_w, i, j, r, g, b);
        }
    }

    return memory.as_ptr()
}

fn boundedness(cx: f64, ci: f64) -> i32 {
    // 0 + 0i
    let mut x: f64 = 0.0;
    let mut y: f64 = 0.0;
    let mut i: i32 = 0;

    while i < MAX_ITERATIONS {
        let xx = x;
        // fc(z) = z^2 + c
        x = x * x - y * y + cx;
        y = 2.0 * xx * y + ci;

        // if |z| > 2, f(z) -> ∞, return # of iterations
        if x * x + y * y > 4.0 {
            return i;
        }
        i += 1;
    }

    // number might be bounded
    return i;
}

fn store_pixel(memory: &mut Vec<u8>, canvas_w: i32, x: i32, y: i32, r: u8, g: u8, b: u8) -> () {
    // Let's calculate our index, using our 2d -> 1d mapping.
    // And then multiple by 4, for each pixel property (r,g,b,a).
    let pos: usize = ((y * canvas_w + x) * 4) as usize;

    // Finally store the values.
    memory[pos + 0] = r; // Red
    memory[pos + 1] = g; // Green
    memory[pos + 2] = b; // Blue
    memory[pos + 3] = 255; // Alpha (Always Opaque)
}

