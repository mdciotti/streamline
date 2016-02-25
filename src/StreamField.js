/*
 * Streamline.js
 * Streamline is a vector field simulator.
 * Preview: http://mdciotti.github.io/streamline
 * Author: Maxwell Ciotti - @mdciotti - http://mdc.io
 * License: MIT
 */

"use strict";

import FieldFeature from './FieldFeature.js';
import Streamline from './Streamline.js';
// import Vec2 from './Vec2.js';

const TO_DEGREES = 180 / Math.PI;

export default class StreamField {
	constructor() {
		this.running = false;
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext('2d');
		// var EPSILON = 1e-3;
		this.EPSILON = 1e-2;
		this.paused = false;
		this.canvas.width = 300;
		this.canvas.height = 300;
		// document.body.appendChild(this.canvas);
		this.streamlines = [];
		this.features = [];
		// this.bounds = { left: 0, top: 0, width: }
		this.viewbox = {
			top: 0.5,
			right: 0.5,
			bottom: -0.5,
			left: 0.5,
			width: 1,
			height: 1,
			origin: { x: 0, y: 0 }
		};

		// Configurable options
		this.background = "#000000";
		this.foreground = "#CCCCCC";
		this.motionBlur = 0.0;
		this.opacity = 1.0;
		this.transparent = false;
		this.lineWidth = 1;
		this.drawFeatures = false;
		this.fieldGradient = false;
		this.fieldLines = false;
		this.fieldSize = 20;
		this.fieldScale = 0.5;
		this.speed = 1;
		this.log_speed = 0;
		this.zoom = 300;
		this.wrap = false;
		this.lifeSpan = 5;
		this.streamCount = 100;
		this.realTime = false;
	}

	// Converts pixel-based coordinates to simulation coordinates
	getXCoordinate(x) {
		return (x - this.canvas.width / 2) / this.zoom;
	}
	getYCoordinate(y) {
		return -(y - this.canvas.height / 2) / this.zoom;
	}

	setSpeed(logSpeed) {
		this.speed = Math.pow(10, logSpeed);
		this.log_speed = logSpeed;
	}

	setMotionBlur(blur) {
		this.opacity = 1.0 - Math.pow(blur, 0.1);
		this.motionBlur = blur;
	}

	setZoom(z) {
		this.zoom = z;
		// this.setViewbox(null, null, this.canvas.width, this.canvas.height);
		this.viewbox.width = this.canvas.width / this.zoom;
		this.viewbox.height = this.canvas.height / this.zoom;
	}

	setViewbox(originX, originY, width, height) {
		this.viewbox.width = typeof width === "number" ? width / this.zoom : this.viewbox.width;
		this.viewbox.height = typeof height === "number" ? height / this.zoom : this.viewbox.height;
		this.viewbox.origin.x = typeof originX === "number" ? originX / this.zoom : this.viewbox.origin.x;
		this.viewbox.origin.y = typeof originY === "number" ? originY / this.zoom : this.viewbox.origin.y;
		this.viewbox.left = this.viewbox.origin.x - this.viewbox.width / 2;
		this.viewbox.bottom = this.viewbox.origin.y - this.viewbox.height / 2;
		this.viewbox.right = this.viewbox.left + this.viewbox.width;
		this.viewbox.top = this.viewbox.bottom + this.viewbox.height;
	}

	translate(dx, dy) {
		// this.setViewbox(this.viewbox.origin.x * this.zoom + dx, this.viewbox.origin.y * this.zoom - dy);
		dx /= this.zoom;
		dy /= this.zoom;

		this.viewbox.origin.x += dx;
		this.viewbox.origin.y -= dy;
		this.viewbox.left -= dx;
		this.viewbox.bottom += dy;
		this.viewbox.right -= dx;
		this.viewbox.top += dy;
	}

	addStream(stream) {
		if (typeof stream === "object" && stream instanceof Streamline) {
			this.streamlines.push(stream);
		} else {
			this.streamlines.push(new Streamline());
		}
	}

	addFeature(features) {
		// if (typeof features === "object" && features instanceof FieldFeature) {
			this.features.push(features);
		// } else {
			// TODO: Error logging
		// }
	}

	add(item) {
		if (typeof item === "object") {
			if (item instanceof FieldFeature) this.features.push(item);
			else if (item instanceof Streamline) this.streamlines.push(item);
			// else // TODO: Error logging
		} else {
			// TODO: Error logging
		}
	}

