let gbCtx;

gbSurface = {
	width: 128,
	height: 96,
	imageData: null
};

function gbInitSurface(w, h) {
	gbSurface.width = w;
	gbSurface.height = h;
	gbSurface.imageData = gbCtx.createImageData(w, h);
}

function gbSetPixel(x, y, color) {
	gbSurface.imageData.data[(((y * gbSurface.width) + x) * 4)] = gbXtermColors[color][0];
	gbSurface.imageData.data[(((y * gbSurface.width) + x) * 4) + 1] = gbXtermColors[color][1];
	gbSurface.imageData.data[(((y * gbSurface.width) + x) * 4) + 2] = gbXtermColors[color][2];
	gbSurface.imageData.data[(((y * gbSurface.width) + x) * 4) + 3] = 255;
}