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

function screenMapToWorld(np1) {
	let np2 = {
		x: (np1.x - (parseFloat(gbSurface.width) / 2.0)) / np1.y
	};
}

function gbRenderWall(world, wall) {
	let p0b, p1b, p0t, p1t;
	let p0bWorld, p1bWorld, p0tWorld, p1tWorld;
	if (world.player.rot == 0) {
		world.player.rot = 1;
	}
	{
		// Map to world coordinates
		let tp0bWorld = pointWorldCoords(world, { x: wall.pos0.x, y: wall.pos0.y, z: wall.pos0.z - wall.height });
		let tp1bWorld = pointWorldCoords(world, { x: wall.pos1.x, y: wall.pos1.y, z: wall.pos1.z - wall.height });
		let tp0tWorld = pointWorldCoords(world, wall.pos0);
		let tp1tWorld = pointWorldCoords(world, wall.pos1);
		p0bWorld = { x: tp0bWorld.x, y: tp0bWorld.y, z: tp0bWorld.z };
		p1bWorld = { x: tp1bWorld.x, y: tp1bWorld.y, z: tp1bWorld.z };;
		p0tWorld = { x: tp0tWorld.x, y: tp0tWorld.y, z: tp0tWorld.z };;
		p1tWorld = { x: tp1tWorld.x, y: tp1tWorld.y, z: tp1tWorld.z };;

		// Ignore this wall if it's fully behind player
		if (p0bWorld.y < 1.0 && p1bWorld.y < 1.0) {
			return;
		}
		// Clip lines
		if (tp0bWorld.y < 1.0) {
			tp0bWorld = clipWorldLine(tp0bWorld, tp1bWorld);
			tp0tWorld = clipWorldLine(tp0tWorld, tp1tWorld);
		}
		if (tp1bWorld.y < 1.0) {
			tp1bWorld = clipWorldLine(tp1bWorld, tp0bWorld);
			tp1tWorld = clipWorldLine(tp1tWorld, tp0tWorld);
		}

		p0b = worldToScreenMap(tp0bWorld);
		p1b = worldToScreenMap(tp1bWorld);
		p0t = worldToScreenMap(tp0tWorld);
		p1t = worldToScreenMap(tp1tWorld);

		// Ignore wall if player's staring riiight at the edge
		if (Math.abs(p0b.x - p1b.x) < 1.0) {
			return;
		}
	}

	let x0 = p0b.x, y0 = p0b.y, x1 = p1b.x, y1 = p1b.y;
	let y0t = p0t.y, y1t = p1t.y;
	let d = x1 - x0;
	if (Math.abs(d) <= 0.00001) {
		d = 1.0;
	}
	let slopeBot = (y1 - y0) / d;
	let slopeTop = (y1t - y0t) / d;
	let x = Math.round(x0);
	if (x < 0.0) { x = 0.0; }
	
	while (x <= x1 && x < parseFloat(gbSurface.width)) {
		let pyb = (slopeBot * (x - x0)) + y0;
		let pyt = (slopeTop * (x - x0)) + y0t;
		
		let wz = p0bWorld.z + (((Math.round(y1) + 0.01 - pyb) / (pyt - pyb)) * (p0tWorld.z - p0bWorld.z));
		let wy = (200.0 * wz) / (Math.round(y1) + 0.01 - (gbSurface.height / 2.0));
		let wx = (wy * (x - (gbSurface.width / 2.0))) / 200.0;
		let d = p1bWorld.x - p0bWorld.x;
		/*let xfrac;
		if (Math.abs(d) <= 0.001) {
			xfrac = (wx - p0bWorld.x) / (x1 - x0);
		} else {
			xfrac = (wx - p0bWorld.x) / (d);
		}*/
		let dist = Math.sqrt(wx*wx + wy*wy);
		let distfrac = Math.round((Math.min(dist, 1000.0) / 1000.0) * 23);
		let color = 255 - distfrac;

		let y = Math.round(pyb);
		if (y < 0.0) { y = 0.0; }
		while (y <= pyt && y < parseFloat(gbSurface.height)) {
			/*let yfrac = (y - pyb) / (pyt - pyb);
			if (xfrac < 0.5) {
				if (yfrac < 0.5) {
					gbSetPixel(x, y, 9);
				} else {
					gbSetPixel(x, y, 12);
				}
			} else {
				if (yfrac < 0.5) {
					gbSetPixel(x, y, 10);
				} else {
					gbSetPixel(x, y, 206);
				}
			}*/
			gbSetPixel(x, y, color);
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