	resetViewbox() {
		let w = this.canvas.width = window.innerWidth;
		let h = this.canvas.height = window.innerHeight;
		this.zoom = 300;
		this.setViewbox(0, 0, w, h);
	}

	init() {}

	reset(init) {
		this.streamlines = [];
		this.features = [];

		this.resetViewbox();

		if (!this.transparent) {
			this.ctx.globalAlpha = 1;
			this.ctx.fillStyle = this.background;
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

			this.ctx.globalAlpha = this.opacity;
			this.ctx.fillStyle = this.foreground;
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		}

		if (typeof init === "function") {
			init.call(this);
		} else {
			this.init();
		}
	}

	applyFeatures(dt) {
		for (let s = this.streamlines.length - 1; s >= 0; s--) {
			this.streamlines[s].vx = 0;
			this.streamlines[s].vy = 0;
			this.streamlines[s].applyFeatures(this.features);
		}
	}

	update(dt) {
		// Update features
		for (let i = this.features.length - 1; i >= 0; i--) {
			let feature = this.features[i];
			feature.update(dt);

			// Wrap around edges (torus geometry)
			if (this.wrap) {
				while (feature.x < this.viewbox.left) feature.x += this.viewbox.width;
				while (feature.x > this.viewbox.right) feature.x -= this.viewbox.width;
				while (feature.y < this.viewbox.bottom) feature.y += this.viewbox.height;
				while (feature.y > this.viewbox.top) feature.y -= this.viewbox.height;
			}
		}

		// Update streamlines
		for (let i = this.streamlines.length - 1; i >= 0; i--) {
			let stream = this.streamlines[i];
			stream.update(dt);
			// let radius = Math.hypot(stream.x, stream.y);
			
			// TODO: custom bounds for feature?
			// if (radius < this.EPSILON || radius > 1) {
			// if (radius < this.EPSILON) {
			// 	this.streamlines.splice(i, 1);
			// }

			// Remove when too old
			if (this.lifeSpan > 0) {
				// let now = Date.now();
				// if (Date.now() - stream.timestamp > this.lifeSpan * 1000) {
				if (Math.random() * this.lifeSpan < 0.01) {
					this.streamlines.splice(i, 1);
					// this.streamlines[i] = new Streamline();
				}
			}

			// Wrap around edges (torus geometry)
			if (this.wrap) {
				while (stream.x < this.viewbox.left) stream.x += this.viewbox.width;
				while (stream.x > this.viewbox.right) stream.x -= this.viewbox.width;
				while (stream.y < this.viewbox.bottom) stream.y += this.viewbox.height;
				while (stream.y > this.viewbox.top) stream.y -= this.viewbox.height;
			}
		}
	}

	getv(x, y) {
		let v = { x: 0, y: 0 };

		for (let f = this.features.length - 1; f >= 0; f--) {
			let field = this.features[f];
			if (field.enabled) {
				v.x += field.strength * field.getvx(x, y);
				v.y += field.strength * field.getvy(x, y);
			}
		}

		return v;
	}

