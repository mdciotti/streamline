/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _StreamField = __webpack_require__(/*! ./src/StreamField.js */ 1);
	
	var _StreamField2 = _interopRequireDefault(_StreamField);
	
	var _FieldFeature = __webpack_require__(/*! ./src/FieldFeature.js */ 2);
	
	var _FieldFeature2 = _interopRequireDefault(_FieldFeature);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// import Vec2 from './src/Vec2.js';
	
	window.vortex = new _StreamField2.default();
	var wasPaused = vortex.paused;
	var zoomFactor = 0.8;
	var mouse = {
		x: 0,
		y: 0,
		lastx: 0,
		lasty: 0,
		dx: 0,
		dy: 0,
		down: false
	};
	var key = {
		ctrl: false
	};
	
	var field = new _FieldFeature2.default({
		Fx: function Fx(x, y) {
			return x;
		},
		Fy: function Fy(x, y) {
			return -y;
		},
		strength: 1
	});
	var field2 = new _FieldFeature2.default({
		Fx: function Fx(x, y) {
			return y;
		},
		Fy: function Fy(x, y) {
			return x;
		},
		strength: 1
	});
	var ccw = new _FieldFeature2.default({
		Fx: function Fx(x, y) {
			return -y;
		},
		Fy: function Fy(x, y) {
			return x;
		},
		strength: 1
	});
	var ccw2 = new _FieldFeature2.default({
		Fx: function Fx(x, y) {
			return -y / Math.hypot(x, y);
		},
		Fy: function Fy(x, y) {
			return x / Math.hypot(x, y);
		},
		strength: 1
	});
	var ccw3 = new _FieldFeature2.default({
		Fx: function Fx(x, y) {
			return -y / Math.hypot(x, y) / Math.exp((x * x + y * y) * 2);
		},
		Fy: function Fy(x, y) {
			return x / Math.hypot(x, y) / Math.exp((x * x + y * y) * 2);
		},
		strength: 1
	});
	var suck = new _FieldFeature2.default({
		Fx: function Fx(x, y) {
			return -x / Math.hypot(x, y);
		},
		Fy: function Fy(x, y) {
			return -y / Math.hypot(x, y);
		},
		strength: 1
	});
	var suck2 = new _FieldFeature2.default({
		Fx: function Fx(x, y) {
			return -x;
		},
		Fy: function Fy(x, y) {
			return -y;
		},
		strength: 1
	});
	var flowField = new _FieldFeature2.default({
		Fx: function Fx(x, y) {
			return 1;
		}
	});
	var wave = new _FieldFeature2.default({
		Fy: function Fy(x, y) {
			return Math.sin(Math.PI * x);
		},
		strength: 0.2
	});
	var repel = new _FieldFeature2.default({
		Fx: function Fx(x, y) {
			return x / Math.hypot(x, y) / Math.exp((x * x + y * y) * 8);
		},
		Fy: function Fy(x, y) {
			return y / Math.hypot(x, y) / Math.exp((x * x + y * y) * 8);
		},
		strength: 2,
		enabled: false
	});
	
	// vortex.addFeature(ccw3);
	// vortex.addFeature(flowField);
	// vortex.addFeature(wave);
	// vortex.addFeature(repel);
	
	window.addEventListener("load", function (e) {
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
			var featureList = [ccw3, ccw3];
	
			for (var i = 0; i < 10; i++) {
				var feature = featureList[Math.floor(Math.random() * featureList.length)].clone();
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
	
		vortex.canvas.addEventListener("mousedown", function (e) {
			return mouse.down = true;
		});
	
		vortex.canvas.addEventListener("mouseup", function (e) {
			return mouse.down = false;
		});
	
		vortex.canvas.addEventListener("mousemove", function (e) {
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
	
		var gui = new dat.GUI();
		var style = gui.addFolder("Style");
		style.addColor(vortex, "background");
		style.addColor(vortex, "foreground");
		style.add(vortex, "motionBlur", 0, 1).step(0.01).onChange(vortex.setMotionBlur.bind(vortex));
		style.add(vortex, "lineWidth", 0, 10).step(0.1);
		style.add(vortex, "transparent");
		// style.open();
	
		var field = gui.addFolder("Field Options");
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
	
	window.addEventListener("focus", function (e) {
		return vortex.paused = wasPaused;
	});
	
	window.addEventListener("blur", function (e) {
		wasPaused = vortex.paused;
		vortex.paused = true;
	});
	
	window.addEventListener("mousewheel", function (e) {
		if (e.wheelDeltaY < 0) {
			vortex.zoom *= zoomFactor;
		} else {
			vortex.zoom /= zoomFactor;
		}
		vortex.setViewbox(0, 0, window.innerWidth, window.innerHeight);
	});
	
	window.addEventListener("keydown", function (e) {
		if (e.which === "H".charCodeAt(0)) {
			document.querySelector(".info").classList.toggle("hidden");
		} else if (e.ctrlKey || e.which === 17) {
			key.ctrl = true;
			repel.enabled = true;
		}
	});
	
	window.addEventListener("keyup", function (e) {
		if (e.ctrlKey || e.which === 17) {
			key.ctrl = false;
			repel.enabled = false;
		}
	});

/***/ },
/* 1 */
/*!****************************!*\
  !*** ./src/StreamField.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Streamline.js
	 * Streamline is a vector field simulator.
	 * Preview: http://mdciotti.github.io/streamline
	 * Author: Maxwell Ciotti - @mdciotti - http://mdc.io
	 * License: MIT
	 */
	
	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _FieldFeature = __webpack_require__(/*! ./FieldFeature.js */ 2);
	
	var _FieldFeature2 = _interopRequireDefault(_FieldFeature);
	
	var _Streamline = __webpack_require__(/*! ./Streamline.js */ 3);
	
	var _Streamline2 = _interopRequireDefault(_Streamline);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// import Vec2 from './Vec2.js';
	
	var TO_DEGREES = 180 / Math.PI;
	
	var StreamField = function () {
		function StreamField() {
			_classCallCheck(this, StreamField);
	
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
	
	
		_createClass(StreamField, [{
			key: 'getXCoordinate',
			value: function getXCoordinate(x) {
				return (x - this.canvas.width / 2) / this.zoom;
			}
		}, {
			key: 'getYCoordinate',
			value: function getYCoordinate(y) {
				return -(y - this.canvas.height / 2) / this.zoom;
			}
		}, {
			key: 'setSpeed',
			value: function setSpeed(logSpeed) {
				this.speed = Math.pow(10, logSpeed);
				this.log_speed = logSpeed;
			}
		}, {
			key: 'setMotionBlur',
			value: function setMotionBlur(blur) {
				this.opacity = 1.0 - Math.pow(blur, 0.1);
				this.motionBlur = blur;
			}
		}, {
			key: 'setZoom',
			value: function setZoom(z) {
				this.zoom = z;
				// this.setViewbox(null, null, this.canvas.width, this.canvas.height);
				this.viewbox.width = this.canvas.width / this.zoom;
				this.viewbox.height = this.canvas.height / this.zoom;
			}
		}, {
			key: 'setViewbox',
			value: function setViewbox(originX, originY, width, height) {
				this.viewbox.width = typeof width === "number" ? width / this.zoom : this.viewbox.width;
				this.viewbox.height = typeof height === "number" ? height / this.zoom : this.viewbox.height;
				this.viewbox.origin.x = typeof originX === "number" ? originX / this.zoom : this.viewbox.origin.x;
				this.viewbox.origin.y = typeof originY === "number" ? originY / this.zoom : this.viewbox.origin.y;
				this.viewbox.left = this.viewbox.origin.x - this.viewbox.width / 2;
				this.viewbox.bottom = this.viewbox.origin.y - this.viewbox.height / 2;
				this.viewbox.right = this.viewbox.left + this.viewbox.width;
				this.viewbox.top = this.viewbox.bottom + this.viewbox.height;
			}
		}, {
			key: 'translate',
			value: function translate(dx, dy) {
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
		}, {
			key: 'addStream',
			value: function addStream(stream) {
				if ((typeof stream === 'undefined' ? 'undefined' : _typeof(stream)) === "object" && stream instanceof _Streamline2.default) {
					this.streamlines.push(stream);
				} else {
					this.streamlines.push(new _Streamline2.default());
				}
			}
		}, {
			key: 'addFeature',
			value: function addFeature(features) {
				// if (typeof features === "object" && features instanceof FieldFeature) {
				this.features.push(features);
				// } else {
				// TODO: Error logging
				// }
			}
		}, {
			key: 'add',
			value: function add(item) {
				if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === "object") {
					if (item instanceof _FieldFeature2.default) this.features.push(item);else if (item instanceof _Streamline2.default) this.streamlines.push(item);
					// else // TODO: Error logging
				} else {
						// TODO: Error logging
					}
			}
		}, {
			key: 'resetViewbox',
			value: function resetViewbox() {
				var w = this.canvas.width = window.innerWidth;
				var h = this.canvas.height = window.innerHeight;
				this.zoom = 300;
				this.setViewbox(0, 0, w, h);
			}
		}, {
			key: 'init',
			value: function init() {}
		}, {
			key: 'reset',
			value: function reset(init) {
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
		}, {
			key: 'applyFeatures',
			value: function applyFeatures(dt) {
				for (var s = this.streamlines.length - 1; s >= 0; s--) {
					this.streamlines[s].vx = 0;
					this.streamlines[s].vy = 0;
					this.streamlines[s].applyFeatures(this.features);
				}
			}
		}, {
			key: 'update',
			value: function update(dt) {
				// Update features
				for (var i = this.features.length - 1; i >= 0; i--) {
					var feature = this.features[i];
					feature.update(dt);
	
					// Wrap around edges (torus geometry)
					if (this.wrap) {
						while (feature.x < this.viewbox.left) {
							feature.x += this.viewbox.width;
						}while (feature.x > this.viewbox.right) {
							feature.x -= this.viewbox.width;
						}while (feature.y < this.viewbox.bottom) {
							feature.y += this.viewbox.height;
						}while (feature.y > this.viewbox.top) {
							feature.y -= this.viewbox.height;
						}
					}
				}
	
				// Update streamlines
				for (var i = this.streamlines.length - 1; i >= 0; i--) {
					var stream = this.streamlines[i];
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
						while (stream.x < this.viewbox.left) {
							stream.x += this.viewbox.width;
						}while (stream.x > this.viewbox.right) {
							stream.x -= this.viewbox.width;
						}while (stream.y < this.viewbox.bottom) {
							stream.y += this.viewbox.height;
						}while (stream.y > this.viewbox.top) {
							stream.y -= this.viewbox.height;
						}
					}
				}
			}
		}, {
			key: 'getv',
			value: function getv(x, y) {
				var v = { x: 0, y: 0 };
	
				for (var f = this.features.length - 1; f >= 0; f--) {
					var field = this.features[f];
					if (field.enabled) {
						v.x += field.strength * field.getvx(x, y);
						v.y += field.strength * field.getvy(x, y);
					}
				}
	
				return v;
			}
		}, {
			key: 'draw',
			value: function draw(dt) {
				var w = this.canvas.width,
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
					var x = undefined,
					    y = undefined,
					    v = undefined,
					    vx = undefined,
					    vy = undefined,
					    hue = undefined,
					    sat = undefined;
					// Sample parameters
					var n = this.fieldSize;
					// let unit = 1 / n;
					// let s_w = w / n;
					// let s_h = h / n;
					var nx = this.canvas.width / this.fieldSize;
					var ny = this.canvas.height / this.fieldSize;
					var sampleSize = this.fieldSize / this.zoom;
	
					for (var j = 0; j < ny; j++) {
						for (var i = 0; i < nx; i++) {
	
							x = (i * this.fieldSize - this.canvas.width / 2) / this.zoom;
							y = (j * this.fieldSize - this.canvas.height / 2) / this.zoom;
							v = this.getv(x, y);
	
							hue = Math.floor(Math.atan2(v.y, v.x) * TO_DEGREES + 180);
							sat = Math.floor(Math.min(Math.hypot(v.x, v.y) * this.fieldScale, 1) * 100);
							this.ctx.fillStyle = "hsl(" + hue + ", " + sat + "%, 50%)";
							this.ctx.fillRect(x - sampleSize / 2, y - sampleSize / 2, sampleSize, sampleSize);
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
	
					var x = undefined,
					    y = undefined,
					    v = undefined;
					// Sample parameters
					// let n = this.fieldSize;
					// let unit = 1 / n;
					// let max_len = this.fieldScale;
					var scale = 0.01;
					var nx = this.canvas.width / this.fieldSize;
					var ny = this.canvas.height / this.fieldSize;
	
					for (var j = 0; j < ny; j++) {
						for (var i = 0; i < nx; i++) {
	
							x = (i * this.fieldSize - this.canvas.width / 2) / this.zoom;
							y = (j * this.fieldSize - this.canvas.height / 2) / this.zoom;
							v = this.getv(x, y);
	
							this.ctx.moveTo(x - v.x * scale, y - v.y * scale);
							this.ctx.lineTo(x + v.x * scale, y + v.y * scale);
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
	
				for (var i = this.streamlines.length - 1; i >= 0; i--) {
					// this.streamlines[i].draw(this.ctx);
					var stream = this.streamlines[i];
					stream.scale = dt;
					// this.ctx.fillRect(stream.x, stream.y, radius, radius);
					this.ctx.moveTo(stream.x, stream.y);
					this.ctx.lineTo(stream.x + stream.vx * stream.scale, stream.y + stream.vy * stream.scale);
				}
				this.ctx.stroke();
	
				// Draw all features
				if (this.drawFeatures) {
					this.ctx.strokeStyle = "#0000ff";
					this.ctx.beginPath();
					for (var i = this.features.length - 1; i >= 0; i--) {
						var feature = this.features[i];
						if (!feature.enabled) continue;
						var r = Math.abs(feature.strength * 10) / this.zoom;
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
		}, {
			key: 'animate',
			value: function animate(now) {
				var dt = undefined,
				    dt_s = undefined;
	
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
					var x = Math.random() * this.viewbox.width + this.viewbox.left;
					var y = Math.random() * this.viewbox.height + this.viewbox.bottom;
					this.streamlines.push(new _Streamline2.default(x, y));
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
		}, {
			key: 'toggleState',
			value: function toggleState() {
				if (!this.running) {
					requestAnimationFrame(this.animate.bind(this));
					this.running = true;
				} else {
					// this.paused = !this.paused;
				}
			}
		}]);
	
		return StreamField;
	}();

	exports.default = StreamField;

/***/ },
/* 2 */
/*!*****************************!*\
  !*** ./src/FieldFeature.js ***!
  \*****************************/
/***/ function(module, exports) {

	"use strict";
	
	// import Vec2 from './Vec2.js';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var FieldFeature = function () {
		function FieldFeature(properties) {
			_classCallCheck(this, FieldFeature);
	
			this.x = 0;
			this.y = 0;
			// this.pos = new Vec2();
			this.strength = 1;
			this.vx = 0;
			this.vy = 0;
			// this.vel = new Vec2();
			this.enabled = true;
	
			this.Fx = function (x, y) {
				return 0;
			};
			this.Fy = function (x, y) {
				return 0;
			};
	
			if ((typeof properties === "undefined" ? "undefined" : _typeof(properties)) === "object") {
				this.strength = properties.hasOwnProperty("strength") ? properties.strength : this.strength;
				this.Fx = properties.hasOwnProperty("Fx") ? properties.Fx : this.Fx;
				this.Fy = properties.hasOwnProperty("Fy") ? properties.Fy : this.Fy;
				this.x = properties.hasOwnProperty("x") ? properties.x : this.x;
				this.y = properties.hasOwnProperty("y") ? properties.y : this.y;
				this.enabled = properties.hasOwnProperty("enabled") ? properties.enabled : this.enabled;
			}
		}
	
		_createClass(FieldFeature, [{
			key: "getvx",
			value: function getvx(x, y) {
				return this.Fx.call(this, x - this.x, y - this.y);
			}
		}, {
			key: "getvy",
			value: function getvy(x, y) {
				return this.Fy.call(this, x - this.x, y - this.y);
			}
		}, {
			key: "setOrigin",
			value: function setOrigin(x, y) {
				this.x = x;
				this.y = y;
				return this;
			}
		}, {
			key: "setStrength",
			value: function setStrength(s) {
				this.strength = s;
				return this;
			}
		}, {
			key: "clone",
			value: function clone() {
				return new FieldFeature({ Fx: this.Fx, Fy: this.Fy, strength: this.strength });
			}
		}, {
			key: "update",
			value: function update(dt) {
				this.x += this.vx * dt;
				this.y += this.vy * dt;
			}
		}]);
	
		return FieldFeature;
	}();

	exports.default = FieldFeature;

/***/ },
/* 3 */
/*!***************************!*\
  !*** ./src/Streamline.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _FieldFeature = __webpack_require__(/*! ./FieldFeature.js */ 2);
	
	var _FieldFeature2 = _interopRequireDefault(_FieldFeature);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// import Vec2 from './Vec2.js';
	
	var Streamline = function () {
		function Streamline(x, y) {
			_classCallCheck(this, Streamline);
	
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
	
		_createClass(Streamline, [{
			key: "applyFeatures",
			value: function applyFeatures(features) {
				if (features instanceof _FieldFeature2.default) {
					this.vx += features.strength * features.getvx(this.x, this.y);
					this.vy += features.strength * features.getvy(this.x, this.y);
				} else {
					for (var f = features.length - 1; f >= 0; f--) {
						var feature = features[f];
						if (feature.enabled) {
							this.vx += feature.strength * feature.getvx(this.x, this.y);
							this.vy += feature.strength * feature.getvy(this.x, this.y);
						}
					}
				}
			}
		}, {
			key: "update",
			value: function update(dt, dt_last) {
				var dx = this.x - this.x_last;
				var dy = this.y - this.y_last;
				this.x_last = this.x;
				this.y_last = this.y;
				// let dt_ratio = dt / dt_last;
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
	
				// this.vx = 0;
				// this.vy = 0;
			}
		}, {
			key: "draw",
			value: function draw() {
				// this.ctx.moveTo(
				// 	stream.x * w,
				// 	stream.y * h
				// );
				// this.ctx.lineTo(
				// 	(stream.x + stream.vx) * w,
				// 	(stream.y + stream.vy) * h
				// );
			}
		}]);
	
		return Streamline;
	}();

	exports.default = Streamline;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map