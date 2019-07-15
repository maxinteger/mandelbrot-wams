(module
  (import "env" "log" (func $logi32 (param i32)))
  (import "env" "log" (func $logf64 (param f64)))

  (memory $mem 256)

  (func $increment (param $value i32) (result i32)
    (i32.add
      (get_local $value)
      (i32.const 1)
    )
  )

  (func $storePixel
    (param $canvasWidth i32)
    (param $x i32)
    (param $y i32)
    (param $r i32)
    (param $g i32)
    (param $b i32)

    (local $pos i32)
    (set_local $pos
      (i32.mul
        (i32.add
          (get_local $x)
          (i32.mul
            (get_local $y)
            (get_local $canvasWidth)
          )
        )
        (i32.const 4)
      )
    )

    (i32.store (get_local $pos) (get_local $r))
    (i32.store (i32.add (get_local $pos) (i32.const 1)) (get_local $g))
    (i32.store (i32.add (get_local $pos) (i32.const 2)) (get_local $b))
    (i32.store (i32.add (get_local $pos) (i32.const 3)) (i32.const 255))
  )

  (func $boundedness
    (param $cx f64)
    (param $ci f64)
    (result i32)

    (local $ax f64)
    (local $axx f64)
    (local $ai f64)
    (local $check f64)
    (local $i i32)
    (local $MAX_ITER i32)

    (set_local $ax (f64.const 0))
    (set_local $ai (f64.const 0))
    (set_local $i (i32.const 0))
    (set_local $MAX_ITER (i32.const 1000))

    (block
      (loop
        (set_local $axx (get_local $ax))
        (set_local $ax
          (f64.add
            (f64.sub
              (f64.mul
                (get_local $ax)
                (get_local $ax)
              )
              (f64.mul
                (get_local $ai)
                (get_local $ai)
              )
            )
            (get_local $cx)
          )
        )

        (set_local $ai
          (f64.add
            (f64.mul
              (f64.mul
                (f64.const 2)
                (get_local $axx)
              )
              (get_local $ai)
            )
            (get_local $ci)
          )
        )

        (set_local $check
          (f64.add
            (f64.mul
              (get_local $ax)
              (get_local $ax)
            )
            (f64.mul
              (get_local $ai)
              (get_local $ai)
            )
          )
        )

        (set_local $i (call $increment (get_local $i)))
        (br_if 1 (i32.eq (get_local $i) (get_local $MAX_ITER)))
        (br_if 1 (f64.gt (get_local $check) (f64.const 4)))
        (br 0)
      )
    )

    (get_local $i)
  )


  (func $calcPixel
    (param $viewX f64)
    (param $viewY f64)
    (param $i i32)
    (param $j i32)
    (param $w f64)
    (param $dx f64)
    (param $offset i32)
    (param $canvasWidth i32)

    (local $cx f64)
    (local $ci f64)
    (local $n i32)

    ;; cx = x0 - w + i * dx
    (set_local $cx
      (f64.add
        (f64.sub
          (get_local $viewX)
          (get_local $w)
        )
        (f64.mul
          (f64.convert_u/i32 (get_local $i))
          (get_local $dx)
        )
      )
    )

    ;; ci = y0 + w - (j + offset) * dx
    (set_local $ci
      (f64.sub
        (f64.add
          (get_local $viewY)
          (get_local $w)
        )
        (f64.mul
          (f64.convert_u/i32
            (i32.add
              (get_local $j)
              (get_local $offset)
            )
          )
          (get_local $dx)
        )
      )
    )

    (set_local $n
      (call $boundedness
        (get_local $cx)
        (get_local $ci)
      )
    )

    (call $storePixel
      (get_local $canvasWidth)
      (get_local $i)
      (get_local $j)
      (i32.rem_u (get_local $n) (i32.const 255))
      (i32.rem_u (get_local $n) (i32.const 255))
      (i32.rem_u (get_local $n) (i32.const 255))
    )
  )


  (func $draw
    (param $canvasWidth i32)
    (param $canvasHeight i32)
    (param $verticalOffset i32)
    (param $viewX f64)
    (param $viewY f64)
    (param $viewWidth f64)

    (local $i i32)
    (local $j i32)
    (local $w f64)
    (local $dx f64)

    ;; (call $logi32 (i32.const 42))

    (set_local $w
      (f64.div
        (get_local $viewWidth)
        (f64.const 2)
      )
    )

    (set_local $dx
      (f64.div
        (get_local $viewWidth)
        (f64.convert_u/i32 (get_local $canvasWidth))
      )
    )

    (set_local $i (i32.const 0))

    (block
      (loop

        (set_local $j (i32.const 0))

        (block
          (loop

           (call $calcPixel
              (get_local $viewX)
              (get_local $viewY)
              (get_local $i)
              (get_local $j)
              (get_local $w)
              (get_local $dx)
              (get_local $verticalOffset)
              (get_local $canvasWidth)
            )

            (set_local $j (call $increment (get_local $j)))
            (br_if 1 (i32.eq (get_local $j) (get_local $canvasHeight)))
            (br 0)
          )
        )

        (set_local $i (call $increment (get_local $i)))
        (br_if 1 (i32.eq (get_local $i) (get_local $canvasWidth)))
        (br 0)
      )
    )
  )

  (export "draw" (func $draw))
  (export "memory" (memory $mem))
)
