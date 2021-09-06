## Section 1

!! Idea:
We're doing 2fa wrong by implementing 2fa in each client app.
Instead, we should redirect to auth server login page, keep all logic there.
Think about implementation for this.

### Learned:

Good analogy for Oauth2:
It's like going into hotel reception, giving your docs and receivind back a
hotel card.
You room door, the pool, the gym, the caffee don't need to know who you are. For
them, it's enough that you have a valid hotel card. Only receptionist
authenticates user.

The card contains scopes, AKA the services that the card can open - the gym and
the pool for example, but not the caffeeteria.

### Learned

Oauth doesn't specify anything about users data. OpenId connect extends the
oauth idea and does that.

- Oauth server issues access tokens
- OpenId server issues id tokens with user info for identifying them.

Some calls them authorization and authentication. But this is confusing (True);

### Terminology

Delegated authorization: when you get a token which allows you to make requests
on behalf of the user

- The User (owner of psw in google) - The Resource owner
- Device (phone, browser) - The user agent
- Application (SC) - OAuth client
- Authorization server (issues access tokens)
- API - Resource server

### The old way

User would enter psw, client would exchange it for a session cookie. Only cookie
would then be used to access the API.

## Application types

- Confidential clients (server side apps)
- Public clients (user owned stuff - mobile apps and web apps, tvs etc.)
- Credentialed - in between the above. A mobile app can first get a secret,
  store it to db, and use it from then to tie together all the requests to the
  instance of this app, so that auth server knows refresh tokens are issued to
  the same app.

Distinction is if client can be deployed with credentials (client secret) or
not. Safe for server side, not safe for FE.

If app has credentials, then Auth server can know that it's definetely real app.
Without it, auth server can't know if somethings pretending to be a real app.

Different policies can be applied. (token lifetimes, accepting terms etc.)

## User consent

### Password flow not nice.

Client asks for password, sends the psw to auth server
itself and get's back token. So client gets users psw, not nice. But we used it,
because we own the clients for now.

From auth server perspective, it's also bad, because auth server does not know
if user is actually entering psw right now. Maybe the client saved the psw. Not
good, should not allow such client because it's not secure.

Also, what if FE dev's ask for the password, and then they have full access.
They can say that FE app just will store a photo on server, but actually they
might do something a bit more, whcih is unsafe from API perspective.

In short - we can't confirm that user is at PC and confirms access right now.

Also, 2fa must be put in client.

### User consent screen

Shown at authorization server itself, so that auth server can know that user
actually types the psw himself, and is currently agreeing.

Also, 2fa can be put on auth server. But how do we solve 2fa required for other
steps, like withdraw?

Typically we skip this view when a client **confidential** - when it has a
secret (backend app). Then we can redirect back immediatelly from the auth
server. But redirect is still key - token must be issued by access token and 2fa
stored on auth server.

## Front channel vs Back channel

- Front channel - is via redirects in the URL - lot of problems. Can't know if
  delivered, if received, if really comes from auth server or client etc. Anyone
  can create an url and use it. Can be tampered with easily etc. **Sending using
  a package delivery service analogy. You can't be sure.**.
- Back channel - a secure (https) direct link. JS makes request via ajax. Safe
  due to https. We can make sure we're talking to correct server (https
  certificate).We know for sure where response is coming from, and it can't be
  tampered with. **Hand delivering pacakge analogy.**

Implicit flow. No back channel, so unsafe.

Why implicit flow is even available? Because before, there was no CORS
standards, and browsers could not make cross origin requests. So everything had
to go via url (front channel)

## Application identity

Problems:

1. Code grant flow returns code which is a short duration token to exchange to
   real token. But it still can be stolen. Apps issue a secret and can prove
   that the same app which initiated the request actually uses the code. But
   this still ** doesnt prove if an app is actually the app it tells auth server
   to be**:
2. Public client doesn't have secret, auth server cannot know if it's an
   aknowledged app.

Solutions:
RedirectURL. Code flow sends redirect url, and aknowledged apps register their
urls before. So code will be sent back only if aknowledged url is used.

But ther'es a problem on mobile. Mobiles use different schemes, aka
myapp://redirect. These are not unique.

Recently google and apple started mapping app -> https domain so that we can
redirect to domain, which will redirect to app to solve this problems.

Not super safe (as a secret in backend app is) but quite much better. We're not
using it yet though?

## EXCERSICES

