"use strict";

const debug = true;

const Engine = Matter.Engine,
	Runner = Matter.Runner,
	Bodies = Matter.Bodies,
	Composite = Matter.Composite,
	Constraint = Matter.Constraint,
	Render = Matter.Render,
	Body = Matter.Body,
    Vector = Matter.Vector;

const machines = document.getElementsByClassName("machine");
walkDOM(machines[0], (elem) => bodyOrPart(elem, createBody, createPart))

// create an engine
const engine = Engine.create({});
engine.world.gravity.y = 0;
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");


// Applies force to body in one of these directios relative to it's initial bottom: forward, right, back, left
// Force is proportional to body area
function moveBody(body, bodyCenter, direction, forceMultiplier = 1) {
    let forceApplicationPoint;
    if (direction === 'top') {
        forceApplicationPoint = Vector.add(bodyCenter, {x: 0, y: 50});
    }
    if (direction === 'right') {
        forceApplicationPoint = Vector.sub(bodyCenter, {x: 50, y: 0});
    }
    if (direction === 'bottom') {
        forceApplicationPoint = Vector.sub(bodyCenter, {x: 0, y: 50});
    }
    if (direction === 'left') {
        forceApplicationPoint = Vector.add(bodyCenter, {x: 50, y: 0});
    }
    let forceApplicationPointRotated = Vector.rotateAbout(forceApplicationPoint, body.angle, bodyCenter);
    var deltaVector = Matter.Vector.sub(bodyCenter, forceApplicationPointRotated);
	var normalizedDelta = Matter.Vector.normalise(deltaVector);
	var forceVector = Matter.Vector.mult(normalizedDelta, 0.001 * forceMultiplier);

    Body.applyForce(body, forceApplicationPointRotated, forceVector);
    return forceVector;
}

// // Move the bodies
Matter.Events.on(engine, "beforeUpdate", function (event) {
    allBodyParts.forEach(body => {
        const bodyCenter = {x: body.position.x, y: body.position.y};
        if (body.domElement.classList.contains("active")) {
            if (body.domElement.classList.contains("top")) {
                moveBody(body.parent, bodyCenter, 'top')
            }
            if (body.domElement.classList.contains("right")) {
                moveBody(body.parent, bodyCenter, 'right')
            }
            if (body.domElement.classList.contains("bottom")) {
                moveBody(body.parent, bodyCenter, 'bottom')
            }
            if (body.domElement.classList.contains("left")) {
                moveBody(body.parent, bodyCenter, 'left')
            }
        }
    })
});

// add all of the bodies to the world
Composite.add(engine.world, matterBodies);

function renderDOM() {
	let renderedBodies = Composite.allBodies(engine.world);
	for (let i = 0; i < renderedBodies.length; i += 1) {
		const renderedBody = renderedBodies[i];
		// const domElem = bodies[i].dom;

		// domElem.style.left = `${renderedBodies[i].position.x}px`;
		// domElem.style.top = `${renderedBodies[i].position.y}px`;
	}
}

// TODO move to RAF when basic bugs are solved
setInterval(() => {
	renderDOM();
}, 50);

if (debug) {
	let render = Render.create({
		element: document.body,
		engine: engine,
		options: {
			width: 1200,
			height: 1200,
		},
	});
	Render.run(render);
}

const runner = Runner.create();
Runner.run(runner, engine);