	draw(dt) {
		let w = this.canvas.width,
			h = this.canvas.height;
		
		// No background if transparent
		if (!this.transparent) {
			this.ctx.globalAlpha = this.opacity;
			this.ctx.fillStyle = this.background;
			this.ctx.fillRect(0, 0, w, h);
		} else {
			this.ctx.clearRect(0, 0, w, h);
		}
		
		this.ctx.save();
		this.ctx.globalAlpha = 1.0;
		
		// Set origin to center, flip vertical axis
		this.ctx.translate(w / 2, h / 2);
		this.ctx.scale(1, -1);
		this.ctx.scale(this.zoom, this.zoom);
		this.ctx.translate(this.viewbox.origin.x, this.viewbox.origin.y);
		
		// Draw field gradient
		if (this.fieldGradient) {
			let x, y, v, vx, vy, hue, sat;
			// Sample parameters
			let n = this.fieldSize;
			// let unit = 1 / n;
			// let s_w = w / n;
			// let s_h = h / n;
			let nx = this.canvas.width / this.fieldSize;
			let ny = this.canvas.height / this.fieldSize;
			let sampleSize = this.fieldSize / this.zoom;

			for (let j = 0; j < ny; j++) {
				for (let i = 0; i < nx; i++) {

					x = (i * this.fieldSize - this.canvas.width / 2) / this.zoom;
					y = (j * this.fieldSize - this.canvas.height / 2) / this.zoom;
					v = this.getv(x, y);

					hue = Math.floor(Math.atan2(v.y, v.x) * TO_DEGREES + 180);
					sat = Math.floor(Math.min(Math.hypot(v.x, v.y) * this.fieldScale, 1) * 100);
					this.ctx.fillStyle = "hsl(" + hue + ", " + sat + "%, 50%)";
					this.ctx.fillRect(x - sampleSize/2, y - sampleSize/2, sampleSize, sampleSize);
				}
			}
		}
		
		// Draw all field lines
		if (this.fieldLines) {
			this.ctx.save();
			this.ctx.globalAlpha = 0.25;
			this.ctx.strokeStyle = "#FFFFFF";
			this.ctx.lineWidth = 1 / this.zoom;
			this.ctx.beginPath();

			let x, y, v;
			// Sample parameters
			// let n = this.fieldSize;
			// let unit = 1 / n;
			// let max_len = this.fieldScale;
			let scale = 0.01;
			let nx = this.canvas.width / this.fieldSize;
			let ny = this.canvas.height / this.fieldSize;

			for (let j = 0; j < ny; j++) {
				for (let i = 0; i < nx; i++) {

					x = (i * this.fieldSize - this.canvas.width / 2) / this.zoom;
					y = (j * this.fieldSize - this.canvas.height / 2) / this.zoom;
					v = this.getv(x, y);

					this.ctx.moveTo(
						(x - v.x * scale),
						(y - v.y * scale)
					);
					this.ctx.lineTo(
						(x + v.x * scale),
						(y + v.y * scale)
					);
				}
			}
			this.ctx.stroke();
			this.ctx.restore();
		}

		// Draw all streamlines
		// this.ctx.fillStyle = this.foreground;
		// let radius = this.lineWidth / this.zoom;
		this.ctx.strokeStyle = this.foreground;
		this.ctx.lineWidth = this.lineWidth / this.zoom;
		this.ctx.beginPath();
		
		for (let i = this.streamlines.length - 1; i >= 0; i--) {
			// this.streamlines[i].draw(this.ctx);
			let stream = this.streamlines[i];
			stream.scale = dt;
			// this.ctx.fillRect(stream.x, stream.y, radius, radius);
			this.ctx.moveTo(
				stream.x,
				stream.y
			);
			this.ctx.lineTo(
				(stream.x + stream.vx * stream.scale),
				(stream.y + stream.vy * stream.scale)
			);
		}
		this.ctx.stroke();

		// Draw all features
		if (this.drawFeatures) {
			this.ctx.strokeStyle = "#0000ff";
			this.ctx.beginPath();
			for (let i = this.features.length - 1; i >= 0; i--) {
				let feature = this.features[i];
				if (!feature.enabled) continue;
				let r = Math.abs(feature.strength * 10) / this.zoom;
				this.ctx.moveTo(feature.x + r, feature.y);
				this.ctx.arc(feature.x, feature.y, r, 0, 2 * Math.PI, false);
			}
			this.ctx.stroke();
		}

		this.ctx.restore();

		// Debug info
		// this.ctx.fillStyle = "#CCCCCC";
		// this.ctx.fillText(vectors.length.toString(), 8, 16);
	}

	animate(now) {
		let dt, dt_s;

		requestAnimationFrame(this.animate.bind(this));

		if (this.realTime) {
			// let now = Date.now();
			dt = now - (this._time || now);
			this._time = now;
			dt_s = this.speed * dt / 1000;
		} else {
			dt_s = this.speed / 60;
		}

		// Add a stream until there are this.streamCount streams	
		while (this.streamlines.length < this.streamCount) {
			let x = Math.random() * this.viewbox.width + this.viewbox.left;
			let y = Math.random() * this.viewbox.height + this.viewbox.bottom;
			this.streamlines.push(new Streamline(x, y));
		}
		
		// Remove a stream until there are only this.streamCount streams left
		while (this.streamlines.length > this.streamCount) {
			this.streamlines.pop();
		}

		// Skip update and draw if paused
		if (!this.paused) {
			this.applyFeatures(dt_s);
			this.draw(dt_s);
			this.update(dt_s);
		}
	}

	toggleState() {
		if (!this.running) {
			requestAnimationFrame(this.animate.bind(this));
			this.running = true;
		} else {
			// this.paused = !this.paused;
		}
	}
}
