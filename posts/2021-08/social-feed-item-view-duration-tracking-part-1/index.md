---
title: Track view duration of fake social network feed items using intersection observer. Part 1.
description: A part of a series where we create a photo feed, and track the view duration of each item, displaying results in a real time dashboard. Should look cool, and show me my favorite pics.
layout: layout.html
tags: ["posts", "weekly challenge", "experiment", "cypress", "test driven development"]
date: 2021-08-11
---

## What we're gonna Build

**Weekly challenge is for experiments, I reserve up to 7 hours from my week for those, including writing the blog. This is not production grade stuff. You have been warned.**

Social networks and websites often have feeds where you scroll through content items. It's then common sense they would measure the view duration of each piece. This would greatly help in serving even more "similarly engaging, intelligence-stimulating content", because that's what we like to see, right? I've recently seen a movie, [The social dilemma](https://www.google.com/search?q=imdb+the+social+dilemma) which talks about this stuff a lot. I don't agree with the narrative it makes social networks "evil", but I still enjoyjed it. 

Let's build a feed of nice images and measure ourselves to see how the whole tracking thing can be built easily, and how the results look, real time. 

To begin with, feel free to watch this demo of the final app. Or just leave it to the end. 

<div class="videoWrapper">
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/LjVAYFTzb1I" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## The app

Nothing takes away the fun better than a good, detailed plan. Let's use React, and build these components:

- ViewDurationTracker - renders content, fires callback passed from parent with view duration when it changes;
- Feed - assembles a categorized, pseudo-randomized list of nice photos, and passes them down using props to any component it is supplied;
- Dashboard - displays list of most popular content, and view duration
- Controller - listens for callbacks with view duration for all items, can pass data to another component (dashboard)

I will not present all the code here, as the stuff does get a bit lengthy. Feel free to check it on [github](https://github.com/Gonusi/in-browser-view-duration-tracking-using-intersection-observer) or run it on [codesandbox](https://codesandbox.io/s/in-browser-feed-item-view-duration-tracking-using-intersection-observer-zxgi7).

Let's discuss key parts and view the result. 

### ViewDurationTracker - the main element enabling us to very easily time the view

To build this stuff, first I had to put down some ground rules. 

On Instagram, when looking at a photo, I sometimes scroll it out of the viewport so my fingers don't obstruct the view. So, I'll say that when **85% of an element is in the viewport, we'll consider it "being viewed"**. 

*Obviously this is greatly simplified, and there is probably a whole branch of analytics just for getting the various "in view" factors right - but 85% is gonna work fine for our 7 hours of alloted time :)*

Let's explore the components responsibilities in more detail:
- render children in a div;
- when 85% enters viewport, save the `lastEntryDate` in state;
- when 85% leaves the viewport, calculate view duration as difference between `Date.now()` and `lastEntryDate`;
- call callback passed from parent as a prop with view view duration and some info about the element. 

