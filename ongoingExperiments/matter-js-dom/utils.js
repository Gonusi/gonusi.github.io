const getTopLevelMachineParentElement = (element) => {
  if (element.parentElement.tagName === "body") {
    throw new Error("Top level parent not found, reached body}");
  }
  if (element.parentElement.classList.contains("machine")) {
    return element;
  } else {
    return getTopLevelMachineParentElement(element.parentElement);
  }
};

const getBodyDataFromElement = (element) => {
  const { width: widthRaw, height: heightRaw, left: xRaw, top: yRaw } = element.style;
  const width = parseInt(widthRaw);
  const height = parseInt(heightRaw);
  // When creating body in matter-js, need to set its center position (as opposed to top left corner in css)
  const x = parseInt(xRaw) + width / 2;
  const y = parseInt(yRaw) + height / 2;
  const isStatic = element.classList.contains("static");
  return [x, y, width, height, { isStatic, domElement: element, width, height }];
};

const getWidth = (body) => {
  const { min, max } = body.bounds;
  const width = max.x - min.x;
  return width;
};

const getHeight = (body) => {
  const { min, max } = body.bounds;
  const width = max.y - min.y;
  return width;
};
