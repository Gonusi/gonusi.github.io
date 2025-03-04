---
title: Test driven development and reading on how to simplify my code
description: Force myself to follow TDD on personal experiments. 
layout: layout.html
tags: ["posts", "daily", "TDD"]
date: 2021-01-01
---

## Simple JS function

Today I've read a nice article about Test Driven Development by [Lee Cheneler](https://medium.com/@lee_85949):
[https://medium.com/@lee_85949/from-fizzbuzz-to-react-practical-test-driven-development-in-javascript-9fd05a4d1ad6](https://medium.com/@lee_85949/from-fizzbuzz-to-react-practical-test-driven-development-in-javascript-9fd05a4d1ad6)

Do read it, all examples in this post are taken from there. Remember these are my daily notes helping me to commit to learning something every day, not original content.

The thing with TDD is, I always feel like it's just one step away. You could have this beautiful, logical, clean, instantly refactorable flow, but the tasks are usually so complex that you have to reverse engineer some old code + API, and try to implement some stuff to understand how all these endpoints map together etc. Then you have done half of the work, and it's kind of too late for the "TDD" approach.

This has to change, thought. To help me commit, I've decided to restart with the basics from the article.

First example was developing `fizzbuzz` function using the test driven development flow, which, turns out, is a task frequently given by interviewers. The task is very simple but lend's itself well to testing:

_Write a program that prints the numbers from 1 to 100. But for multiples of three print “Fizz” instead of the number and for the multiples of five print “Buzz”. For numbers which are multiples of both three and five print “FizzBuzz”._

To do this, we'll need:

1. Node
2. [Jest](https://jestjs.io/docs/en/getting-started.html) (our test runner)

Here's how simple it is, really:

```bash
# Install Jest
npm install --save-dev jest

# Inside package.json, add jest command to your scripts:
{
  "scripts": {
    "test": "jest"
  }
}

# Create test file
touch function.test.js

# Create file to test in a directory of your choice
touch function.js

# Write your first test in function.test.js (see Step 1 below) and run Jest to see it fail:
npm run test
```

1. Write a test with a small task (return number which was passed as argument)
2. Check that it fails
3. Write code and make sure the test no longer fails
4. Refactor if necessary, which is easy since we now have the test.

Here's the test:

{% raw %}
```js
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
```
{% endraw %}

And here's the function:

{% raw %}
```js
const fizzbuzz = (num) => {
    // Could write (num % 15 === 0) which sounds clever but I think is less descriptive
    if (num % 3 === 0 && num % 5 === 0) return "fizzbuzz";
    if (num % 3 === 0) return "fizz";
    if (num % 5 === 0) return "buzz";

    return num;
};

module.exports = { fizzbuzz };
```
{% endraw %}

You write one test, and implement the functionality. Then move to another. It's super pleasant and simple.

## A React component

Principle is the same with a react component. There's a lot more trouble in preparing the environment for it, though. Not only does one need Jest, but also some library to help selecting stuff, mocking clicks etc. But, the principle is largely the same. You write a test, make it fail, make it work, refactor until it's nice.

The test:

{% raw %}
```js
// http://localhost:8000/react-dev-demos/day1
import React, { useState } from "react"

// Refactored from class:
/* 
export class Counter extends React.Component {
  constructor() {
    super()
    this.increment = this.increment.bind(this)
    this.state = {
      count: 0,
    }
  }

  increment() {
    this.setState({
      count: this.state.count + 1,
    })
  }

  render() {
    return (
      <>
        <span data-testid="count">Count: {this.state.count}</span>
        <button type="button" onClick={this.increment}>
          Increment
        </button>
      </>
    )
  }
}
*/

// To functional component:

export const Counter = () => {
    const [count, setCount] = useState(0)

    const increment = () => {
        setCount(count + 1)
    }

    return (
        <>
            <span data-testid="count">Count: {count}</span>
            <button type="button" onClick={increment}>
                Increment
            </button>
        </>
    )
}

export default function Day1() {
    return Counter
}
```
{% endraw %}

The component:

{% raw %}
```js
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Counter } from "./_tdd-react-component";

it("should display the start count as 0", () => {
    const { getByTestId } = render(<Counter />);

    expect(getByTestId("count")).toHaveTextContent("Count: 0");
});

it("should increase the count by 1 when increase button is clicked", () => {
    const { getByTestId, getByText } = render(<Counter />);

    fireEvent.click(getByText("Increment"));
    expect(getByTestId("count")).toHaveTextContent("Count: 1");

    fireEvent.click(getByText("Increment"));
    expect(getByTestId("count")).toHaveTextContent("Count: 2");
});
```
{% endraw %}

The main benefit I see, is you have to really understand the task before doing this, and plan by writing the tests. And no one can argue it's not OK to do it properly. It's TDD, so it's cool, everyone knows that.
