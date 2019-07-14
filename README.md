# Mandelbrot set with WASM

Experimental project to test WASM and WebWorkers

## Install

```bash
    npm install
```

For rust, make sure you installed [Rust lang](https://www.rust-lang.org/), then run:

```bash
    cargo install wasm-pack
``` 

## Run locally

```bash
    npm run server
```

then open [http://127.0.0.1:8080](http://127.0.0.1:8080)

## Build all render engines

```bash
    npm run build
```


# Render engines

## Native JS

The baseline implementation of the Mandelbrot set rendering

## Native WASM

WASM has human readable [text format](https://webassembly.org/docs/text-format/), the file extension is usually `wat`.
This format must be transformed into binary WASM
 
- [Official site](https://webassembly.org/)
- [Specification](https://webassembly.github.io/spec/core/index.html)
- [Old but informative reference](https://github.com/sunfishcode/wasm-reference-manual/blob/master/WebAssembly.md)
- [WAT ot WASM compiler](https://github.com/AssemblyScript/wabt.js)
- [Good step by step tutorial](https://blog.scottlogic.com/2018/04/26/webassembly-by-hand.html)

## AssemblyScript -> WASM

AssemblyScript is a TypeScript like language what we can compile to WASM

- [Project repo](https://github.com/AssemblyScript/docs/blob/master/README.md)
- [The AssemblyScript Book](https://docs.assemblyscript.org/) 

## Rust -> WASM

Rust is a modern system language (like C, C++). With **wasm-pack** we can compile rust code to WASM

- [wasm-pack site](https://rustwasm.github.io/wasm-pack/)

# Limitations / bugs

- The app works only in chromium based browsers right now
- some resolutions + number of workers combinations render distorted image

# More links

- [Rust lang site](https://www.rust-lang.org/)
- [WASM by examples](https://wasmbyexample.dev/)
- [Webassembly Studio](https://webassembly.studio)
