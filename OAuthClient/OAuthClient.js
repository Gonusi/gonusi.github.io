import "regenerator-runtime/runtime";
import axios from "axios";

async function OauthClient({
	clientId,
	encryptionMethod = "S256",
	forceMetadataUpdate = false,
	metadataURL,
	redirectURI,
	storageKey,
}) {
	let metadata = JSON.parse(window.localStorage.getItem(storageKey));
	if (!metadata || forceMetadataUpdate) updateMetadata();

	async function updateMetadata() {
		// TODO doublecheck if descturcturing into data:metadata like this really updates parent var
		const { data: metadata } = await axios.get(metadataURL);
		window.localStorage.setItem(storageKey, JSON.stringify(metadata));
	}

	async function generateCodeChallengeAndVerifier() {
		function decimalToHex(dec) {
			return ("0" + dec.toString(16)).substr(-2);
		}

		function generateRandomString() {
			const array = new Uint32Array(56 / 2);
			window.crypto.getRandomValues(array);
			return Array.from(array, decimalToHex).join("");
		}

		function sha256(plaintext) {
			// returns promise ArrayBuffer
			const encoder = new TextEncoder();
			const data = encoder.encode(plaintext);
			return window.crypto.subtle.digest("SHA-256", data);
		}

		function base64urlencode(a) {
			// Convert the ArrayBuffer to string using Uint8 array.
			// btoa takes chars from 0-255 and base64 encodes.
			// Then convert the base64 encoded to base64url encoded.
			// (replace + with -, replace / with _, trim trailing =)
			return btoa(String.fromCharCode.apply(null, new Uint8Array(a)))
				.replace(/\+/g, "-")
				.replace(/\//g, "_")
				.replace(/=+$/, "");
		}

		async function PKCEChallengeFromVerifier(v) {
			console.log("verifier:", v);
			const hashed = await sha256(v);
			console.log("hashed:", hashed);
			const base64encoded = base64urlencode(hashed);
			return base64encoded;
		}

		const randomString = generateRandomString();
		const codeVerifier = randomString; // AKA plaintext
		const codeChallenge = await PKCEChallengeFromVerifier(codeVerifier);

		return { codeVerifier, codeChallenge };
	}

	async function signin({ scopes }) {
		const { codeChallenge, codeVerifier } = await generateCodeChallengeAndVerifier();
		window.localStorage.setItem(codeChallenge, codeVerifier);
		// Form URL
		const authorizationURI =
			`${metadata.authorization_endpoint}?` +
			`response_type=code&` +
			`scope=${scopes.join("+")}&` +
			`client_id=${clientId}&` +
			`state=${codeChallenge}&` + // set state as code challenge too
            `redirect_uri=${redirectURI}&` +
			`code_challenge=${codeChallenge}&` +
			`code_challenge_method=${encryptionMethod}`;
		console.log("Authorization URI:", authorizationURI);
		window.location.assign(authorizationURI);
	}

	async function exchangeCodeToToken({ code, state }) {
		const codeVerifier = window.localStorage.getItem(state);
		if (!codeVerifier) throw new Error("State mismatch");

		const tokenURI =
			`${metadata.token_endpoint}?` +
			`grant_type=authorization_code&` +
			`redirect_uri=${redirectURI}&` +
			`client_id=${clientId}&` +
			`code_verifier=${codeVerifier}&` +
			`code=${code}`;
		const { data: accessToken } = await axios.post(tokenURI);
		console.log("accessToken", accessToken);
		return accessToken;
	}

	return {
		updateMetadata,
		signin,
		exchangeCodeToToken,
	};
}

export default OauthClient;