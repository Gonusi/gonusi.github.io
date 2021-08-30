var walkDOM = function (elem, func) {
	if (elem.nodeType !== 1) return;
	func(elem); //What does this do?
	elem = elem.firstChild;
	while (elem) {
		walkDOM(elem, func);
		elem = elem.nextSibling;
	}
};

var bodyOrPart = function (elem, bodyFunc, partFunc) {
	if (elem.classList.contains("machine")) return;
	if (elem.parentElement.classList.contains("machine")) {
		// console.log(elem, "- BODY");
		bodyFunc(elem);
	} else {
		// console.log(elem, "- PART");
		partFunc(elem);
	}
};

var matterBodies = [];
var allBodyParts = [];

var createBody = function (elem) {
	
	console.log('create-body:', getBodyDataFromElement(elem));
	const body = Bodies.rectangle(...getBodyDataFromElement(elem));
	matterBodies.push(body);
	allBodyParts.push(body);
	elem.setAttribute("data-body-id", body.id);
	console.log('create body')
};

var createPart = function (elem) {
	const body = Bodies.rectangle(...getBodyDataFromElement(elem));
	const topLevelMachineParentElement = getTopLevelMachineParentElement(elem);
	const topLevelMachineParentElementBodyId =
		topLevelMachineParentElement.getAttribute("data-body-id");
	// This assumes parent body already "walked", will this fail?
	Body.setParts(matterBodies[topLevelMachineParentElementBodyId], [
		// This should NOT be required, but it doesn't work now without it. Why? See index_demo_of_adding_parts_manually for a working example
		// ...matterBodies[topLevelMachineParentElementBodyId].parts,
		body,
	]);
	console.log('create part, body:', body)

    const { min, max } = matterBodies[topLevelMachineParentElementBodyId].bounds;
	console.log('bounds', min, max)
	const width = max.x - min.x;
	const height = max.y - min.y;
	// topLevelMachineParentElement.style.top = min.y;
	// topLevelMachineParentElement.style.left = min.x;
	// topLevelMachineParentElement.style.height = height;
	// topLevelMachineParentElement.style.width = width;
	allBodyParts.push(body);
};
