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

// create an engine
const engine = Engine.create({});
engine.world.gravity.y = 0;

const canvas = document.createElement("canvas"),
  context = canvas.getContext("2d");

// Read DOM structure
// Build a list mapping dom to matter body
// TODO implement faster algorithm to traverse constraints > block trees
let bodies = [];
const domBlocks = document.getElementsByClassName("block");
const constraints = Array.from(document.getElementsByClassName("constraint"));
for (let i = 0; i < domBlocks.length; ++i) {
  let constraintGroupIndex;
  const { top, left } = domBlocks[i].style;
  const isStatic = domBlocks[i].classList.contains("static");
  const width = domBlocks[i].offsetWidth;
  const height = domBlocks[i].offsetHeight;

  for (let c = 0; c < constraints.length; ++c) {
    if (constraints[c].contains(domBlocks[i])) {
      constraintGroupIndex = c;
    }
  }

  bodies.push({
    isConstraint: false,
    constraintGroupIndex,
    dom: domBlocks[i],
    matter: Bodies.rectangle(Number(left.replace("px", "")) + width / 2, Number(top.replace("px", "")) + height / 2, width, height, {
      isStatic,
    }),
  });
}

constraints.forEach((constrain, index) => {
  bodies.push({
    isConstrain: true,
    constraintGroup: index,
    dom: constrain,
    matter: Bodies.rectangle(220, 300, 400, 400, {
      isSensor: true,
      mass: 0,
    }),
  });
});

console.log("bodies", bodies);

bodies.forEach((body) => {
  if (!body.isConstrain && body.constraintGroupIndex !== undefined) {
    let constraint = bodies.find((elem) => elem.isConstrain && elem.constraintGroup === body.constraintGroupIndex).matter;
    console.log("constraint.parts", constraint.parts);
    Matter.Body.setParts(constraint, [...constraint.parts, body.matter]);
  }
});

// Move the bodies
Matter.Events.on(engine, "beforeUpdate", function (event) {
  for (let i = 0; i < bodies.length; ++i) {
    const domBody = bodies[i].dom;
    const matterBody = bodies[i].matter;

    if (!domBody.classList.contains("active")) continue;

    const { x, y } = matterBody.position;
    const { classList } = domBody;

    if (classList.contains("moveUp")) {
      Body.applyForce(matterBody, { x, y }, { x: 0, y: -FORCE });
    }
    if (classList.contains("moveRight")) {
      Body.applyForce(matterBody, { x, y }, { x: FORCE, y: 0 });
    }
    if (classList.contains("moveBottom")) {
      Body.applyForce(matterBody, { x, y }, { x: 0, y: FORCE });
    }
    if (classList.contains("moveLeft")) {
      Body.applyForce(matterBody, { x, y }, { x: -FORCE, y: 0 });
    }
  }
});

// add all of the bodies to the world
Composite.add(engine.world, [...bodies.map(({ matter }) => matter)]);

function renderDOM() {
  let renderedBodies = Composite.allBodies(engine.world);
  for (let i = 0; i < renderedBodies.length; i += 1) {
    const renderedBody = renderedBodies[i];
    const domElem = bodies[i].dom;

    domElem.style.left = `${renderedBodies[i].position.x}px`;
    domElem.style.top = `${renderedBodies[i].position.y}px`;
  }
}

// TODO move to RAF when basic bugs are solved
setInterval(() => {
  renderDOM();
}, 10);

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

// Use parts intead of constraints:
// TODO
// https://stackoverflow.com/questions/61330579/prevent-relative-rotation-in-matter-js-constraint

// let cart = bodyWithParts(200, 150, { isStatic: true, friction: 0.0 });

// function bodyWithParts(x, y, options) {
//   options = options || {}
//   let w = 4;
//   options.parts = [];
//   options.parts.push(Matter.Bodies.rectangle(w, 20, 5, 20));
//   options.parts.push(Matter.Bodies.rectangle(40 - w, 20, 5, 20));
//   options.parts.push(Matter.Bodies.rectangle(20, 40 - w, 50, 5))
//   let body = Matter.Body.create(options)
//   Matter.Body.setPosition(body, { x: x, y: y });
//   return body;
// }
