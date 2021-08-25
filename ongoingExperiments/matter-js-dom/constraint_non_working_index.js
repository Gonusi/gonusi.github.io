// module aliases
var Engine = Matter.Engine,
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
var engine = Engine.create({});
engine.world.gravity.y = 0;

var canvas = document.createElement("canvas"),
  context = canvas.getContext("2d");

// Convert DOM elements to matterjs bodies
let bodies = [];
const domBlocks = document.querySelectorAll(".block");
for (i = 0; i < domBlocks.length; ++i) {
  const { top, left } = domBlocks[i].style;
  const isStatic = domBlocks[i].classList.contains("static");
  const width = domBlocks[i].offsetWidth;
  const height = domBlocks[i].offsetHeight;
  bodies.push([
    Number(left.replace("px", "")) + width / 2,
    Number(top.replace("px", "")) + height / 2,
    width,
    height,
    {
      isStatic,
    },
  ]);
}

const matterBodies = bodies.map((body) => Bodies.rectangle(...body));
console.log(matterBodies);

Matter.Events.on(engine, "beforeUpdate", function (event) {
  for (i = 0; i < domBlocks.length; ++i) {
    const domBlock = domBlocks[i];
    const isActive = domBlock.classList.contains("active");
    const renderedBody = matterBodies[i];
    if (domBlock.classList.contains("moveUp") && isActive) {
      Body.applyForce(renderedBody, { x: renderedBody.position.x, y: renderedBody.position.y }, { x: 0, y: -FORCE });
    }
    if (domBlock.classList.contains("moveRight") && isActive) {
      Body.applyForce(renderedBody, { x: renderedBody.position.x, y: renderedBody.position.y }, { x: FORCE, y: 0 });
    }
    if (domBlock.classList.contains("moveBottom") && isActive) {
      Body.applyForce(renderedBody, { x: renderedBody.position.x, y: renderedBody.position.y }, { x: 0, y: FORCE });
    }
    if (domBlock.classList.contains("moveLeft") && isActive) {
      Body.applyForce(renderedBody, { x: renderedBody.position.x, y: renderedBody.position.y }, { x: -FORCE, y: 0 });
    }
  }
});

// add all of the bodies to the world
Composite.add(engine.world, [...matterBodies]);

function renderDOM() {
  // During render I have to check if bodies are toggling power ON / OFF
  var renderedBodies = Composite.allBodies(engine.world);
  //   console.log(renderedBodies);
  for (var i = 0; i < renderedBodies.length; i += 1) {
    const renderedBody = renderedBodies[i];
    const domElem = domBlocks.item(i);

    domElem.style.left = `${renderedBodies[i].position.x}px`;
    domElem.style.top = `${renderedBodies[i].position.y}px`;
  }
}

setInterval(() => {
  //   console.log(matterBodies[0].position.x);
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
  // run the renderer
  Render.run(render);
}

// create runner
var runner = Runner.create();

// // run the engine
Runner.run(runner, engine);
