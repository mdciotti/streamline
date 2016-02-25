"use strict";

// import Vec2 from './Vec2.js';

export default class FieldFeature {
	constructor(properties) {
		this.x = 0;
		this.y = 0;
		// this.pos = new Vec2();
		this.strength = 1;
		this.vx = 0;
		this.vy = 0;
		// this.vel = new Vec2();
		this.enabled = true;

		this.Fx = function (x, y) { return 0; };
		this.Fy = function (x, y) { return 0; };

		if (typeof properties === "object") {
			this.strength = properties.hasOwnProperty("strength") ? properties.strength : this.strength;
			this.Fx = properties.hasOwnProperty("Fx") ? properties.Fx : this.Fx;
			this.Fy = properties.hasOwnProperty("Fy") ? properties.Fy : this.Fy;
			this.x = properties.hasOwnProperty("x") ? properties.x : this.x;
			this.y = properties.hasOwnProperty("y") ? properties.y : this.y;
			this.enabled = properties.hasOwnProperty("enabled") ? properties.enabled : this.enabled;
		}
	}

	getvx(x, y) {
		return this.Fx.call(this, x - this.x, y - this.y);
	}

	getvy(x, y) {
		return this.Fy.call(this, x - this.x, y - this.y);
	}

	setOrigin(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}

	setStrength(s) {
		this.strength = s;
		return this;
	}

	clone() {
		return new FieldFeature({ Fx: this.Fx, Fy: this.Fy, strength: this.strength });
	}

	update(dt) {
		this.x += this.vx * dt;
		this.y += this.vy * dt;
	}
}
