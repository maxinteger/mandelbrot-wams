export class PWorker {
	constructor(url) {
		this.worker = new Worker(url)
		this.worker.onmessage = this.handler.bind(this)
	}

	handler(event) {
		this.resolve(event.data)
	}

	postMessage(params, transferable) {
		this.worker.postMessage(params, transferable)
		return new Promise((resolve) => {
			this.resolve = resolve
		})
	}

	terminate() {
		this.worker.terminate()
	}
}
