const { fizzbuzz } = require("./_tdd-function");

// Step 1
it("should return the numbers passed in that are not divisable by 3 or 5", () => {
	expect(fizzbuzz(1)).toBe(1);
	expect(fizzbuzz(2)).toBe(2);
	expect(fizzbuzz(4)).toBe(4);
	expect(fizzbuzz(7)).toBe(7);
	expect(fizzbuzz(11)).toBe(11);
});

// Step 2
it("should return 'fizz' if the number passed in is divisable by 3 ", () => {
	expect(fizzbuzz(3)).toBe("fizz");
	expect(fizzbuzz(6)).toBe("fizz");
	expect(fizzbuzz(9)).toBe("fizz");
	expect(fizzbuzz(12)).toBe("fizz");
});

// Step 3
it("should return 'fuzz' if the number passed in is divisable by 5 ", () => {
	expect(fizzbuzz(5)).toBe("buzz");
	expect(fizzbuzz(10)).toBe("buzz");
	// expect(fizzbuzz(15)).toBe("buzz"); <-- Too early for that, 15 is divisable both by 3 and 5...
	expect(fizzbuzz(20)).toBe("buzz");
});

// Step 4
it("should return 'fizzbuzz' if the number passed in is divisable by 3 and 5 ", () => {
	expect(fizzbuzz(15)).toBe("fizzbuzz");
	expect(fizzbuzz(30)).toBe("fizzbuzz");
	expect(fizzbuzz(45)).toBe("fizzbuzz");
});
