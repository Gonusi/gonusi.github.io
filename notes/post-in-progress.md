---
title: Make CRA dev server respond to CORS OPTIONS requests, as a gentleman should
description: Create React App allows you to configure a proxy server, modifying responses it makes. This can be useful for a lot of things, we'll use it to set up cross origin communication between two CRA apps running on same machine, different local domains.
layout: layout.html
tags: ["posts", "today I learned", "service-worker"]
date: 2021-09-15
---

```js
self.addEventListener('fetch', async (event) => {
	if (event.request.url.includes('/session')) {
		event.respondWith(
			new Promise((resolve) => {
				setTimeout(() => {
					resolve(
						new Response(JSON.stringify({ sessionExists: true, loggedIn: false }), {
							status: 200
						})
					);
				}, 5000);
			})
		);
    }
}
```
