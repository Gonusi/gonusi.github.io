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
function moveBody(body, movedPart, forceApplicationSide, forceMultiplier = 1) {
    let forceApplicationPoint;
    const bodyCenter = {x: movedPart.position.x, y: movedPart.position.y};
    if (forceApplicationSide === 'bottom') {
        forceApplicationPoint = Vector.add(bodyCenter, {x: 0, y: movedPart.height / 2});
    }
    if (forceApplicationSide === 'right') {
        forceApplicationPoint = Vector.sub(bodyCenter, {x: movedPart.width / 2, y: 0});
    }
    if (forceApplicationSide === 'top') {
        forceApplicationPoint = Vector.sub(bodyCenter, {x: 0, y: movedPart.height / 2});
    }
    if (forceApplicationSide === 'left') {
        forceApplicationPoint = Vector.add(bodyCenter, {x: movedPart.width / 2, y: 0});
    }
    let forceApplicationPointRotated = Vector.rotateAbout(forceApplicationPoint, body.angle, bodyCenter);
    var deltaVector = Matter.Vector.sub(bodyCenter, forceApplicationPointRotated);
	var normalizedDelta = Matter.Vector.normalise(deltaVector);
	var forceVector = Matter.Vector.mult(normalizedDelta, movedPart.area * 0.000001 * forceMultiplier);

    Body.applyForce(body, forceApplicationPointRotated, forceVector);
    return forceVector;
}

// // Move the bodies
Matter.Events.on(engine, "beforeUpdate", function (event) {
    allBodyParts.forEach(body => {
        const bodyCenter = {x: body.position.x, y: body.position.y};
        if (body.domElement.classList.contains("active")) {
            if (body.domElement.classList.contains("top")) {
                moveBody(body.parent, body, 'top')
            }
            if (body.domElement.classList.contains("right")) {
                moveBody(body.parent, body, 'right')
            }
            if (body.domElement.classList.contains("bottom")) {
                console.log('active bottom engine')
                moveBody(body.parent, body, 'bottom')
            }
            if (body.domElement.classList.contains("left")) {
                moveBody(body.parent, body, 'left')
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
			width: 800,
			height: 800,
		},
	});
	Render.run(render);
}

console.log(matterBodies)

const runner = Runner.create();
Runner.run(runner, engine);
