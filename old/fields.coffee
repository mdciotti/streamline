vortex = new StreamField()
wasPaused = vortex.paused
zoomFactor = 0.8
mouse =
	x: 0
	y: 0
	lastx: 0
	lasty: 0
	dx: 0
	dy: 0
	down: false

key =
	ctrl: false

field = new VectorField
	Fx: (x, y) -> x
	Fy: (x, y) -> -y
	strength: 1

field2 = new VectorField
	Fx: (x, y) -> y
	Fy: (x, y) -> x
	strength: 1

ccw = new VectorField
	Fx: (x, y) -> -y
	Fy: (x, y) -> x
	strength: 1

ccw2 = new VectorField
	Fx: (x, y) -> -y / Math.hypot(x, y)
	Fy: (x, y) -> x / Math.hypot(x, y)
	strength: 1

ccw3 = new VectorField
	Fx: (x, y) -> -y / Math.hypot(x, y) / Math.exp((x*x + y*y) * 2)
	Fy: (x, y) -> x / Math.hypot(x, y) / Math.exp((x*x + y*y) * 2)
	strength: 1

suck = new VectorField
	Fx: (x, y) -> -x / Math.hypot(x, y)
	Fy: (x, y) -> -y / Math.hypot(x, y)
	strength: 1

suck2 = new VectorField
	Fx: (x, y) -> -x
	Fy: (x, y) -> -y
	strength: 1

flowField = new VectorField
	Fx: (x, y) -> 1

wave = new VectorField
	Fy: (x, y) -> Math.sin(Math.PI*x)
	strength: 0.2

repel = new VectorField
	Fx: (x, y) -> x / Math.hypot(x, y) / Math.exp((x*x + y*y) * 8)
	Fy: (x, y) -> y / Math.hypot(x, y) / Math.exp((x*x + y*y) * 8)
	strength: 2,
	enabled: false


# vortex.addField(ccw3)
# vortex.addField(flowField)
# vortex.addField(wave)
# vortex.addField(repel)

window.addEventListener("load", function (e) {
	vortex.canvas.width = window.innerWidth
	vortex.canvas.height = window.innerHeight
	document.body.appendChild(vortex.canvas)
	vortex.setViewbox(0, 0, window.innerWidth, window.innerHeight)
	# vortex.fieldLines = true
	vortex.fieldSize = 40
	vortex.lineWidth = 1.5
	vortex.setMotionBlur(0.8)
	vortex.wrap = true
	vortex.streamCount = 1000
	vortex.background = "#FF6060"
	vortex.foreground = "#FFFFFF"
	vortex.setSpeed(-0.5)
	vortex.toggleState()

	vortex.init = () ->
		for i in [0..10]
			field = ccw3.clone()
			field.x = vortex.getXCoordinate(Math.random() * vortex.canvas.width)
			field.y = vortex.getYCoordinate(Math.random() * vortex.canvas.height)
			field.strength = Math.random() < 0.5 ? -1 : 1
			vortex.addField(field)

		vortex.addField(repel)

	vortex.reset()

	vortex.canvas.addEventListener "mousedown", (e) ->
		mouse.down = true

	vortex.canvas.addEventListener "mouseup", (e) ->
		mouse.down = false

	vortex.canvas.addEventListener "mousemove", (e) ->
		mouse.lastx = mouse.x
		mouse.lasty = mouse.y
		mouse.x = e.clientX
		mouse.y = e.clientY
		mouse.dx = mouse.x - mouse.lastx
		mouse.dy = mouse.y - mouse.lasty
		if (mouse.down)
			vortex.translate(mouse.dx, mouse.dy)
		repel.x = vortex.getXCoordinate(mouse.x)
		repel.y = vortex.getYCoordinate(mouse.y)

	gui = new dat.GUI()
	style = gui.addFolder("Style")
	style.addColor(vortex, "background")
	style.addColor(vortex, "foreground")
	style.add(vortex, "motionBlur", 0, 1).step(0.01).onChange(vortex.setMotionBlur.bind(vortex))
	style.add(vortex, "lineWidth", 0, 10).step(0.1)
	style.add(vortex, "transparent")
	# style.open()

	field = gui.addFolder("Field Options")
	field.add(vortex, "fieldGradient")
	field.add(vortex, "fieldLines")
	field.add(vortex, "fieldSize", 0, 100).step(2)
	field.add(vortex, "fieldScale", 0, 1).step(0.1)
	# field.open()

	# flow = gui.addFolder("Flow Options")
	# flow.add(flowField, "strength", -5, 5).step(0.5)
	# flow.add(wave, "strength", -5, 5).step(0.5)
	# flow.add(repel, "strength", -5, 5).step(0.5)
	# flow.open()

	gui.add(vortex, "zoom", 0, 1000).step(10).listen().onChange(vortex.setZoom.bind(vortex))
	gui.add(vortex, "log_speed", -1, 1).step(0.01).onChange(vortex.setSpeed.bind(vortex))
	gui.add(vortex, "lifeSpan", 0, 10).step(1)
	gui.add(vortex, "streamCount", 0, 1000).step(10)
	gui.add(vortex, "wrap")
	gui.add(vortex, "paused").listen()
	gui.add(vortex, "reset")
})

window.addEventListener("focus", function (e) {
	vortex.paused = wasPaused
})

window.addEventListener("blur", function (e) {
	wasPaused = vortex.paused
	vortex.paused = true
})

window.addEventListener("mousewheel", function (e) {
	if (e.wheelDeltaY < 0) {
		vortex.zoom *= zoomFactor
	} else {
		vortex.zoom /= zoomFactor
	}
	vortex.setViewbox(0, 0, window.innerWidth, window.innerHeight)
})

window.addEventListener("keydown", function (e) {
	if (e.which === "H".charCodeAt(0)) {
		document.querySelector(".info").classList.toggle("hidden")
	} else if (e.ctrlKey || e.which === 17) {
		key.ctrl = true
		repel.enabled = true
	}
})

window.addEventListener("keyup", function (e) {
	if (e.ctrlKey || e.which === 17) {
		key.ctrl = false
		repel.enabled = false
	}
})
