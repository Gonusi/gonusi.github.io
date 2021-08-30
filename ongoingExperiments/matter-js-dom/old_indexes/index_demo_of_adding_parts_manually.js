// module aliases
const Engine = Matter.Engine,
	Runner = Matter.Runner,
	Bodies = Matter.Bodies,
	Composite = Matter.Composite,
	Constraint = Matter.Constraint,
	Render = Matter.Render,
	Body = Matter.Body;

const FORCE = 0.005;
const debug = true;

if (debug) {
	document.body.classList.add("debug");
}

const bodyA = Bodies.rectangle(100, 100, 100, 100);
const bodyB = Bodies.rectangle(100, 300, 100, 100);
const bodyC = Bodies.rectangle(100, 500, 100, 100, {width: 100, height: 100, kasparoCustom: true});

const mainBody = Bodies.rectangle(100, 150, 100, 100);

// tested if can be added separately (it can) - you could just pass one larger aray FIY
Body.setParts(mainBody, [bodyA]);
Body.setParts(mainBody, [bodyB]);
// What happens? It's fine, no duplication etc.
Body.setParts(mainBody, [bodyC, bodyA]);

// create an engine
const engine = Engine.create({});
engine.world.gravity.y = 0;

const canvas = document.createElement("canvas"),
	context = canvas.getContext("2d");

Body.setParts(mainBody, [bodyA, bodyB, bodyC]);

// add all of the bodies to the world
Composite.add(engine.world, [mainBody]);

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

console.log(Composite.allBodies(engine.world)[0].parts)
console.log(Composite.allBodies(engine.world)[0].bounds)