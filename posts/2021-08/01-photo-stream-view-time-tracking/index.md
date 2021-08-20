---
title: Track view duration of fake social network feed items using intersection observer. Part 1.
layout: layout.html
tags: ["posts", "weekly challenge", "experiments", "cypress", "test driven development"]
date: 2021-08-11
---

## What we're gonna Build

** Weekly challenge is for experiments, I reserve up to 7 hours from my week for those, including writing the blog. I've found that if I don't get myself a limit, I'll get obsessed with this stuff and never even post it, never getting it "perfect". Stupid animal brain it is. **

Social networks and websites often have feeds where you scroll through content items. It's then common sense they would time your view of each piece, recording the exact duration you spent viewing it. This would greatly help in serving even more similarly engaging, intelligence-stimulating content, because that's what we like to see, right?

Let's build a feed of nice images and measure ourselves to see how the whole tracking thing can be built easily, and how the results look, real time. 

## The plan

Nothing takes away the fun better than a good, detailed plan. Yet, practice shows it's at least OK to have a loose one, even for fun things. Let's name a few components we'll need:

- ViewDurationTracker - renders content, fires callback passed from parent with view duration when it changes;
- PhotoFeed - assembles a list of nice photos, and passes them down using props to any component it is supplied;
- Dashboard - displays list of most popular content, and view duration
- ViewDurationTrackingController - listens for callbacks with view duration for all items, can pass data to another component (dashboard)

Let's build the thing, bottom-up, using React this time.

## 1. ViewDurationTracker - renders content, fires callback passed from parent with view duration when it changes

I use mobile devices to browse social networks. On instagram, when looking at a photo, I sometimes scroll it out of the viewport so my fingers don't obstruct the view. So, I'll say that when **85% of an element is in the viewport, we'll consider it "being viewed"**. 

*Obviously this is greatly simplified, and there is probably a whole branch of analytics just for getting the various "in view" factors right - but 85% is gonna work fine for our 7 hours of alloted time :)*

Let's explore the components responsibilities in more detail:
- render children in a div;
- when 85% enters viewport, save the `lastEntryDate` in state;
- when 85% leaves the viewport, calculate view duration as difference between `Date.now()` and `lastEntryDate`
- call callback passed from parent as a prop with view view duration.

Simple stuff. Yet I found testing it is not possible using my [Jest](https://jestjs.io/) / [React testing library](https://testing-library.com/docs/react-testing-library/intro/) / [jsdom](https://github.com/jsdom/jsdom) setup, because *jsdom does not support real layout, making us unable to test logic based on scroll position*.

Fortunately, we now have [Cypress](https://www.cypress.io/) which renders tests in a real browser. Lately, it can even render react components for unit testing without having any kind of "app". I'll make sure to write about it later. 

<!-- ```js
{% include excercises/_ViewDurationTracker.spec.js %}
``` -->

<iframe src="https://codesandbox.io/embed/adoring-aryabhata-zxgi7?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fcomponents%2FViewDurationTracker.jsx&theme=dark&view=editor"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="adoring-aryabhata-zxgi7"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

The first test is obvious. The second test does a few things:
- renders the `<ViewDurationTracker/>` hidden from the view by means of large top padding of a parent;
- scrolls down so the component to simulate it "being viewed";
- waits a 100ms to simulate a user viewing it;
- scrolls up so the component is out of view again;
- checks if the component has called callback and a number between 100ms and 150ms as the argument;

Not ideal, but not bad. To make it better, we could:
- mess with mocking the Date.now() / timers so the test does not actually take 100ms+;
- scrolling, logic and stuff takes up some time and, for a 100ms view, component reports around 110 - 130ms view duration;

Not worth it right now, and we don't have enough time. After the tests, writing the component was easy, here it is.

The component itself is pretty simple. We're using the <i>[intersection observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)</i> API, built specifically for the purpose of knowing when an element. Expectedly, the stuff works as expected :) 

The only issue I've had with the observer API, is that the intersection callback fires immediatelly after rendering the component, even if the component is immediatelly hidden from the viewport by a large top padding on the parent component. 

At first I thought this was my mistake, or an issue with how React renders stuff, or maybe how styles are applied...as in the component is visible for, say, a few milliseconds, and only then gets pushed down and out of the viewport by the parent's top padding. But it seems this is expected behaviour.

Other than that, there's potential for the classical react functional component stale state problems (see code comment) - we avoid these it by using the reducer to manipulate state, all in one place. 

```js
{% include excercises/_ViewDurationTracker.jsx %}
```

And here's the component in action with some additional styles:
<iframe src="https://codesandbox.io/embed/adoring-aryabhata-zxgi7?fontsize=13&hidenavigation=1&initialpath=%2Fcomponent%2FViewDurationTracker&module=%2Fsrc%2Fcomponents%2FViewDurationTracker.jsx&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="adoring-aryabhata-zxgi7"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

   Check it out, and next time, in Part 2 we'll write the PhotoFeed component. 