```
Okta auth server (default) issuer URI:
https://dev-90897551.okta.com/oauth2/default

.well-known URI:
https://dev-90897551.okta.com/oauth2/default/.well-known/oauth-authorization-server


authorization_endpoint:
https://dev-90897551.okta.com/oauth2/default/v1/authorize

token endpoint:
https://dev-90897551.okta.com/oauth2/default/v1/token
```

### Insight

Our auth-proxy has secret so that clients can not have secret. But I don't
really get why - they still can't know if THEIR clients are really SC / Bankera
clients? Do we use origin for that or something like that?

## PKCE FLOW:

PKCE is pronounced "pixi". Protects against authorization code injection
attacks.

Flow:

1. User: I want to log in to bankera app using github
2. bankera app: great, I generate secret and hash it:

- Code verifier: 453434321xfxvssdf... (random string of 43-128 char long)
- Code Challenge:base64url(sha256(code_verifier))

3. bankera app: I generate url to auth server authorize endpoint:

- https://auth-server.com/auth?
  - response_type=code&
  - client_id=CLIENT_ID&
  - redirect_uri=REDIRECT_URI& (should match configured redirect uri in auth
    server for that client)
  - scope=photos&
  - state=any custom state if PKCE, a random value if not PKCE (Because PKCE
    fixes this issue by itself)
  - code_challende=base64url(sha256(code_verifier))
  - code_challenge_method=sh256

4. auth server takes user psw, redirects back to redirect_uri:

- example-app.com/redirect?code=AUTH_CODE&state - if not PKCE we can double
  check state for CSRF protection

5. bankera-app: POST https://auth-server.com/token?

- grant_type=authorization_code&
- code=AUTH_CODE_HERE&
- redirect_uri=REDIRECT_URI&
- code_verifier=VERIFIER_STRING& // What is this?
- client_id=CLIENT_ID&
- client_secret=CLIENT_SECRET

6. auth server: responds with

```
{
    "token_type": "Bearer",
    "access_token": "rSSomethingElsf23425",
    "expires_in": "3600",
    "scope": "photos",
    "refresh_token": "HDFSFALFLASFSFWE@#$#$"
}
```

DONE

To refresh ACCESS_TOKEN using refresh token:

```js
POST https://auth-serveere.com/token
 grant_type=refresh_token&
 refresh_token=REFRESH_TOKEN&
 client_id=CLIENT_ID&
 client_secret=CLIENT_SECRET
```

You should receive new token, if all goes well. If you don't receive new refresh
token, you can probably use the old one. It can expire for many reasons: user
revoked ETC;.

## Excercise: build a backend client using OCTA auth server

Client crednetials (created in OCTA dashboard):
ClientId:
0oa1n7k2j9uEQetIj5d7
Client secret:
Nr9bZMYY6FljqlnIkAr4lOw2P6x_Gs1BnmuucZ0x

My request url:
https://dev-90897551.okta.com/oauth2/default/v1/authorize?
response_type=code&
scope=offline_access+photos&
client_id=0oa1n7k2j9uEQetIj5d7&
state=kasparostate&
redirect_uri=https://example-app.com/redirect&
code_challenge=cL6Tfm52nnJTjokxHYxa50tMlIUkw-FVqT1LthqV5bk&
code_challenge_method=S256

Got back code:
jjF0bCHFAyrL4jn4mMOQIRzCVadlkbg1AJm2x_97bIY

state:
kasparostate

Exchange for token:

```s
curl -X POST https://dev-90897551.okta.com/oauth2/default/v1/token \
-d grant_type=authorization_code \
-d redirect_uri=https://example-app.com/redirect \
-d client_id=0oa1n7k2j9uEQetIj5d7 \
-d client_secret=Nr9bZMYY6FljqlnIkAr4lOw2P6x_Gs1BnmuucZ0x \
-d code_verifier=12e4d367039a768d37b97e9a993f726c63e6ae7251727079e3f2cfb0 \
-d code=fJI8ogNzCXnjJmi9ILFMMZwgPM2IkKrzk7nf5TKvqu0
```

Auth server responded with json:

