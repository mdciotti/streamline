"use strict";

import StreamField from './src/StreamField.js';
import FieldFeature from './src/FieldFeature.js';
// import Vec2 from './src/Vec2.js';

window.vortex = new StreamField();
let wasPaused = vortex.paused;
let zoomFactor = 0.8;
let mouse = {
	x: 0,
	y: 0,
	lastx: 0,
	lasty: 0,
	dx: 0,
	dy: 0,
	down: false
};
let key = {
	ctrl: false
};

let field = new FieldFeature({
	Fx: function (x, y) { return x; },
	Fy: function (x, y) { return -y; },
	strength: 1
});
let field2 = new FieldFeature({
	Fx: function (x, y) { return y; },
	Fy: function (x, y) { return x; },
	strength: 1
});
let ccw = new FieldFeature({
	Fx: function (x, y) { return -y; },
	Fy: function (x, y) { return x; },
	strength: 1
});
let ccw2 = new FieldFeature({
	Fx: function (x, y) { return -y / Math.hypot(x, y); },
	Fy: function (x, y) { return x / Math.hypot(x, y); },
	strength: 1
});
let ccw3 = new FieldFeature({
	Fx: function (x, y) { return -y / Math.hypot(x, y) / Math.exp((x*x + y*y) * 2); },
	Fy: function (x, y) { return x / Math.hypot(x, y) / Math.exp((x*x + y*y) * 2); },
	strength: 1
});
let suck = new FieldFeature({
	Fx: function (x, y) { return -x / Math.hypot(x, y); },
	Fy: function (x, y) { return -y / Math.hypot(x, y); },
	strength: 1
});
let suck2 = new FieldFeature({
	Fx: function (x, y) { return -x; },
	Fy: function (x, y) { return -y; },
	strength: 1
});
let flowField = new FieldFeature({
	Fx: function (x, y) { return 1; }
});
let wave = new FieldFeature({
	Fy: function (x, y) { return Math.sin(Math.PI*x); },
	strength: 0.2
});
let repel = new FieldFeature({
	Fx: function (x, y) { return x / Math.hypot(x, y) / Math.exp((x*x + y*y) * 8); },
	Fy: function (x, y) { return y / Math.hypot(x, y) / Math.exp((x*x + y*y) * 8); },
	strength: 2,
	enabled: false
});

// vortex.addFeature(ccw3);
// vortex.addFeature(flowField);
// vortex.addFeature(wave);
// vortex.addFeature(repel);

window.addEventListener("load", (e) => {
	vortex.canvas.width = window.innerWidth;
	vortex.canvas.height = window.innerHeight;
	document.body.appendChild(vortex.canvas);
	vortex.setViewbox(0, 0, window.innerWidth, window.innerHeight);
	// vortex.fieldLines = true;
	vortex.fieldSize = 40;
	vortex.lineWidth = 1.5;
	vortex.setMotionBlur(0.8);
	vortex.wrap = true;
	vortex.streamCount = 1000;
	vortex.background = "#FF6060";
	vortex.foreground = "#FFFFFF";
	vortex.setSpeed(-0.5);
	vortex.toggleState();

	vortex.init = function () {
		let featureList = [ccw3, ccw3];

		for (let i = 0; i < 10; i++) {
			let feature = featureList[Math.floor(Math.random() * featureList.length)].clone();
			feature.x = vortex.getXCoordinate(Math.random() * vortex.canvas.width);
			feature.y = vortex.getYCoordinate(Math.random() * vortex.canvas.height);
			feature.strength = Math.random() < 0.5 ? -1 : 1;
			feature.vx = Math.random() * 2 - 1;
			feature.vy = Math.random() * 2 - 1;
			vortex.addFeature(feature);
		}
		vortex.addFeature(repel);
	};

	vortex.reset();

	vortex.canvas.addEventListener("mousedown", (e) => mouse.down = true);

	vortex.canvas.addEventListener("mouseup", (e) => mouse.down = false);

	vortex.canvas.addEventListener("mousemove", (e) => {
		mouse.lastx = mouse.x;
		mouse.lasty = mouse.y;
		mouse.x = e.clientX;
		mouse.y = e.clientY;
		mouse.dx = mouse.x - mouse.lastx;
		mouse.dy = mouse.y - mouse.lasty;
		if (mouse.down) {
			vortex.translate(mouse.dx, mouse.dy);
		}
		repel.x = vortex.getXCoordinate(mouse.x);
		repel.y = vortex.getYCoordinate(mouse.y);
	});

	let gui = new dat.GUI();
	let style = gui.addFolder("Style");
	style.addColor(vortex, "background");
	style.addColor(vortex, "foreground");
	style.add(vortex, "motionBlur", 0, 1).step(0.01).onChange(vortex.setMotionBlur.bind(vortex));
	style.add(vortex, "lineWidth", 0, 10).step(0.1);
	style.add(vortex, "transparent");
	// style.open();

	let field = gui.addFolder("Field Options");
	field.add(vortex, "drawFeatures");
	field.add(vortex, "fieldGradient");
	field.add(vortex, "fieldLines");
	field.add(vortex, "fieldSize", 0, 100).step(2);
	field.add(vortex, "fieldScale", 0, 1).step(0.1);
	// field.open();

	// let flow = gui.addFolder("Flow Options");
	// flow.add(flowField, "strength", -5, 5).step(0.5);
	// flow.add(wave, "strength", -5, 5).step(0.5);
	// flow.add(repel, "strength", -5, 5).step(0.5);
	// flow.open();

	gui.add(vortex, "zoom", 0, 1000).step(10).listen().onChange(vortex.setZoom.bind(vortex));
	gui.add(vortex, "log_speed", -1, 1).step(0.01).onChange(vortex.setSpeed.bind(vortex));
	gui.add(vortex, "lifeSpan", 0, 10).step(1);
	gui.add(vortex, "streamCount", 0, 1000).step(10);
	gui.add(vortex, "wrap");
	gui.add(vortex, "paused").listen();
	gui.add(vortex, "reset");
});

window.addEventListener("focus", (e) => vortex.paused = wasPaused);

window.addEventListener("blur", (e) => {
	wasPaused = vortex.paused;
	vortex.paused = true;
});

window.addEventListener("mousewheel", (e) => {
	if (e.wheelDeltaY < 0) {
		vortex.zoom *= zoomFactor;
	} else {
		vortex.zoom /= zoomFactor;
	}
	vortex.setViewbox(0, 0, window.innerWidth, window.innerHeight);
});

window.addEventListener("keydown", (e) => {
	if (e.which === "H".charCodeAt(0)) {
		document.querySelector(".info").classList.toggle("hidden");
	} else if (e.ctrlKey || e.which === 17) {
		key.ctrl = true;
		repel.enabled = true;
	}
});

window.addEventListener("keyup", (e) => {
	if (e.ctrlKey || e.which === 17) {
		key.ctrl = false;
		repel.enabled = false;
	}
});
