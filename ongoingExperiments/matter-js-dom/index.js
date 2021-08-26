// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Body = Matter.Body;

var part = {};

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine,
});

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

let cart = bodyWithParts(200, 150, { isStatic: false, friction: 0.0 });

function bodyWithParts(x, y, options) {
  options = options || {};
  let w = 4;
  let movingPart = null;
  options.parts = [];
  movingPart = Matter.Bodies.rectangle(w, 20, 5, 20);
  console.log("moving part:", movingPart);
  part.part = movingPart;
  console.log("innerPart:", part);
  options.parts.push(movingPart);
  options.parts.push(Matter.Bodies.rectangle(40 - w, 20, 5, 20));
  options.parts.push(Matter.Bodies.rectangle(20, 40 - w, 50, 5));
  let body = Matter.Body.create(options);
  Matter.Body.setPosition(body, { x: x, y: y a});

  Matter.Events.on(engine, "beforeUpdate", function (event) {
    const movingPart = Composite.allBodies(engine.world)?.[0];
    if (typeof part.part !== "undefined") {
      Body.applyForce(part.part, { x: cart.position.x, y: cart.position.y }, { x: 0, y: -0.001 });
    }
    console.log("part:", part.part);
  });

  return body;
}

// add all of the bodies to the world
Composite.add(engine.world, [cart, boxB, ground]);

console.log(Composite.allBodies(engine.world));

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

// https://www.gamedevelopment.blog/matter-js-basics-developing-games/
