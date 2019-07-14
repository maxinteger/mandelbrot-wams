export const $ = (s) => document.querySelector(s)

export const range = (length) => Array.from({length}, (_, idx) => idx)

export const downloadCanvasAsPng = (canvas, filename) => {
	const lnk = document.createElement('a')

	lnk.download = filename
	lnk.href = canvas.toDataURL('image/png;base64')

	lnk.click()
}
