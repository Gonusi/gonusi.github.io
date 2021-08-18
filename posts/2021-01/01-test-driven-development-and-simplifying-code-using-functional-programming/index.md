---
title: Test driven development and reading on how to simplify my code
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

Here's how simple it is:

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

```js
{% include excercises/_tdd-function.test.js -%}
```

And here's the function:

```js
{% include excercises/_tdd-function.js -%}
```

You write one test, and implement the functionality. Then move to another. It's super pleasant and simple.

## A React component

Principle is the same with a react component. There's a lot more trouble in preparing the environment for it, though. Not only does one need Jest, but also some library to help selecting stuff, mocking clicks etc. But, the principle is largely the same. You write a test, make it fail, make it work, refactor until it's nice.

The test:

```js
{% include excercises/_tdd-react-component.test.js -%}
```

The component:

```js
{% include excercises/_tdd-react-component.js -%}
```

The main benefit I see, is you have to really understand the task before doing this, and plan by writing the tests. And no one can argue it's not OK to do it properly. It's TDD, so it's cool, everyone knows that.
