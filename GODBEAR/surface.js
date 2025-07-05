gbSurface = {
	width: 128,
	height: 96,
	pixels: new Uint8Array(1)
};

function gbInitSurface(w, h) {
	gbSurface.width = w;
	gbSurface.height = h;
	gbSurface.pixels = new Uint8Array(gbSurface.width * gbSurface.height);
}

function gbSetPixel(x, y, color) {
	gbSurface[(y * gbSurface.width) + x] = color;
}

function gbGetPixel(x, y) {
	return gbSurface[(y * gbSurface.width) + x];
}