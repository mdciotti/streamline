"use strict";

export default class Vec2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	set(x, y) {
		this.x = x;
		this.y = y;
	}

	static clone() {
		return new Vec2(this.x, this.y);
	}

	static length(vector) {
		return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
	}

	static squaredLength(vector) {
		return vector.x * vector.x + vector.y * vector.y;
	}

	static dot(lhs, rhs) {
		return lhs.x * rhs.x + lhs.y * rhs.y;
	}

	static zero(out) {
		out.x = 0;
		out.y = 0;
		return out;
	}

	static create() {
		let out = new Vec2(0, 0);
	}

	// Mathematic Operations

	static add(out, lhs, rhs) {
		out.x = lhs.x + rhs.x;
		out.y = lhs.y + rhs.y;
		return out;
	}

	static subtract(out, lhs, rhs) {
		out.x = lhs.x - rhs.x;
		out.y = lhs.y - rhs.y;
		return out;
	}

	static multiply(out, lhs, rhs) {
		out.x = lhs.x * rhs.x;
		out.y = lhs.y * rhs.y;
		return out;
	}

	static divide(out, lhs, rhs) {
		out.x = lhs.x / rhs.x;
		out.y = lhs.y / rhs.y;
		return out;
	}

	static scale(out, lhs, k) {
		out.x = lhs.x * k;
		out.y = lhs.y * k;
		return out;
	}

	static scaleAndAdd(out, lhs, rhs, k) {
		out.x = lhs.x + (k * rhs.x);
		out.y = lhs.y + (k * rhs.y);
		return out;
	}

	static negate(out, lhs) {
		out.x = -lhs.x;
		out.y = -lhs.y;
		return out;
	}

	static normalize(out, lhs) {
		let len = lhs.x * lhs.x + lhs.y * lhs.y;
		if (len > 0) {
			len = 1 / Math.sqrt(len);
			out.x = lhs.x * len;
			out.y = lhs.y * len;
		}
		return out;
	}

	static min(out, lhs, rhs) {
		out.x = Math.min(lhs.x, rhs.x);
		out.y = Math.min(lhs.y, rhs.y);
		return out;
	}

	static max(out, lhs, rhs) {
		out.x = Math.max(lhs.x, rhs.x);
		out.y = Math.max(lhs.y, rhs.y);
		return out;
	}

	// Performs a linear interpolation between two Vec2's
	static lerp(out, lhs, rhs, t) {
		out.x = lhs.x + t * (rhs.x - lhs.x);
		out.y = lhs.y + t * (rhs.y - lhs.y);
		return out;
	}

	// Transforms the Vec2 with a mat2
	static transformMat2(out, lhs, m) {
		out.x = m[0] * lhs.x + m[2] * lhs.y;
		out.y = m[1] * lhs.x + m[3] * lhs.y;
		return out;
	}

	static distance(lhs, rhs) {
		let dx = rhs.x - lhs.x;
		let dy = rhs.y - lhs.y;
		return Math.sqrt(dx*dx + dy*dy);
	}

	static squaredDistance(lhs, rhs) {
		let dx = rhs.x - lhs.x;
		let dy = rhs.y - lhs.y;
		return dx*dx + dy*dy;
	}
}
