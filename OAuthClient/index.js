import "regenerator-runtime/runtime";
import OauthClient from "./OAuthClient";

async function DemoApp() {
	const client = await new OauthClient({
		clientId: "2GoaMtfiESKdBXqeqdYGV3jCn4lAutKS",
		redirectURI: "http://localhost:1234/oauth-callback",
		storageKey: "OAUTH_METADATA",
		metadataURL:
			"https://dev-vgxmc302.us.auth0.com/.well-known/openid-configuration",
	});

	if (window.location.pathname === "/") {
		document.getElementById("signin").addEventListener("click", () => {
			client.signin({ scopes: ["openid", "photos", "profile", "email"] });
		});
	}

	if (window.location.pathname === "/oauth-callback") {
        console.log('Callback detected, will try to get token')
		const urlSearchParams = new URLSearchParams(window.location.search);
		const code = urlSearchParams.get("code");
		const state = urlSearchParams.get("state");
		const token = await client.exchangeCodeToToken({ code, state });
        console.log('got token, login done:', token)
	}
}

DemoApp();