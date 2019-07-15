# Mandelbrot set with WASM

Experimental project to test WASM and WebWorkers
[https://mandelbrot-wasm.web.app/](https://mandelbrot-wasm.web.app/)

## Install

```bash
    npm install
```

For rust, make sure you installed [Rust lang](https://www.rust-lang.org/), then run:

```bash
    cargo install wasm-pack
    cargo install wasm-snip
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
- [Rust and WebAssembly book](https://rustwasm.github.io/docs/book/)
- [wasm-snip - wasm optimiser](https://github.com/rustwasm/wasm-snip)

# Limitations / bugs

- The app works only in chromium based browsers right now

# Other

## More link

- [Rust lang site](https://www.rust-lang.org/)
- [WASM by examples](https://wasmbyexample.dev/)
- [Webassembly Studio](https://webassembly.studio)

## Takeaways:

- WASM average execution time is a little slower then native JS (with the current implementation of WASM + Mandelbrot is very specific problem the engine can optimise JS very well)
- Naive hand written WASM can not beat the compiled and optimized code
- WASM *not* start new thread, you have to run it in webWorker for that.
 
