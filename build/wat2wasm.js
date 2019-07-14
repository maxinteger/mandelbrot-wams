const { readFileSync, writeFileSync } = require("fs");
const wabt = require("wabt")();
const path = require("path");

const inputWat = path.join(__dirname, '../src/wasm/mandelbrot.wat');
const outputWasm = path.join(__dirname, '../public/scripts/render/wasm-native.wasm');

const wasmModule = wabt.parseWat(inputWat, readFileSync(inputWat, "utf8"));
const { buffer } = wasmModule.toBinary({});

writeFileSync(outputWasm, Buffer.from(buffer));

