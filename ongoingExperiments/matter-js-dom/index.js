"use strict";

const debug = false;

const Engine = Matter.Engine,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Constraint = Matter.Constraint,
  Render = Matter.Render,
  Body = Matter.Body,
  Vector = Matter.Vector;

const machines = document.getElementsByClassName("machine");
walkDOM(machines[0], (elem) => bodyOrPart(elem, createBody, createPart));

// create an engine
const engine = Engine.create({});
engine.world.gravity.y = 0;
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

// Applies force to body in one of these directios relative to it's initial bottom: forward, right, back, left
// Force is proportional to body area
function moveBody(body, movedPart, forceApplicationSide, forceMultiplier = 1) {
  let forceApplicationPoint;
  const bodyCenter = { x: movedPart.position.x, y: movedPart.position.y };
  if (forceApplicationSide === "bottom") {
    forceApplicationPoint = Vector.add(bodyCenter, { x: 0, y: movedPart.height / 2 });
  }
  if (forceApplicationSide === "right") {
    forceApplicationPoint = Vector.sub(bodyCenter, { x: movedPart.width / 2, y: 0 });
  }
  if (forceApplicationSide === "top") {
    forceApplicationPoint = Vector.sub(bodyCenter, { x: 0, y: movedPart.height / 2 });
  }
  if (forceApplicationSide === "left") {
    forceApplicationPoint = Vector.add(bodyCenter, { x: movedPart.width / 2, y: 0 });
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
  allBodyParts.forEach((body) => {
    const bodyCenter = { x: body.position.x, y: body.position.y };
    if (body.domElement.classList.contains("active")) {
      if (body.domElement.classList.contains("top")) {
        moveBody(body.parent, body, "top");
      }
      if (body.domElement.classList.contains("right")) {
        moveBody(body.parent, body, "right");
      }
      if (body.domElement.classList.contains("bottom")) {
        moveBody(body.parent, body, "bottom");
      }
      if (body.domElement.classList.contains("left")) {
        moveBody(body.parent, body, "left");
      }
    }
  });
});

// add all of the bodies to the world
Composite.add(engine.world, matterBodies);

function renderDOM() {
  for (let i = 0; i < allBodyParts.length; i++) {
    const matterBody = allBodyParts[i];
    // if not a "parent" body - we only render separate parts
    if (matterBody.parts.length === 1) {
      //   const width = getWidth(matterBody);
      //   const height = getHeight(matterBody);
      const width = Number(allBodyParts[i].domElement.style.width.replace("px", ""));
      const height = Number(allBodyParts[i].domElement.style.height.replace("px", ""));

      const left = allBodyParts[i].position.x - width / 2; // TODO these seem only correct  for top  down position
      const top = allBodyParts[i].position.y - height / 2; // What to do in other positions? Horizontally?

      // TODO move these to init or something
      matterBody.domElement.style.left = "0px";
      matterBody.domElement.style.top = "0px";

      // matterBody.domElement.style.width = `${width}px`;
      // matterBody.domElement.style.height = `${height}px`;
      //   matterBody.domElement.style.left = `${left}px`;
      //   matterBody.domElement.style.top = `${top}px`;
      console.log("matterBody angle", matterBody.parent.angle);
      matterBody.domElement.style.transform = `translate(${left}px,${top}px) rotate(${matterBody.parent.angle}rad)`;
      //   matterBody.domElement.style.transform = `rotate(${matterBody.parent.angle}rad)`;

      // const partWidth = getWidth(allBodyParts[i]);
      // const partHeight = getHeight(allBodyParts[i]);
      // allBodyParts[i].domElement.style.left = `${allBodyParts[i].position.x}px` - partWidth / 2;
      // allBodyParts[i].domElement.style.top = `${allBodyParts[i].position.y}px` - partHeight / 2;
    }
  }
  // TODO need to rotate whole parent group, not separte bodies, but for this need to get bounding box

  for (let i = 0; i < matterBodies.length; i++) {
    // const matterBody = matterBodies[i];
    // const width = getWidth(matterBody);
    // const height = getHeight(matterBody);
    // const left = allBodyParts[i].position.x - width / 2;
    // const top = allBodyParts[i].position.y - height / 2;
    // matterBody.domElement.style.width = `${width}px`;
    // matterBody.domElement.style.height = `${height}px`;
    // matterBody.domElement.style.top = `${left}px`;
    // matterBody.domElement.style.left = `${top}px`;
    // matterBody.domElement.style.transform = `rotate(${matterBody.angle * 180 * Math.PI}deg`;
    // console.log(
    //   "matterBody positioning working:",
    //   i,
    //   matterBody.domElement,
    //   "width",
    //   partWidth,
    //   "height",
    //   partHeight,
    //   "top",
    //   cssTop,
    //   "left",
    //   cssLeft
    // );
    // console.log("bounds", matterBody.bounds);
    // const height = matterBody.bounds.max.y - matterBody.bounds.min.y;
    // const width = matterBody.bounds.max.x - matterBody.bounds.min.x;
    // const left = matterBody.position.x + width / 2;
    // const top = matterBody.position.y + height / 2;
    // matterBody.domElement.style.height = height;
    // matterBody.domElement.style.width = width;
    // matterBody.domElement.style.top = top;
    // matterBody.domElement.style.left = left;
    // TODO THIS ROTATION APPROACH DOESN'T WORK WELL
    // I NEED TO TRACK POSITION AND ROTATION OF EACH PART, AND REPLICATE IN DOM
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
      width: 800,
      height: 800,
    },
  });
  Render.run(render);
}

// console.log(matterBodies)

const runner = Runner.create();
Runner.run(runner, engine);

// console.log("AllBodies:", Composite.allBodies(engine.world));
// console.log("Body0 parts:", Composite.allBodies(engine.world)[0].parts);
// console.log("Body0 bounds:", Composite.allBodies(engine.world)[0].bounds);
