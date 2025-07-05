function gbWall() {
	this.pos0 = { x: 0.0, y: 0.0, z: 0.0 };
	this.pos1 = { x: 0.0, y: 0.0, z: 0.0 };
	this.height = 0.0;
}

function gbPlayer() {
	this.pos = { x: 0.0, y: 0.0, z: 0.0 };
	this.rot = 0.0;
}

function gbWorld() {
	this.walls = [];
	this.player = new gbPlayer();
}