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

// add all of the bodies to the world
Composite.add(engine.world, [...matterBodies]);

function render() {
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
  render();
}, 50);

// create runner
var runner = Runner.create();

// // run the engine
Runner.run(runner, engine);