```json
{
  "token_type": "Bearer",
  "expires_in": 3600,
  "access_token": "eyJraWQiOiIwblliTmhKT1Rlckg3V3M2bFpHVDlJRmFTblluY1BCVFc1aU9hNFpuZ084IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULlUyTXRFNGxaZmtjbEtCajdTNnhYRlB5V2VCTUh6NXJMWXh2OHZfdm1GLW8iLCJpc3MiOiJodHRwczovL2Rldi05MDg5NzU1MS5va3RhLmNvbS9vYXV0aDIvZGVmYXVsdCIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE2MzA2NzA2NDksImV4cCI6MTYzMDY3NDI0OSwiY2lkIjoiMG9hMW43azJqOXVFUWV0SWo1ZDciLCJ1aWQiOiIwMHUxbjZndmQ4am5neXRMTjVkNyIsInNjcCI6WyJwaG90b3MiXSwic3ViIjoiR29udXNpQGdpdGh1Yi5va3RhaWRwIn0.VEW6nD0Ghb5lvrn7jojm9wDnOmq_RTrIKmRf3ycv-8RqvAPK_-DUExOR1Z-ndEvmw6NIaNe8p-U03CseSJGwMP-_CDbPilR6_9HqnA9deDHTh6PUOFpK4K4lalO39q7RXpm691oSg5cnx8kHQ3A4ekTHs97dbVSTbE-SuEahMxvnuSM_NfeQOkbm8PU9cpd5vdZQcvrSt7r4QlgykYDk_ANJdHor9qwk9kyVmLwvFxwaZK3yOVtTWHSAZE1Xk7fyiofZMdTkGA-eromYLftk41X5O4VUBueTUbGBPQGk_RCwXmZ6ldDHFnY4da8xM5WsAPmzx96icItIzcpZkE4D8w",
  "scope": "photos"
}
```

## Concept

Deep linking: app can claim url

## Problems with mobile view

Mobile apps used to methods to show login screen:

- In native browser
- In emberdded webview

NAtive browser may look worse from ui perspective, but it has benefits:

- user shares session between app and webapp (facebook logged in on app and on
  mobile)
- app can not sniff psw, because it does not control web view

NEW stuff has proper support for Oauth.

## Scope

offline_access scope is used to request refresh token - a convention

## Mobile storage for refresh tokens

Mobiles have a special API to store refresh tokens. App stores it there, but
can't access it directly.

When it's needed, app can issue access request to storage, biometrics will
popup, user will apply thumb face etc. and app will get refresh token, make POST
request to token endpoint and that's it.

## Refresh token excercise:

```json
{
  "token_type": "Bearer",
  "expires_in": 3600,
  "access_token": "eyJraWQiOiIwblliTmhKT1Rlckg3V3M2bFpHVDlJRmFTblluY1BCVFc1aU9hNFpuZ084IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULmtETDVJOWtTOXNTVEx0YlUyaFRzUkNkSDVvZEw0NkZLS0wzTXIxZzYxeTAub2FyNGYzc3R0OGlESzdpS1k1ZDYiLCJpc3MiOiJodHRwczovL2Rldi05MDg5NzU1MS5va3RhLmNvbS9vYXV0aDIvZGVmYXVsdCIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE2MzA2NzMwOTYsImV4cCI6MTYzMDY3NjY5NiwiY2lkIjoiMG9hMW43azJqOXVFUWV0SWo1ZDciLCJ1aWQiOiIwMHUxbjZndmQ4am5neXRMTjVkNyIsInNjcCI6WyJvZmZsaW5lX2FjY2VzcyIsInBob3RvcyJdLCJzdWIiOiJHb251c2lAZ2l0aHViLm9rdGFpZHAifQ.oZlWd6vxyOsSc-ojEpM9qoWX2ID0iI33p72G9JvMnCqBm0egSGjFL_o8PJ2xzBAYrH9zhuL72BG_JJGoHdSisFelntxCYcn59e6yKJCT_9KcdPpfhH6HSzOkv6XjKPyxMLkBk14pu-NCzsH3koKgcpQ7JiAezQEloYi6nBgReXbCgru5R5Awq6k-d0Bu4e26SiORaIrcP49E16mkjnGRzENpJ-g9G4uUkoXQ7xWcNNDFU9cv-PEzZdrFR4pCed3cjzh0nyulu4B-nNqavw0KsFEa7jHAr1ui0QQZPa1YRK6a7T45j1IL_nvYe0LAUs5eHDQWNVdXq7sHVx0gaYPFYA",
  "scope": "offline_access photos",
  "refresh_token": "AgRJAP7KmQuNg79BlqGIj4Y8ZbTDzAYIWZcXPORjrP4"
}
```

```s
curl -X POST https://dev-90897551.okta.com/oauth2/default/v1/token \
-d grant_type=refresh_token \
-d client_id=0oa1n7k2j9uEQetIj5d7 \
-d client_secret=Nr9bZMYY6FljqlnIkAr4lOw2P6x_Gs1BnmuucZ0x \
-d refresh_token=AgRJAP7KmQuNg79BlqGIj4Y8ZbTDzAYIWZcXPORjrP4
```

