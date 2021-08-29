const topEngineElements = document.getElementsByClassName("up");
const rightEngineElements = document.getElementsByClassName("right");
const bottomEngineElements = document.getElementsByClassName("bottom");
const leftEngineElements = document.getElementsByClassName("left");

document.addEventListener("keydown", (e) => {
	console.log('keydown', e.code);
  if (e.code === 'ArrowUp') {
    for (let i = 0; i < bottomEngineElements.length; i++) {
      bottomEngineElements[i].classList.add('active');
    }
  }
  if (e.code === 'ArrowRight') {
    for (let i = 0; i < rightEngineElements.length; i++) {
      rightEngineElements[i].classList.add('active');
    }
  }
  if (e.code === 'ArrowDown') {
    for (let i = 0; i < topEngineElements.length; i++) {
      topEngineElements[i].classList.add('active');
    }
  }
  if (e.code === 'ArrowLeft') {
    for (let i = 0; i < leftEngineElements.length; i++) {
      leftEngineElements[i].classList.add('active');
    }
  }
});

document.addEventListener("keyup", (e) => {
	console.log('keyup:', e.code);
  if (e.code === 'ArrowUp') {
    for (let i = 0; i < bottomEngineElements.length; i++) {
      bottomEngineElements[i].classList.remove('active');
    }
  }
  if (e.code === 'ArrowRight') {
    for (let i = 0; i < rightEngineElements.length; i++) {
      rightEngineElements[i].classList.remove('active');
    }
  }
  if (e.code === 'ArrowDown') {
    for (let i = 0; i < topEngineElements.length; i++) {
      topEngineElements[i].classList.remove('active');
    }
  }
  if (e.code === 'ArrowLeft') {
    for (let i = 0; i < leftEngineElements.length; i++) {
      leftEngineElements[i].classList.remove('active');
    }
  }
});