/*
 * Streamline.js
 * Streamline is a vector field simulator.
 * Preview: http://mdciotti.github.io/streamline
 * Author: Maxwell Ciotti - @mdciotti - http://mdc.io
 * License: MIT
 */

var TO_DEGREES = 180 / Math.PI;

function StreamField() {
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
	this.fields = [];
	// this.bounds = { left: 0, top: 0, width: }
	this.viewbox = {
		top: 0.5,
		right: 0.5,
		bottom: -0.5,
		left: 0.5,
		width: 1,
		height: 1
	};

	// Configurable options
	this.background = "#333333";
	this.foreground = "#CCCCCC";
	this.motionBlur = 0.0;
	this.opacity = 1.0;
	this.transparent = false;
	this.lineWidth = 1;
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
StreamField.prototype.getXCoordinate = function (x) {
	return (x - this.canvas.width / 2) / this.zoom;
};
StreamField.prototype.getYCoordinate = function (y) {
	return -(y - this.canvas.height / 2) / this.zoom;
};

StreamField.prototype.setSpeed = function (logSpeed) {
	this.speed = Math.pow(10, logSpeed);
	this.log_speed = logSpeed;
};

StreamField.prototype.setMotionBlur = function (blur) {
	this.opacity = 1.0 - Math.pow(blur, 0.1);
	this.motionBlur = blur;
};

StreamField.prototype.setZoom = function (z) {
	this.setViewbox()
};

StreamField.prototype.setViewbox = function (originX, originY, width, height) {
	this.viewbox.height = height / this.zoom;
	this.viewbox.width = width / this.zoom;
	this.viewbox.bottom = originY / this.zoom - this.viewbox.height / 2;
	this.viewbox.left = originX / this.zoom - this.viewbox.width / 2;
	this.viewbox.top = this.viewbox.bottom + this.viewbox.height;
	this.viewbox.right = this.viewbox.left + this.viewbox.width;
};

StreamField.prototype.addStream = function (stream) {
	if (typeof stream === "object" && stream.constructor === "Streamline") {
		this.streamlines.push(stream);
	} else {
		this.streamlines.push(new Streamline());
	}
};

StreamField.prototype.addField = function (field) {
	// if (typeof field === "object" && field.constructor === "VectorField") {
		this.fields.push(field);
	// } else {
		// TODO: Error logging
	// }
};

StreamField.prototype.clear = function () {
	this.streamlines = [];
};

StreamField.prototype.reset = function (init) {
	this.clear();
	this.ctx.fillStyle = this.background;
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	if (typeof init === "function") {
		init.call(this);
	}
};

StreamField.prototype.applyFields = function (dt) {
	var stream, field;

	for (var s = this.streamlines.length - 1; s >= 0; s--) {
		this.streamlines[s].applyFields(this.fields);
	}
};

StreamField.prototype.update = function (dt) {
	var stream;

	for (var i = this.streamlines.length - 1; i >= 0; i--) {
		stream = this.streamlines[i];
		stream.update(dt);
		// var radius = Math.hypot(stream.x, stream.y);
		
		// TODO: custom bounds for stream field?
		// if (radius < this.EPSILON || radius > 1) {
		// if (radius < this.EPSILON) {
		// 	this.streamlines.splice(i, 1);
		// }

		// Remove when too old
		if (this.lifeSpan > 0) {
			// var now = Date.now();
			// if (Date.now() - stream.timestamp > this.lifeSpan * 1000) {
			if (Math.random() * this.lifeSpan < 0.01) {
				this.streamlines.splice(i, 1);
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
};

function Streamline(x, y) {
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

Streamline.prototype.applyFields = function (field) {
	if (field instanceof VectorField) {
		this.vx += field.strength * field.getvx(this.x, this.y);
		this.vy += field.strength * field.getvy(this.x, this.y);
	} else {
		for (var f = field.length - 1; f >= 0; f--) {
			this.vx += field[f].strength * field[f].getvx(this.x, this.y);
			this.vy += field[f].strength * field[f].getvy(this.x, this.y);
		}
	}
};

Streamline.prototype.update = function (dt, dt_last) {
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
};

Streamline.prototype.draw = function () {
	// this.ctx.moveTo(
	// 	stream.x * w,
	// 	stream.y * h
	// );
	// this.ctx.lineTo(
	// 	(stream.x + stream.vx) * w,
	// 	(stream.y + stream.vy) * h
	// );
};

function VectorField(properties) {
	if (typeof properties === "object") {
		this.strength = properties.hasOwnProperty("strength") ? properties.strength : this.strength;
		this.Fx = properties.hasOwnProperty("Fx") ? properties.Fx : this.Fx;
		this.Fy = properties.hasOwnProperty("Fy") ? properties.Fy : this.Fy;
		this.x = properties.hasOwnProperty("x") ? properties.x : this.x;
		this.y = properties.hasOwnProperty("y") ? properties.y : this.y;
	}
}

VectorField.prototype = {
	x: 0, y: 0,
	strength: 1,
	Fx: function (x, y) { return 0; },
	Fy: function (x, y) { return 0; },
	getvx: function (x, y) {
		return this.Fx.call(this, x - this.x, y - this.y);
	},
	getvy: function (x, y) {
		return this.Fy.call(this, x - this.x, y - this.y);
	},
	setOrigin: function (x, y) {
		this.x = x;
		this.y = y;
		return this;
	},
	setStrength: function (s) {
		this.strength = s;
		return this;
	},
	clone: function () {
		return new VectorField({ Fx: this.Fx, Fy: this.Fy, strength: this.strength });
	}
};

StreamField.prototype.getv = function (x, y) {
	var v = { x: 0, y: 0 };

	for (var f = this.fields.length - 1; f >= 0; f--) {
		field = this.fields[f];
		v.x += field.strength * field.getvx(x, y);
		v.y += field.strength * field.getvy(x, y);
	}

	return v;
};

StreamField.prototype.draw = function (dt) {
	var w = this.canvas.width,
		h = this.canvas.height
	
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
	
	// Draw field gradient
	if (this.fieldGradient) {
		var i, j, x, y, field, vx, vy, hue, sat;
		// Sample parameters
		var n = this.fieldSize;
		// var unit = 1 / n;
		// var s_w = w / n;
		// var s_h = h / n;
		var nx = this.canvas.width / this.fieldSize;
		var ny = this.canvas.height / this.fieldSize;
		var sampleSize = this.fieldSize / this.zoom;

		for (j = 0; j < ny; j++) {
			for (i = 0; i < nx; i++) {

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

		var i, j, x, y, field, v;
		// Sample parameters
		// var n = this.fieldSize;
		// var unit = 1 / n;
		// var max_len = this.fieldScale;
		var scale = 0.01;
		var nx = this.canvas.width / this.fieldSize;
		var ny = this.canvas.height / this.fieldSize;

		for (j = 0; j < ny; j++) {
			for (i = 0; i < nx; i++) {

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
	// var radius = this.lineWidth / this.zoom;
	this.ctx.strokeStyle = this.foreground;
	this.ctx.lineWidth = this.lineWidth / this.zoom;
	this.ctx.beginPath();
	
	for (i = this.streamlines.length - 1; i >= 0; i--) {
		// this.streamlines[i].draw(this.ctx);
		stream = this.streamlines[i];
		// this.ctx.fillRect(stream.x, stream.y, radius, radius);
		this.ctx.moveTo(
			stream.x,
			stream.y
		);
		this.ctx.lineTo(
			(stream.x + stream.vx / stream.scale),
			(stream.y + stream.vy / stream.scale)
		);
	}
	this.ctx.stroke();
	this.ctx.restore();

	// Debug info
	// this.ctx.fillStyle = "#CCCCCC";
	// this.ctx.fillText(vectors.length.toString(), 8, 16);
};

StreamField.prototype.animate = function (now) {

	requestAnimationFrame(this.animate.bind(this));

	if (this.realTime) {
		// var now = Date.now();
		var dt = now - (this._time || now);
		this._time = now;
		var dt_s = this.speed * dt / 1000;
	} else {
		var dt_s = this.speed / 60;
	}

	// Add a stream until there are this.streamCount streams	
	while (this.streamlines.length < this.streamCount) {
		var x = (Math.random() - 0.5) * this.canvas.width / this.zoom;
		var y = (Math.random() - 0.5) * this.canvas.height / this.zoom;
		this.streamlines.push(new Streamline(x, y));
	}
	
	// Remove a stream until there are only this.streamCount streams left
	while (this.streamlines.length > this.streamCount) {
		this.streamlines.pop();
	}

	// Skip update and draw if paused
	if (!this.paused) {
		this.applyFields(dt_s);
		this.draw(dt_s);
		this.update(dt_s);
	}
};

StreamField.prototype.toggleState = function () {
	if (!this.running) {
		requestAnimationFrame(this.animate.bind(this));
		this.running = true;
	} else {
		// this.paused = !this.paused;
	}
};
