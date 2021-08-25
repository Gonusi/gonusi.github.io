// module aliases
const Engine = Matter.Engine,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Constraint = Matter.Constraint,
  Render = Matter.Render,
  Body = Matter.Body;

const FORCE = 0.005;
const debug = false;

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
let bodies = [];
const domBlocks = document.getElementsByClassName("block");
for (let i = 0; i < domBlocks.length; ++i) {
  const { top, left } = domBlocks[i].style;
  const isStatic = domBlocks[i].classList.contains("static");
  const width = domBlocks[i].offsetWidth;
  const height = domBlocks[i].offsetHeight;

  bodies.push({
    dom: domBlocks[i],
    matter: Bodies.rectangle(Number(left.replace("px", "")) + width / 2, Number(top.replace("px", "")) + height / 2, width, height, {
      isStatic,
    }),
  });
}

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

// // Create constraints
// let constraints; // TODO this will be an []
// const constraintDomBlocks = document.querySelectorAll(".constraint");
// for (i = 0; i < constraintDomBlocks.length; ++i) {
//   const constraint = constraintDomBlocks[i];
//   const directConstraintChildren = constraint.children;

//   // Need to map dom to matterBodies and pass matterBodies to constraint

//   console.log("direct constraint children:", directConstraintChildren);

//   constraints = Constraint.create({
//     bodyA: directConstraintChildren[0],
//     bodyB: directConstraintChildren[1],
//   });
// }
console.log(bodies.map(({ matter }) => matter));

// add all of the bodies to the world
Composite.add(
  engine.world,
  bodies.map(({ matter }) => matter)
);

function renderDOM() {
  var renderedBodies = Composite.allBodies(engine.world);
  for (var i = 0; i < renderedBodies.length; i += 1) {
    const renderedBody = renderedBodies[i];
    const domElem = domBlocks.item(i);

    domElem.style.left = `${renderedBodies[i].position.x}px`;
    domElem.style.top = `${renderedBodies[i].position.y}px`;
  }
}

// TODO move to RAF when basic bugs are solved
setInterval(() => {
  renderDOM();
}, 10);

if (debug) {
  var render = Render.create({
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
