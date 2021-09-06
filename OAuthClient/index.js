import "regenerator-runtime/runtime";
import OauthClient from "./OAuthClient";
import { UserManager } from "oidc-client";

async function DemoApp() {
  // AUTH0
  // const client = await new OauthClient({
  //   clientId: "2GoaMtfiESKdBXqeqdYGV3jCn4lAutKS",
  //   redirectURI: "https://kasparoauth.local:8000/redirect.html",
  //   storageKey: "OAUTH_METADATA",
  //   metadataURL: "https://dev-vgxmc302.us.auth0.com/.well-known/openid-configuration",
  // });

  const client = await new OauthClient({
    clientId: "0oa1n8fy6dZUEG6M15d7",
    redirectURI: "https://kasparoauth.local:8000/redirect.html",
    storageKey: "OAUTH_METADATA",
    metadataURL: "https://dev-90897551.okta.com/oauth2/default/.well-known/oauth-authorization-server",
    forceMetadataUpdate: true,
  });

  if (window.location.pathname === "/index.html") {
    document.getElementById("signin").addEventListener("click", () => {
      client.signin({ scopes: ["photos"] });
    });
  }

  if (window.location.pathname === "/redirect.html") {
    console.log("Callback detected, will try to get token");
    const urlSearchParams = new URLSearchParams(window.location.search);
    const code = urlSearchParams.get("code");
    const state = urlSearchParams.get("state");
    const token = await client.exchangeCodeToToken({ code, state });
    console.log("Got token, login done:", token);
  }

  // const userManager = new UserManager({
  //   authority: "https://dev-90897551.okta.com/oauth2/default",
  //   client_id: "0oa1n8fy6dZUEG6M15d7",
  //   redirect_uri: "https://kasparoauth.local:8000/redirect.html",
  //   scope: "photos",
  //   loadUserInfo: false,
  //   response_type: "code",
  // });

  // if (window.location.pathname === "/index.html") {
  //   userManager.signinRedirect();
  // }

  // if (window.location.pathname === "/redirect.html") {
  //   console.log("Callback detected, will try to get token");
  //   const urlSearchParams = new URLSearchParams(window.location.search);
  //   const code = urlSearchParams.get("code");
  //   const state = urlSearchParams.get("state");

  //   userManager
  //     .signinCallback()
  //     .then((user) => {
  //       console.log("Logged IN!!!! ", user);
  //     })
  //     .catch((e) => {
  //       // Theres some issue, possibly with response
  //       // The lib fails after getting response from /token endpoint
  //       // For now, check token and if it's fine, swallow the errror
  //       // Possibly the error has to do with incorrect encryption keys set up or similar
  //       // if (getAccessToken()?.user_id) {
  //       //   setIsLoggedIn(true);
  //       //   history.push("/private-page");
  //       //   return;
  //       // }
  //       console.log("Login error ", e);
  //     });
  // }
}

DemoApp();
