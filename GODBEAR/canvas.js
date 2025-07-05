let gbCanvas;
let gbCtx;
let gbCanvasWidth = 300;
let gbCanvasHeight = 150;
const gbCanvasObserver = new ResizeObserver((entries) => {
	gbCanvasWidth = gbCanvas.clientWidth;
	gbCanvasHeight = gbCanvas.clientHeight;
})

function gbCanvasStep(timestamp) {

}

function gbCanvasRender() {
	gbCanvas.width = gbCanvasWidth;
	gbCanvas.height = gbCanvasHeight;
	gbCtx.save();

	let pixWidth = parseFloat(gbCanvasWidth) / parseFloat(gbSurface.width);
	let pixHeight = parseFloat(gbCanvasHeight) / parseFloat(gbSurface.height);
	let pixDim;
	let xoff = 0.0, yoff = 0.0;
	if (pixWidth > pixHeight) {
		pixDim = pixHeight;
		xoff = (gbCanvasWidth - (pixDim * gbSurface.width)) / 2.0;
	} else {
		pixDim = pixWidth;
		yoff = (gbCanvasHeight - (pixDim * gbSurface.height)) / 2.0;
	}

	let x, y;
	for (x = 0; x < gbSurface.width; x++) {
		for (y = 0; y < gbSurface.height; y++) {
			let fx = xoff + (parseFloat(x) * pixDim);
			let fy = yoff + (parseFloat(y) * pixDim);
			gbCtx.fillStyle = gbXtermColors[gbGetPixel(x, y)];
			gbCtx.fillRect(Math.floor(fx), Math.floor(fy), Math.ceil(pixDim), Math.ceil(pixDim));
		}
	}

	gbCtx.restore();
	requestAnimationFrame(gbCanvasStep);
}

function gbCanvasHook(canvas) {
	gbCanvas = canvas;
	gbCtx = canvas.getContext("2d");
	gbCanvasObserver.observe(gbCanvas);
}