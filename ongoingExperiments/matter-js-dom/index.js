// module aliases
var Engine = Matter.Engine,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Render = Matter.Render,
  Body = Matter.Body;

const FORCE = 0.001;

// create an engine
var engine = Engine.create();
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
    Number(left.replace("px", "")),
    Number(top.replace("px", "")),
    width,
    height,
    {
      isStatic,
    },
  ]);
}

console.log("bodies collected from dom:", bodies);

const matterBodies = bodies.map((body) => Bodies.rectangle(...body));

Matter.Events.on(engine, "beforeUpdate", function (event) {
  for (i = 0; i < domBlocks.length; ++i) {
    const domBlock = domBlocks[i];
    const renderedBody = matterBodies[i];
    if (domBlock.classList.contains("moveUp")) {
      Body.applyForce(renderedBody, { x: renderedBody.position.x, y: renderedBody.position.y }, { x: 0, y: -FORCE });
    }
    if (domBlock.classList.contains("moveRight")) {
      Body.applyForce(renderedBody, { x: renderedBody.position.x, y: renderedBody.position.y }, { x: FORCE, y: 0 });
    }
    if (domBlock.classList.contains("moveBottom")) {
      Body.applyForce(renderedBody, { x: renderedBody.position.x, y: renderedBody.position.y }, { x: 0, y: FORCE });
    }
    if (domBlock.classList.contains("moveLeft")) {
      Body.applyForce(renderedBody, { x: renderedBody.position.x, y: renderedBody.position.y }, { x: -FORCE, y: 0 });
    }
  }
});

// add all of the bodies to the world
Composite.add(engine.world, [...matterBodies]);

var render = Render.create({
  element: document.body,
  engine: engine,
});

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

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// // run the engine
Runner.run(runner, engine);