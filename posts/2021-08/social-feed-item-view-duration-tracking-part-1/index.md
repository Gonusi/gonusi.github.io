---
title: Track view duration of fake social network feed items using intersection observer. Part 1.
description: A part of a series where we create a photo feed, and track the view duration of each item, displaying results in a real time dashboard. Should look cool, and show me my favorite pics.
layout: layout.html
tags: ["posts", "weekly challenge", "experiments", "cypress", "test driven development"]
date: 2021-08-11
---

## What we're gonna Build

** Weekly challenge is for experiments, I reserve up to 7 hours from my week for those, including writing the blog. I've found that if I don't get myself a limit, I'll get obsessed with this stuff and never even post it, never getting it "perfect". Stupid animal brain it is. **

Social networks and websites often have feeds where you scroll through content items. It's then common sense they would time your view of each piece, recording the exact duration you spent viewing it. This would greatly help in serving even more similarly engaging, intelligence-stimulating content, because that's what we like to see, right? I've recently seen a movie, (The social dilemma)[https://www.google.com/search?q=imdb+the+social+dilemma] which talks about this stuff a lot. I don't agree it makes social networks "evil", but it's a pretty interesting watch anyway. 

Let's build a feed of nice images and measure ourselves to see how the whole tracking thing can be built easily, and how the results look, real time. 

## The app

Nothing takes away the fun better than a good, detailed plan. Yet, practice shows it's at least OK to have a loose one, even for fun things. So I had one. The components should have been:

- ViewDurationTracker - renders content, fires callback passed from parent with view duration when it changes;
- Feed - assembles a categorized, pseudo-randomized list of nice photos, and passes them down using props to any component it is supplied;
- Dashboard - displays list of most popular content, and view duration
- Controller - listens for callbacks with view duration for all items, can pass data to another component (dashboard)

To my suprise, things went exacty according to plan this time. I will not present all the code here, as the experiments do get a bit complex. Feel free to check it on (github)[https://github.com/Gonusi/in-browser-view-duration-tracking-using-intersection-observer] or run it on (codesandbox)[https://codesandbox.io/s/in-browser-feed-item-view-duration-tracking-using-intersection-observer-zxgi7] which you will also find embedded on the bottom of this post.

So, the most important parts. 

### ViewDurationTracker - the main element enabling us to very easily track, well, view duration

To build this stuff, first I had to put down some ground rules. 

On instagram, when looking at a photo, I sometimes scroll it out of the viewport so my fingers don't obstruct the view. So, I'll say that when **85% of an element is in the viewport, we'll consider it "being viewed"**. 

*Obviously this is greatly simplified, and there is probably a whole branch of analytics just for getting the various "in view" factors right - but 85% is gonna work fine for our 7 hours of alloted time :)*

Let's explore the components responsibilities in more detail:
- render children in a div;
- when 85% enters viewport, save the `lastEntryDate` in state;
- when 85% leaves the viewport, calculate view duration as difference between `Date.now()` and `lastEntryDate`;
- call callback passed from parent as a prop with view view duration and some info about the element. 

