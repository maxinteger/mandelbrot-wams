export class History {
  constructor() {
    this.pointer = -1
    this.list = []
  }

  get() {
    return this.list[this.pointer]
  }

  add(data) {
    this.pointer = this.list.length = Math.max(this.pointer + 1, 0)
    this.list[this.pointer] = data
    return this.get()
  }

  home() {
    this.pointer = 0
    return this.get()
  }

  back() {
    if (this.canGoBack()) {
      this.pointer--
    }
    return this.get()
  }

  forward() {
    if (this.canGoForward()) {
      this.pointer++
    }
    return this.get()
  }

  canGoBack() {
    return this.pointer > 0
  }

  canGoForward() {
    return this.pointer < this.list.length - 1
  }
}
