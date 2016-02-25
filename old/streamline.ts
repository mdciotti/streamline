
export class Streamline {

	timestamp: number;
	scale: number;
	x: number;
	y: number;
	x_last: number;
	y_last: number;
	vx: number;
	vy: number;
	ax: number;
	ay: number;

	constructor(x: number, y: number) {
		// this.mass = 0.001;
		this.timestamp = Date.now();
		this.scale = 100;
		this.x = typeof x !== "number" ? Math.random() - 0.5 : x;
		this.y = typeof x !== "number" ? Math.random() - 0.5 : y;
		this.x_last = this.x;
		this.y_last = this.y;
		this.vx = 0;
		this.vy = 0;
		this.ax = 0;
		this.ay = 0;
	}

	applyFields(field) {
		if (field instanceof VectorField) {
			this.vx += field.strength * field.getvx(this.x, this.y);
			this.vy += field.strength * field.getvy(this.x, this.y);
		} else {
			for (var f = field.length - 1; f >= 0; f--) {
				this.vx += field[f].strength * field[f].getvx(this.x, this.y);
				this.vy += field[f].strength * field[f].getvy(this.x, this.y);
			}
		}
	}

	update(dt, dt_last) {
		var dx = this.x - this.x_last;
		var dy = this.y - this.y_last;
		this.x_last = this.x;
		this.y_last = this.y;
		// var dt_ratio = dt / dt_last;
		var dt_ratio = 1;

		// Time-corrected Verlet integration
		// this.x += dx * dt_ratio + this.ax * dt * dt;
		// this.y += dy * dt_ratio + this.ay * dt * dt;
		// this.vx = dx * dt;
		// this.vy = dy * dt;

		// Euler integration
		// this.vx += this.ax * dt;
		// this.vy += this.ay * dt;
		// this.x += this.vx * dt;
		// this.y += this.vy * dt;

		// No integration?
		this.x += this.vx * dt;
		this.y += this.vy * dt;

		this.vx = 0;
		this.vy = 0;
	}

	draw() {
		// this.ctx.moveTo(
		// 	stream.x * w,
		// 	stream.y * h
		// );
		// this.ctx.lineTo(
		// 	(stream.x + stream.vx) * w,
		// 	(stream.y + stream.vy) * h
		// );
	}
}