```json
{"token_type":"Bearer","expires_in":3600,"access_token":"eyJraWQiOiIwblliTmhKT1Rlckg3V3M2bFpHVDlJRmFTblluY1BCVFc1aU9hNFpuZ084IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnpqcXkxdEJaM2JVZVFRb2pDcm1zemRGaHBmUU5EanZQbTJNUEJ2N1BDd1kub2FyNGYzc3R0OGlESzdpS1k1ZDYiLCJpc3MiOiJodHRwczovL2Rldi05MDg5NzU1MS5va3RhLmNvbS9vYXV0aDIvZGVmYXVsdCIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE2MzA2NzMyNjcsImV4cCI6MTYzMDY3Njg2NywiY2lkIjoiMG9hMW43a zJqOXVFUWV0SWo1ZDciLCJ1aWQiOiIwMHUxbjZndmQ4am5neXRMTjVkNyIsInNjcCI6WyJvZmZsaW5lX2FjY2VzcyIsInBob3RvcyJdLCJzdWIiOiJHb251c2lAZ2l0aHViLm9rdGFpZHAifQ.UcTy0jvw1ixLDGSS7Xg3gg7ZY8NPSnckIWpt1QRBp2It1hEJCLV1W11VWJPsQO_11uPvtzcqCjpU3Nvx2tIIPktgf1tG-EgiCTWfYlcNVYIVZg-XTfxZaSvBlI3xvvMugj-ezH9Xaf9edV1EJRvOdUMwcqeaJJWQI5X6txzMYYK-v3JDuAPlZNGMTEcMxJMESRrogbooVgW3vyukm9cY28XowSSQVpEVlV8DbB_cwZNxK2d9ISXvePXHcYmrApduXM6Eb0zcDIdzTEJaQHAVjZtm_bz2r_Uxmesiwa9cfpit-7-fd8UMOEPCPqtkuMX1lqAfCKMd6pYOl9iZK8suUQ","scope":"offline_access
photos","refresh_token":"AgRJAP7KmQuNg79BlqGIj4Y8ZbTDzAYIWZcXPORjrP4"}
```

##NOTE !!! FORM ENCODED POST WHEN GETTING TOKEN!!! NOT JSON

## JS storing tokens

Can store in service worker. Service worker can work as proxy which can inject
tokens.!!!

But attacker can still instrut browser to make API request using your service
worker.

## Dynamic backend server

Move the whole flow there. Basically:
Browser requests CODE
Sends code to some backend
Backend requests token, returns http only session cookie (can't extract with js)
When api request made, that http only cookie is always passed

Why do we store access token in the browser?
Becaue in our case, attacker can steal the JWT token ACCESS_TOKEN (non
http-only)

But he can't steal ACCESS_TOKEN_SIGNATURE (httponly)

So he can't create a cookie ACCESS_TOKEN which auth proxy would find to be valid
(no signature cookie), so no go for any steal attack.

## SPA token excercise:

Client ID:
0oa1n8fy6dZUEG6M15d7

```js
https://dev-90897551.okta.com/oauth2/default/v1/authorize?
response_type=code&
scope=photos&
client_id=0oa1n8fy6dZUEG6M15d7&
state=kasparostate&
redirect_uri=https://example-app.com/redirect&
code_challenge=cL6Tfm52nnJTjokxHYxa50tMlIUkw-FVqT1LthqV5bk&
code_challenge_method=S256


```

Got code:
XiopMwoXieWVtF313S0as3e7z114NWVR71cqqLUrOtM

curl -X POST https://dev-90897551.okta.com/oauth2/default/v1/token \
-d grant_type=authorization_code \
-d redirect_uri=https://example-app.com/redirect \
-d client_id=0oa1n8fy6dZUEG6M15d7 \
-d code_verifier=12e4d367039a768d37b97e9a993f726c63e6ae7251727079e3f2cfb0 \
-d code=eE6nqkFKwiL24kjOL1niklSNmKPgXLAVG2GOccaQwEs

## Client credentials grant

For machine to machine communication / service account for resource server
It's very simple, POST to token endpoint with secret.

It returns access_token and that's it.\

ClientId:
0oa1n8p487sqOmb075d7
ClientSecret:
Frz7CH-zRfbnLevkNfpqB6qbSAPL4gjL34XpWgeh

```s
curl -X POST https://dev-90897551.okta.com/oauth2/default/v1/token \
-d grant_type=client_credentials \
-d client_id=0oa1n8p487sqOmb075d7 \
-d client_secret=Frz7CH-zRfbnLevkNfpqB6qbSAPL4gjL34XpWgeh \
-d scope=photos
```

## OpenID