Simple stuff. Yet when I tried to *test-driven-develop-it* I found testing it is not possible using regular [Jest](https://jestjs.io/) / [React testing library](https://testing-library.com/docs/react-testing-library/intro/) / [jsdom](https://github.com/jsdom/jsdom) setup, because *jsdom does not support real layout, making us unable to test logic based on scroll position*.

Fortunately, we now have [Cypress](https://www.cypress.io/) which renders tests in a real browser. Lately, it can even render react components for unit testing without having any kind of "app". I'll make sure to write about it later. 

{% raw %}
```javascript
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
  // Let's use window and not worry about it for once.
  // cy.spy only accepst [object, property] so 
  // let's not complicate our own lives for now.  
  window.callback = ({ viewDuration, properties }) => {
    expect(viewDuration).to.be.greaterThan(100);
    // Expect 200ms view duration, but allow up to 250ms 
    // The programattic scrolling part consumes a few ms so we're adjusting for taht
    expect(viewDuration).to.be.lessThan(150);
    expect(properties.id).to.be.equal(1);
  };

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
  cy.wait(200);
  // After waiting a 200ms we scroll back up
  cy.scrollTo("top");
  // And we check that our callback was called.
  // Callback above contains more checks
  cy.get("@callback").should("have.been.called");

  // Possibly the more "Cypress'y" way to do this for reference:
  // (I don't like it):
  // cy.get("@callback").should(
  //  "have.been.calledWithMatch",
  //  Cypress.sinon.match.number
  //    .and(Cypress.sinon.match((x) => x > 100, "> 100"))
  //    .and(Cypress.sinon.match((x) => x < 150, "< 150"))
  // );
});
```
{% endraw %}

And that's the test. I was blown away by comparing:
- my thoughts on how much trouble it is gonna be to write it
- how little trouble it actually was

After having the test, the component itself was very easy too. We're building on the shoulder of giants people, and using the (Intersection Observer API)[https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API].

{% raw %}
```javascript
import React, { useEffect, useRef, useReducer } from "react";

const initialState = { lastEntryTime: 0, viewDuration: 0 };

// Using reducer because my 3 simple rules of determining "will you get f****d
// up by the functional component" say I indeed will:
// - Does it pass a callback to some function? // true
// - Does the callback modify state ? // true
// - Does the state modification relies on previous state? // true When all 3
//   are true, you will have stale state problems due to JS closures, just
//   manage the state in a reducer like this to avoid it. The callback only
//   dispatches actions, and does not need to know anything about the state,
//   avoiding problems entirely If in doubt, read the excellent article about it
//   here. Read it all, and read it at least 3 times:
//   https://overreacted.io/a-complete-guide-to-useeffect/
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

  // This gets called when interesection observer says "85% of element has
  // entered or left the viewport"
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
      // when view duration of this instance changes, call callback from parent
      onViewDurationMsChange?.({
        viewDuration: state.viewDuration, 
        properties // might be an {id}, might be anything else...
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
{% endraw %}

At this point, we can  track the duration of a single item. We still need to deploy a swarm of these trackers on a fake "feed" of images, aggregate all their view durations as the user scrolls through and display the data. 

## Feed, Dashboard and Controller

### Fetch photo data using unsplash.com API

For the experiment, we'll need something to track. Unsplash has a wonderful API allowing us to search fetch a list of image data based on many search criteria. I've assembled a list of such images fetched from multiple categories (see below). Then, transposed the json data a it as to avoid fiddling with the objects during run time. 

Here's a node script I scribbled to use the API:
```js
// To run, from script directory:
// node ./getPhotos.js

const fetch = require("node-fetch");
const fs = require("fs");
const unsplash = require("unsplash-js");

const ACCESS_KEY = "mfpNJ7dKkJlWHZ9NFd6fyBhVSLiFZKC90D0dVN48JIs";
const UTM_PARAMS = "utm_source=ScrollObserver2&utm_medium=referral";

const CATEGORIES = [
	"animals",
	"architecture",
	"cars",
	"fashion",
	"man",
	"motorbikes",
	"nature",
	"sports",
	"street",
	"underwater",
	"woman",
];

const api = unsplash.createApi({
	accessKey: ACCESS_KEY,
	fetch,
});

async function fetchPhotoData() {
	let promises;
	try {
		promises = CATEGORIES.map(async (category) => {
			console.info(`Will fetch category ${category}`);
			return await api.search.getPhotos({
				orientation: "portrait",
				featured: true,
				page: 1,
				perPage: 30, // Undocumented max seems to be 30.
				query: category,
			});
		});
	} catch (e) {
		console.error(e);
	}
	const responses = await Promise.all(promises);
	let idsByCategory = {};
	let dataByIds = {};
	CATEGORIES.forEach((category, index) => {
		let categoryPhotos = responses[index].response.results;
		idsByCategory[category] = categoryPhotos.map((result) => result.id);
		let categoryPhotoData = Object.values(categoryPhotos).reduce((acc, photo) => {
			let result = {
				acknowledgeUrl: photo.links.download_location,
				description: photo.description,
				id: photo.id,
				likes: photo.likes,
				src: photo.urls.regular,
				unsplashLink: `https://unsplash.com?${UTM_PARAMS}`,
				userLink: `${photo.user.links.html}?${UTM_PARAMS}`,
				username: photo.user.username,
				category,
			};
			acc[photo.id] = result;
			return acc;
		}, {});
		dataByIds = { ...dataByIds, ...categoryPhotoData };
	});
	let categories = Object.keys(idsByCategory);
	let result = {
		categories,
		idsByCategory,
		dataByIds,
	};
	fs.writeFileSync("photos.json", JSON.stringify(result));
	console.info("Result:", result);
	console.info("We're done.");
}

fetchPhotoData();

```

### Feed

Using the photo data fetched, building a list is trivial. However, I wanted to add some additional functionality to ensure all categories have an equal chance to be displayed, with a certain level of randomization. 

The algorithm should roughly:
- randomize order of categories;
- randomize order of images in each category;
- take first image from first category, append to feed;
- take first image from second category, append to feed;
- ...
- when categories run out, repeat with the second image;
- ...
- when images run out, stop.

This allows us to distribute categories through the list nicely. Later I've discovered a bug (ocassionaly one category is shown multiple times), but had no more time to fix it or to add a test for it, at least in this iteration. 

See the code on:
- (codesandbox)[https://codesandbox.io/s/in-browser-feed-item-view-duration-tracking-using-intersection-observer-zxgi7?file=/src/componentDemoViews/FeedDemoView.jsx]
- (Github)[https://github.com/Gonusi/in-browser-view-duration-tracking-using-intersection-observer/blob/main/src/components/Feed/Feed.jsx]

### Controller

This one accumulates the view duration of all elements and sorts them. It should be capable of accepting a minimum view duration to track - so that when user scrolls past the list very fast, these images don't get recorded. That, I've found, would only creates noise in our results - user does not actually view these images (unless user is a machine) anyway.

So, the plan is:
- pass a `onViewDurationChange` callback / handler to the child Feed component;
- when it's fired, take the `{viewDuration, imageSrc}` or similar;
- put this data into an object containing list of viewed images;
- if such `imageSrc` already exists in that list, add the `viewDuration` to the previous `viewDuration;
- sort the results based on view duration to form a top 20 list.

See the code on:
- [codesandbox](https://codesandbox.io/s/in-browser-feed-item-view-duration-tracking-using-intersection-observer-zxgi7?file=/src/components/Controller/Controller.jsx)
- [Github](https://github.com/Gonusi/in-browser-view-duration-tracking-using-intersection-observer/blob/main/src/components/Controller/Controller.jsx)

### Dashboard

Top 20 images images should be displayed with their respective view duration in seconds at the botttom of the screen. Clicking on an image should scroll the feed to that image so the user can see it better when browsing the results. So, it also should have controls for pausing the tracking.

See the code on:
- [codesandbox](https://codesandbox.io/s/in-browser-feed-item-view-duration-tracking-using-intersection-observer-zxgi7?file=/src/components/Dashboard/Dashboard.jsx)
- [Github](https://github.com/Gonusi/in-browser-view-duration-tracking-using-intersection-observer/blob/main/src/components/Dashboard/Dashboard.jsx)

## Results

It works quite nicely. I've tested the thing multiple times, and yes, if you forget you're being tracked, you get some results you:
- might not expect;
- might expect but still be a bit ashamed of;
- might be interested by.

The app quickly run into limitations due to the nature of how I selected the images, lack of any statistical methods implemented to actually present results.

The categories are very broad and non descriptive. For example, "nature" can range from a photo of a river valley, to stuff that is more like two color abstract painting. I prefered the latter, so to interpret results more meaningfully, I'd have to find better ways to categorise / describe the images.

I had these search terms / categories in the test:
```js
	"categories": [
		"animals",
		"architecture",
		"cars",
		"fashion",
		"man",
		"motorbikes",
		"nature",
		"sports",
		"street",
		"underwater",
		"woman"
	]
```

Roughly, the top 5 images mostly tended to include a variation of `[nature, motorbikes, underwater, woman, fashion]`. 

I am a ±30 year old male, enjoying enduro motorcycling, so it's all very expected.  However, this is still very interesting stuff, and for my next experiment I might update the tracker, build it into a chrome plugin so I could check the view duration of any web content. Then I could track facebook feeds etc.

Also, I noticed I start scrolling faster when I get bored, and "preferred images in the end of session" get less view time than they would have gotten if they were seen in the beginning of the session.

And these feeds are not only photos, it contains political stuff etc. For now, the results are best shown in a video, so enjoy:

### Improvements to be made in next iteration, should there be one.

- add categories below images in Dashboard;
- save the data of each session in localStorage and build a statistical dashboard to better interpret results;
- look for ways to adjust for increasing scroll speed as the session progresses.

Check the full code on [Github](https://github.com/Gonusi/in-browser-view-duration-tracking-using-intersection-observer) or[codesandbox](https://codesandbox.io/s/in-browser-feed-item-view-duration-tracking-using-intersection-observer-zxgi7?file=/src/components/ViewDurationTracker/ViewDurationTracker.jsx:0-1643]). 

Bye for now, have a great day. 
Kasparas