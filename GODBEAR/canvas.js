let gbCanvas;
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
	let pixDim = (pixWidth < pixHeight) ?(pixWidth) :(pixHeight);
	gbCtx.putImageData(gbSurface.imageData, 0, 0, 0, 0, gbSurface.width, gbSurface.height);

	// This code is BEAUTIFUL, I LOVE IT!
	gbCtx.imageSmoothingEnabled = false;
	gbCtx.scale(pixDim, pixDim);
	if (pixWidth < pixHeight) {
		let yoff = ((gbCanvasHeight - (pixDim * gbSurface.height)) / 2.0) / pixDim;
		gbCtx.drawImage(gbCtx.canvas, 0, yoff);
		gbCtx.fillStyle = 'black';
		gbCtx.fillRect(0, 0, Math.ceil(gbCanvasWidth / pixDim), Math.ceil(yoff));
		gbCtx.fillRect(0, Math.floor((gbCanvasHeight / pixDim) - yoff), Math.ceil(gbCanvasWidth / pixDim), Math.ceil(yoff + 1.0));
	} else {
		let xoff = ((gbCanvasWidth - (pixDim * gbSurface.width)) / 2.0) / pixDim;
		gbCtx.drawImage(gbCtx.canvas, xoff, 0);
		gbCtx.fillStyle = 'black';
		gbCtx.fillRect(0, 0, Math.ceil(xoff), Math.ceil(gbCanvasHeight / pixDim));
		gbCtx.fillRect(Math.floor((gbCanvasWidth / pixDim) - xoff), 0, Math.ceil(xoff + 1.0), Math.ceil(gbCanvasHeight / pixDim));
	}

	gbCtx.restore();
	requestAnimationFrame(gbCanvasStep);
}

function gbCanvasHook(canvas) {
	gbCanvas = canvas;
	gbCtx = canvas.getContext("2d");
	gbCanvasObserver.observe(gbCanvas);
}