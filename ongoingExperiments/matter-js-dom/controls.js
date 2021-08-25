const elementsMovingRight = document.getElementsByClassName("moveRight");
console.log(elementsMovingRight);

document.addEventListener("mousedown", () => {
  for (i = 0; i < elementsMovingRight.length; ++i) {
    console.log("mousedown");
    elementsMovingRight[i].classList.add("active");
  }
});

document.addEventListener("mouseup", () => {
  for (i = 0; i < elementsMovingRight.length; ++i) {
    console.log("mouseup");
    elementsMovingRight[i].classList.remove("active");
  }
});
