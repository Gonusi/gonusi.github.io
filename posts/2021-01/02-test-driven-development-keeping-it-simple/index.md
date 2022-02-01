---
title: Learning to (kind of) enjoy test driven development in JS with simpler tests
description: TDD enforces good practices - including actually making your components easily testable without duplicating their functionality in test code and, having broken tests after minor(est)  reworks.  
layout: layout.html
tags: ["posts", "daily", "code style"]
date: 2021-01-04
---

##

I have never _really_ used test driven development. When I tried, it got too clumsy, messy, I tried testing methods of my classes. Didn't really know what I was doing.

The light came after attempting to TDD a functional component wish useState / useEffect hooks when they were released. No longer could I access state or internal methods of a class in my tests. Not without keeping them outside the component I then knew this is not how it was intended to be done.

Along came the (https://testing-library.com/)[https://testing-library.com/] with it's guildelines about how one should test components exactly the way a user would use them.

This means always rendering them to a virtual DOM, accessing elements by their DOM attributes, manipulating them and asserting based on DOM state. You just have no way to do more anymore. And that is pretty liberating in a sense that you can just focus on writing a decent test for the real use case.

An additonal benefit is the encouragment to drop the long standing "1 assert per 1 test" rule (it's in the FAQ). The tooling is capable to show you exactly on which line the test fails while also outputing color coded "Expected vs Reality" DOM state. So it's just no longer useful to go through the trouble of writing more tests. Test a success case, test a failure case and that might just do it.

## The old and the new ways

**If there is a component involving:**

1. Show "Loading..." text
2. Fetch data A from endpoint a
3. Fetch data B from endpoint b
4. Process A using some Array.reduce + Array.filter etc.
5. Process B using some Array.reduce + Array.filter etc.
6. Merge processed data using some procedure only used in that component
7. Display (correctly) merged data in a list

**How I used to test it**

I write 7 or more tests for each step. If this was a functional component, I would moved the algorithms in 4, 5, 6 outside the component and test them separately.

This isn't ideal, because this is a component, not some helper library. If requirements change, algoriths processing the data will change. 4, 5, 6, 7 will all get broken. Or, what if we use new library which performs exactly what 4, 5 used to do. We can't refactor 4 and 5 out without breaking the tests.

However, as I mentioned, this is a component. All we care about is what the user sees is correct, as defined by the task, right?

**How I'm learning to do it now**

I write one longer test. In that test I check 1 and 7. Possibly, I also check if 2, 3 calls API only once, because are quite suitable for nasty bugs involving render loops.

## Does this break TDD if I don't test each step?

Initially, I thought of it that way. How do I "write a small test and make it pass" If I don't write a test. I mean, we all know the mantra:

1. Split task into smallest logical parts
2. Write a test for that small part
3. Make it pass
4. Repeat

Then refactor to make it nice, make it fast. So how do I write the logic without testing it? Well, the key point for me was noticing that mostly, just as I said, the 'logic' is just a few 'reduce' + 'filter' statements. Perfectly acceptable to write using just one test checking the final result.

To tell you the truth, I didn't yet TDD a really big component (this is typically a large form with one input affecting value of others after calling API first). However I feel now I'll just be forced to split it further. And, if there's a lot of conditional logic, it's still always possible to move it to functions outside the component and test them separately.

Any way, it's the first time I'm actually looking forward to it.

## Excercise

Here's the test:

```js
{% include excercises/_component.test.js -%}
```

And here's the function:

```js
{% include excercises/_component.jsx -%}
```
