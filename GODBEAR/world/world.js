function gbWall() {
	this.pos0 = { x: 0, y: 0, z: 0 };
	this.pos1 = { x: 0, y: 0, z: 0 };
	this.height = 0;
	this.color = 0;
}

function gbSector() {
	this.points = [];
}

function gbPlayer() {
	this.pos = { x: 0, y: 0, z: 0 };
	this.rot = 0; // (Degrees)
}

function gbWorld() {
	this.walls = [];
	this.player = new gbPlayer();
}