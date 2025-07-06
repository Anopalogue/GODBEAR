function pointWorldCoords(world, point) {
	let np0 = {
		x: point.x - world.player.pos.x,
		y: point.y - world.player.pos.y,
		z: point.z - world.player.pos.z
	};
	let np1 = {
		x: (np0.x * Math.cos(world.player.rot * (Math.PI / 180.0))) - (np0.y * Math.sin(world.player.rot * (Math.PI / 180.0))),
		y: (np0.y * Math.cos(world.player.rot * (Math.PI / 180.0))) + (np0.x * Math.sin(world.player.rot * (Math.PI / 180.0))),
		z: np0.z
	};
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

	let x0 = p0b.x, y0 = p0b.y, x1 = p1b.x, y1 = p1b.y;
	let y0t = p0t.y, y1t = p1t.y;
	let d = x1 - x0;
	if (d == 0.0) {
		d = 1.0;
	}
	let slopeBot = (y1 - y0) / d;
	let slopeTop = (y1t - y0t) / d;
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

function gbRenderWorld(world) {
	console.log("(" + world.player.pos.x + ", " + world.player.pos.y + ", " + world.player.pos.z + ") - " + world.player.rot + "deg");	

	let i;
	for (i = 0; i < world.walls.length; i++) {
		gbRenderWall(world, world.walls[i]);
	}
}