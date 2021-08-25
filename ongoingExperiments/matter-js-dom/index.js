// module aliases
var Engine = Matter.Engine,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

var canvas = document.createElement("canvas"),
  context = canvas.getContext("2d");

const boxDimensions = { width: 80, height: 80 };
const groundDimensions = { width: 810, height: 60 };

// create two boxes and a ground
const bodies = [
  [0, 100, 80, 80],
  [200, 200, 80, 80],
  [0, 600, 810, 60, { isStatic: true }],
];

const matterBodies = bodies.map((body) => Bodies.rectangle(...body));

// add all of the bodies to the world
Composite.add(engine.world, [...matterBodies]);

let domBodies = [];
// add bodies to DOM
for (var i = 0; i < bodies.length; i += 1) {
  var body = bodies[i];
  console.log(body);
  const newDiv = document.createElement("div");
  newDiv.classList.add("box");
  newDiv.style.width = `${body[2]}px`;
  newDiv.style.height = `${body[3]}px`;
  newDiv.id = i;
  domBodies.push(newDiv);
  document.body.appendChild(newDiv);
}

function render() {
  var renderedBodies = Composite.allBodies(engine.world);

  for (var i = 0; i < renderedBodies.length; i += 1) {
    const renderedBody = renderedBodies[i];
    const domElem = domBodies[renderedBody.id - 1];
    domElem.style.left = `${renderedBodies[i].position.x}px`;
    domElem.style.top = `${renderedBodies[i].position.y}px`;
  }
}

setInterval(() => {
  render();
}, 10);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
