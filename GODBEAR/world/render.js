function transformPoint(world, point) {
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
	np1.z += ((np1.y) / 32.0);
	console.log(np1.x + ", " + np1.y);
	let np2 = {
		x: ((200.0 * np1.x) / np1.y) + (parseFloat(gbSurface.width) / 2.0),
		y: ((200.0 * np1.z) / np1.y) + (parseFloat(gbSurface.height) / 2.0)
	};
	return np2;
}

function gbRenderWall(world, wall) {
	let p0t = transformPoint(world, wall.pos0);
	let p1t = transformPoint(world, wall.pos1);

	let x0, y0, x1, y1;
	if (p0t.x < p1t.x) {
		x0 = p0t.x;
		y0 = p0t.y;
		x1 = p1t.x;
		y1 = p1t.y;
	} else {
		x0 = p1t.x;
		y0 = p1t.y;
		x1 = p0t.x;
		y1 = p0t.y;
	}

	let slope = (y1 - y0) / (x1 - x0);
	let x = Math.round(x0);
	while (x < x1) {
		let px = x;
		let py = Math.round((slope * (px - x0 + 0.5)) + y0);
		if (px >= 0.0 && px < parseFloat(gbSurface.width) &&
			py >= 0.0 && py < parseFloat(gbSurface.height)
		) {
			gbSetPixel(px, py, 0);
		}
		x += 1.0;
	}
}

function gbRenderWorld(world) {
	let i;
	for (i = 0; i < world.walls.length; i++) {
		gbRenderWall(world, world.walls[i]);
	}
}