---
title: Make CRA dev server respond to CORS OPTIONS requests, as a gentleman should
description: Create React App allows you to configure a proxy server, modifying responses it makes. This can be useful for a lot of things, we'll use it to set up cross origin communication between two CRA apps running on same machine, different local domains. 
layout: layout.html
tags: ["posts", "daily", "today I learned", "react", "CRA"]
date: 2021-09-15
---

If you have ever wished to access the dev server of Create React App, your'e in luck. While working on a login page for a custom authorization server, I needed our OAuth client (SPA app) to return `204 OK` response with correct CORS headers even in development mode. Essentially, I wanted two CRA apps running on different ports to be able to talk to each other using cross origin POST requests. 

Development server (also based on CRA) with login page running @ https://login.app:3000:
```text
POST `https://client.app:3001/login-callback?code=123?state=456`
```

Client App must respond:
```text
204 OK
#CORS headers (regular ones ommited for briefness): 
{
    # allow login app to make cross origin POST request to me
    Access-Control-Allow-Origin: https://login.app:3000 
    # allow login app to send me cookies on a cross origin request
    Access-Control-Allow-Credentials: true 
    # allow login app to use these methods on a cross origin request
    Access-Control-Allow-Methods: GET, POST
}

```

Fortunately, if you put a file `setupProxy.js` in your `src` directory (as generated by CRA), you can configure a node express proxy server, modifying responses made by CRA dev server at your own will. Let's use a popular (CORS)[https://www.npmjs.com/package/cors] middleware npm module to set up cross origin responses automatically. 

So, using Create React App gives you a similar directory structure (as of 2021). Create the file as shown below:
```text/14
my-app/
  README.md
  node_modules/
  package.json
  public/
    index.html
    favicon.ico
  src/
    App.css
    App.js
    App.test.js
    index.css
    index.js
    logo.svg
    setupProxy.js <--- Create this file
```

File contents should be:
{% raw %}
```js
// src/setupProxy.js
// do npm install --save-dev cors to install the cors package

const cors = require('cors');

const corsOptions = {
	origin: 'https://login.app:3000',
	credentials: true,
    methods: "GET,POST"
};

module.exports = (app) => {
    app.use(cors(corsOptions));
	app.options('*', cors(corsOptions));
}

```
{% endraw %}

And that's it. You'll get the response you need. To recap what we have done:

- configured node express server running (or proxying?) our CRA app on local domain https://client.app:3001;
- when it receives OPTIONS request, it will respond with certain headers (specified above);
- when browser running App https://login.app:3000 makes that OPTIONS request, specified response headers inform it it's OK to continue with the actual POST request;
- everything works out nicely.

Actually, we could avoid using any imported package at all. We could just create a little middleware ourselves:

{% raw %}
```js
// src/setupProxy.js
module.exports = (app) => {
    app.use((req, res, next) => {
        res.append('Access-Control-Allow-Origin', ['https://login.app:3000']);
        res.append('Access-Control-Allow-Methods', 'GET,POST');
        res.append('Access-Control-Allow-Credentials', 'true');
        next();
    });
}
```
{% endraw %}

So that's it. This is great stuff, and you can definitely do more than set up CORS with it. FIY, I do not know if this is really a proxy server sitting in between CRA dev server and you, or are we actually configuring the instance of dev server. CRA says we indeed are configuring the dev server instance.

Further reading:
- [official CRA website on setupProxy](https://create-react-app.dev/docs/proxying-api-requests-in-development/)
- [CORS on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

Have a great day, reader. End.  