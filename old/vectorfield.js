
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
