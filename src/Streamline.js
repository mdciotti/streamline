"use strict";

import FieldFeature from './FieldFeature.js';
// import Vec2 from './Vec2.js';

export default class Streamline {
	constructor(x, y) {
		// this.mass = 0.001;
		this.timestamp = Date.now();
		this.scale = 120;
		this.x = typeof x !== "number" ? Math.random() - 0.5 : x;
		this.y = typeof x !== "number" ? Math.random() - 0.5 : y;
		this.x_last = this.x;
		this.y_last = this.y;
		this.vx = 0;
		this.vy = 0;
		this.ax = 0;
		this.ay = 0;
	}

	applyFeatures(features) {
		if (features instanceof FieldFeature) {
			this.vx += features.strength * features.getvx(this.x, this.y);
			this.vy += features.strength * features.getvy(this.x, this.y);
		} else {
			for (let f = features.length - 1; f >= 0; f--) {
				let feature = features[f];
				if (feature.enabled) {
					this.vx += feature.strength * feature.getvx(this.x, this.y);
					this.vy += feature.strength * feature.getvy(this.x, this.y);
				}
			}
		}
	}

	update(dt, dt_last) {
		let dx = this.x - this.x_last;
		let dy = this.y - this.y_last;
		this.x_last = this.x;
		this.y_last = this.y;
		// let dt_ratio = dt / dt_last;
		let dt_ratio = 1;

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

		// this.vx = 0;
		// this.vy = 0;
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
