function pointWorldCoords(world, point) {
	let np0 = {
		x: point.x - world.player.pos.x,
		y: point.y - world.player.pos.y,
		z: point.z - world.player.pos.z
	};
	let np1 = {
		x: (np0.x * Math.cos(world.player.rot)) - (np0.y * Math.sin(world.player.rot)),
		y: (np0.y * Math.cos(world.player.rot)) + (np0.x * Math.sin(world.player.rot)),
		z: np0.z
	};
	//np1.z += ((np1.y) / 32.0);
	return np1;
}

function clipWorldLine(p0, p1) {
	// I have no clue how this code works and have copied it from 3DSage
	// It's on It's risk. still On,
	let da = p0.y, db = p1.y;
	let d = da - db;
	if (d == 0.0) {
		d = 1.0;
	}
	let s = da / d;
	let newPoint = {
		x: p0.x + (s * (p1.x - p0.x)),
		y: p0.y + (s * (p1.y - p0.y)),
		z: p0.z + (s * (p1.z - p0.z))
	};
	if (Math.abs(newPoint.y) <= 0.00001) {
		newPoint.y = 1.0;
	}
	return newPoint;
}

function worldToScreenMap(np1) {
	let np2 = {
		x: ((200.0 * np1.x) / np1.y) + (parseFloat(gbSurface.width) / 2.0),
		y: ((200.0 * np1.z) / np1.y) + (parseFloat(gbSurface.height) / 2.0)
	};
	return np2;
}

function gbRenderWall(world, wall) {
	let p0b, p1b, p0t, p1t;
	{
		// Map to world coordinates
		let p0bWorld = pointWorldCoords(world, { x: wall.pos0.x, y: wall.pos0.y, z: wall.pos0.z - wall.height });
		let p1bWorld = pointWorldCoords(world, { x: wall.pos1.x, y: wall.pos1.y, z: wall.pos1.z - wall.height });
		let p0tWorld = pointWorldCoords(world, wall.pos0);
		let p1tWorld = pointWorldCoords(world, wall.pos1);

		// Ignore this wall if it's fully behind player
		if (p0bWorld.y < 1.0 && p1bWorld.y < 1.0) {
			return;
		}
		// Clip lines
		if (p0bWorld.y < 1.0) {
			p0bWorld = clipWorldLine(p0bWorld, p1bWorld);
			p0tWorld = clipWorldLine(p0tWorld, p1tWorld);
		}
		if (p1bWorld.y < 1.0) {
			p1bWorld = clipWorldLine(p1bWorld, p0bWorld);
			p1tWorld = clipWorldLine(p1tWorld, p0tWorld);
		}

		p0b = worldToScreenMap(p0bWorld);
		p1b = worldToScreenMap(p1bWorld);
		p0t = worldToScreenMap(p0tWorld);
		p1t = worldToScreenMap(p1tWorld);
	}

	let x0, y0, x1, y1;
	let y0t, y1t;
	if (p0b.x < p1b.x) {
		x0 = p0b.x;
		y0 = p0b.y;
		x1 = p1b.x;
		y1 = p1b.y;
		y0t = p0t.y;
		y1t = p1t.y;
	} else {
		x0 = p1b.x;
		y0 = p1b.y;
		x1 = p0b.x;
		y1 = p0b.y;
		y0t = p1t.y;
		y1t = p0t.y;
	}

	let slopeBot = (y1 - y0) / (x1 - x0);
	let slopeTop = (y1t - y0t) / (x1 - x0);
	let x = Math.round(x0);
	if (x < 0.0) { x = 0.0; }
	
	while (x <= x1 && x < parseFloat(gbSurface.width)) {
		let pyb = Math.round((slopeBot * (x - x0 + 0.5)) + y0);
		let pyt = Math.round((slopeTop * (x - x0 + 0.5)) + y0t);

		let y = pyb;
		if (y < 0.0) { y = 0.0; }
		while (y <= pyt && y < parseFloat(gbSurface.height)) {
			gbSetPixel(x, y, wall.color);
			y += 1.0;
		}

		x += 1.0;
	}
}

function gbSortWallsInsertionSort(warr, iarr) {
	// https://www.doabledanny.com/insertion-sort-in-javascript
	for (let i = 1; i < warr.length; i++) {
		let icurr = iarr[i];
		let wcurr = warr[i];
		let j;
		for (j = i - 1; j >= 0 && iarr[j] < icurr; j--) {
			warr[j + 1] = warr[j];
			iarr[j + 1] = iarr[j];
		}
		warr[j + 1] = wcurr;
		iarr[j + 1] = icurr;
	}
}

function gbSortWalls(world, walls) {
	let wdists = [];
	for (let i = 0; i < walls.length; i++) {
		wdists.push(Math.min(
			Math.sqrt(Math.pow(walls[i].pos0.x - world.player.pos.x, 2.0) + Math.pow(walls[i].pos0.y - world.player.pos.y, 2.0)),
			Math.sqrt(Math.pow(walls[i].pos1.x - world.player.pos.x, 2.0) + Math.pow(walls[i].pos1.y - world.player.pos.y, 2.0))
		));
		console.log(wdists[i]);
	}

	gbSortWallsInsertionSort(walls, wdists);
}

function gbRenderWorld(world) {
	renderWalls = [...world.walls];
	gbSortWalls(world, renderWalls);

	let i;
	for (i = 0; i < world.walls.length; i++) {
		gbRenderWall(world, renderWalls[i]);
	}
}