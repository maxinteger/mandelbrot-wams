extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

const MAX_RES: usize = 2048;
const MAX_ITERATIONS: i32 = 1000;
const OUTPUT_BUFFER_SIZE: usize = MAX_RES * MAX_RES * 4;

#[wasm_bindgen]
extern {
    pub fn log(i: i32);
}

// Our Add function
// wasm-pack requires "exported" functions
// return a pointer to our buffer
// to include #[wasm_bindgen]
#[wasm_bindgen]
pub fn draw(canvas_width: i32, canvas_height: i32, vertical_offset: i32, view_x: f64, view_y: f64, view_width: f64) -> *const u8 {
    let mut memory: Vec<u8> = vec![0; OUTPUT_BUFFER_SIZE];
    let w = view_width / 2.0;
    let dx = view_width / canvas_width as f64;

    // log(42);

    for i in 0..canvas_width {
        for j in 0..canvas_height {
            let cx = view_x - w + (i as f64) * dx;
            let ci = view_y + w - (j + vertical_offset) as f64 * dx;

            let n = boundedness(cx, ci);

            let r = (n % 255) as u8;
            let g = (n % 255) as u8;
            let b = (n % 255) as u8;

            store_pixel(&mut memory, canvas_width, i, j, r, g, b);
        }
    }

    return memory.as_ptr();
}

fn boundedness(cx: f64, ci: f64) -> i32 {
    // 0 + 0i
    let mut ax = 0.0_f64;
    let mut ai = 0.0_f64;
    let mut i = 0;

    while i < MAX_ITERATIONS {
        let axx = ax;
        // fc(z) = z^2 + c
        ax = ax * ax - ai * ai + cx;
        ai = 2.0 * axx * ai + ci;

        // if |z| > 2, f(z) -> ∞, return # of iterations
        if ax * ax + ai * ai > 4.0 {
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

