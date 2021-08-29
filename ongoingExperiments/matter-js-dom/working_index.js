"use strict";

const debug = true;

const Engine = Matter.Engine,
	Runner = Matter.Runner,
	Bodies = Matter.Bodies,
	Composite = Matter.Composite,
	Constraint = Matter.Constraint,
	Render = Matter.Render,
	Body = Matter.Body;


const machines = document.getElementsByClassName("machine");
walkDOM(machines[0], (elem) => bodyOrPart(elem, createBody, createPart))

// create an engine
const engine = Engine.create({});
engine.world.gravity.y = 0;

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

// // Move the bodies
Matter.Events.on(engine, "beforeUpdate", function (event) {
	const partA = Composite.allBodies(engine.world)[0].parts[1];
	Body.applyForce(Composite.allBodies(engine.world)[0], { x: partA.position.x, y: partA.position.y }, { x: 0.01, y: 0 });
// 	for (let i = 0; i < bodies.length; ++i) {
// 	  const domBody = bodies[i].dom;
// 	  const matterBody = bodies[i].matter;
  
// 	  if (!domBody.classList.contains("active")) continue;
  
// 	  const { x, y } = matterBody.position;
// 	  const { classList } = domBody;
  
// 	  if (classList.contains("moveUp")) {
// 		Body.applyForce(matterBody, { x, y }, { x: 0, y: -FORCE });
// 	  }
// 	  if (classList.contains("moveRight")) {
// 		Body.applyForce(matterBody, { x, y }, { x: FORCE, y: 0 });
// 	  }
// 	  if (classList.contains("moveBottom")) {
// 		Body.applyForce(matterBody, { x, y }, { x: 0, y: FORCE });
// 	  }
// 	  if (classList.contains("moveLeft")) {
// 		Body.applyForce(matterBody, { x, y }, { x: -FORCE, y: 0 });
// 	  }
// 	}
  });

console.log('matter bodies:', matterBodies)
  
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