Simple stuff. Yet when I tried to *test-driven-develop-it* I found testing it is not possible using regular [Jest](https://jestjs.io/) / [React testing library](https://testing-library.com/docs/react-testing-library/intro/) / [jsdom](https://github.com/jsdom/jsdom) setup, because *jsdom does not support real layout, making us unable to test logic based on scroll position*.

Fortunately, we now have [Cypress](https://www.cypress.io/) which renders tests in a real browser. Lately, it can even render react components for unit testing without having any kind of "app". I'll make sure to write about it later. 

```js
// To run:
// npx cypress open-ct
import React from "react";
import { mount } from "@cypress/react";
import ViewDurationTracker from "./ViewDurationTracker";

beforeEach(() => {
  cy.viewport(320, 640);
});

it("renders children inside a div", () => {
  mount(<ViewDurationTracker>I am a single child</ViewDurationTracker>);
  cy.get("[data-cy=TimedViewContainer]").contains("I am a single child");
});

it("calls callback passing correct arguments", function () {
  // Not nice to use window like this, but I do know the implications (we're ok, it's a test)
  // It saves me a headache later when setting up a spy
  window.callback = ({ viewDuration, properties }) => {
    expect(viewDuration).to.be.greaterThan(100);
    // Allow 50ms of "leeway" for the scrolling done by our poor JS thread
    expect(viewDuration).to.be.lessThan(150);
    expect(properties.id).to.be.equal(1);
  };

  // Spy on the nastily defined window property 
  cy.spy(window, "callback").as("callback");
  mount(
    <div style={{ paddingTop: "10000px" }}>
      <ViewDurationTracker onViewDurationMsChange={callback} properties={{ id: 1 }}>
        I am a single child
      </ViewDurationTracker>
    </div>
  );

  // At this point we're in a real browser, on the top of the viewport
  cy.scrollTo("bottom");
  // We've now scrolled ±10000px down
  cy.wait(100);
  // After waiting a 100ms we scroll back up
  cy.scrollTo("top");
  // And we check that our callback was called.
  // The other checks are in the callback above, check them out. 
  cy.get("@callback").should("have.been.called");

  // Possibly the more "Cypress'y" way to do this for reference (but I don't like it):
  // cy.get("@callback").should(
  //  "have.been.calledWithMatch",
  //  Cypress.sinon.match.number
  //    .and(Cypress.sinon.match((x) => x > 100, "> 100"))
  //    .and(Cypress.sinon.match((x) => x < 150, "< 150"))
  // );
});
```

And that's the test. I was blown away by comparing:
- my thoughts on how much trouble it is gonna be to write it
- how little trouble it actually was

After having the test, the component itself was very easy too. We're building on the shoulder of giants people, and using the (Intersection Observer API)[https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API].

```js
import React, { useEffect, useRef, useReducer } from "react";

const initialState = { lastEntryTime: 0, viewDuration: 0 };

// Using reducer my 3 simple rules of determining "will you get fucked up by the functional component" say I indeed will:
// - Does it pass a callback to some function? // true
// - Does the callback modify state ? // true
// - Does the state modification relies on previous state? // true
// When all 3 are true, you will have stale state problems due to JS closures, just manage the state in a reducer like this to avoid it.
// Read the excellent article about it here. Read it all, and read it at least 3 times:
// https://overreacted.io/a-complete-guide-to-useeffect/
const reducer = (state, action) => {
  switch (action.type) {
    case "enterViewport": {
      return { ...state, lastEntryTime: Date.now() };
    }
    case "leaveViewport": {
      return {
        ...state,
        viewDuration: state.lastEntryTime
          ? state.viewDuration + (Date.now() - state.lastEntryTime)
          : 0
      };
    }
    default: {
      return state;
    }
  }
};

const ViewDurationTracker = ({
  children,
  properties,
  onViewDurationMsChange,
  ...props
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const elementRef = useRef();

  // This gets called when interesection observer says "85% of element has entered or left the viewport"
  const intersectionCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        dispatch({ type: "enterViewport" });
      } else {
        dispatch({ type: "leaveViewport" });
      }
    });
  };

  useEffect(() => {
    // On startup, setup the intersection observer for this component instance
    let observer = new IntersectionObserver(intersectionCallback, {
      threshold: 0.85
    });
    observer.observe(elementRef.current);
    return () => {
      // Don't forget to disconnect it when the instance says bye
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (state.viewDuration) {
      console.log('VIEW DURATION CHANGE', state.viewDuration)
      // when view duration of this instance changes, call callback from parent
      onViewDurationMsChange?.({
        viewDuration: state.viewDuration, // pass view duration
        properties // pass properties we received from the parent back (it's gonna be {id: xxx} or similar)
      });
    }
  }, [state.viewDuration]);

  return (
    <div data-cy="TimedViewContainer" ref={elementRef} {...props}>
      {children}
    </div>
  );
};

export default ViewDurationTracker;
```

And that's it. We can now track the duration of this item. It would have taken a lot more logic in the old times... Anyway, let's review the functioanlity of other components, without pasting their code here.

## Feed, Dashboard and Controller

### Feed

For the experiment, we'll need something to track. Unsplash has a wonderful API allowing us to search fetch a list of image data based on many search criteria. I've assembled a list of such images in loaded from multiple categories, like "Motorcycles, Landscape, Woman, Man, Beach..". 

Our feed algorithm looks very simple:
- randomize order of categories;
- randomize order of images in each category;
- take first image from first category, append to feed;
- take first image from second category, append to feed;
- ...
- when categories run out, repeat with the second image;
- ...
- when images run out, stop.

This allows us to distribute categories through the list nicely. Later I've discovered a bug (ocassionaly one category is shown multiple times), but had no more time to fix it or to add a test for it, at least in this iteration. 

### Dashboard

It's a very simple list of images marked from Top 1 to Top 20, also displaying the view duration in seconds below. Clicking on the image should scroll the feed to that image. 
It also should have controls for pausing the tracking.

### Controller

This one accumulates the view duration of all elements and sorts them. It should be capable of accepting a minimum view duration to track - so that when user scrolls past the list very fast, these images don't get recorded (they would only create noise in our results - user does not actually view them anyway).

This one took some logic and I ran out of time, so DONT't look at the code.

## Results

It works. I've tested the thing multiple times, and yes, if you forget you're being tracked, you get some results you:
- might not expect;
- might expect but still be a bit ashamed of;
- might be interested by.

I am a ±30 year old male, riding an enduro motorcycle, so I can pretty much predict what categories I'll spend most time on. It's all very expected, as I am ruled by my prewired human brain. However, this is still very interesting stuff, and for my next experiment I might update the tracker, build it into a chrome plugin so I could check the view duration of any web content. Then I could track facebook feeds etc.

And these feeds are not only photos, it contains political stuff etc. For now, the results are best shown in a video, so enjoy:


Check the full code on (GitHub)[https://github.com/Gonusi/in-browser-view-duration-tracking-using-intersection-observer] or (CodeSandbox[https://codesandbox.io/s/in-browser-feed-item-view-duration-tracking-using-intersection-observer-zxgi7?file=/src/components/ViewDurationTracker/ViewDurationTracker.jsx:0-1643]). 

Bye for now, have a great day. 
Kasparas