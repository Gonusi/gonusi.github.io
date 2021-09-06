import "regenerator-runtime/runtime";
import axios from "axios";

async function OauthClient({ clientId, encryptionMethod = "S256", forceMetadataUpdate = false, metadataURL, redirectURI, storageKey }) {
  let metadata = JSON.parse(window.localStorage.getItem(storageKey));
  if (!metadata || forceMetadataUpdate) updateMetadata();

  async function updateMetadata() {
    const { data } = await axios.get(metadataURL);
    metadata = data;
    window.localStorage.setItem(storageKey, JSON.stringify(metadata));
  }

  async function generateCodeChallengeAndVerifier() {
    let cryptoObj = window.crypto || window.msCrypto;
    function decimalToHex(dec) {
      return ("0" + dec.toString(16)).substr(-2);
    }

    function generateRandomString() {
      const array = new Uint32Array(56 / 2);
      cryptoObj.getRandomValues(array);
      return Array.from(array, decimalToHex).join("");
    }

    function sha256(plaintext) {
      const encoder = new TextEncoder();
      const data = encoder.encode(plaintext);
      return cryptoObj.subtle.digest("SHA-256", data);
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
      const hashed = await sha256(v);
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
      `redirect_uri=${encodeURIComponent(redirectURI)}&` +
      `code_challenge=${codeChallenge}&` +
      `code_challenge_method=${encryptionMethod}&` +
      `response_mode=query`;
    console.log("Authorization URI:", authorizationURI);
    window.location.assign(authorizationURI);
  }

  async function exchangeCodeToToken({ code, state }) {
    const codeVerifier = window.localStorage.getItem(state);
    if (!codeVerifier) throw new Error("State mismatch");

    console.log(
      "You can make manual request too:"`
curl --request POST \
  --url '${metadata.token_endpoint}' \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data grant_type=authorization_code \
  --data 'client_id=${clientId}' \
  --data code_verifier=${codeVerifier} \
  --data code=${code} \
  --data 'redirect_uri=${redirectURI}'
`
    );

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", clientId);
    params.append("code", code);
    params.append("redirect_uri", redirectURI);
    params.append("code_verifier", codeVerifier);

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const { data: accessToken } = await axios.post(metadata.token_endpoint, params, config);
    return accessToken;
  }

  return {
    updateMetadata,
    signin,
    exchangeCodeToToken,
  };
}

export default OauthClient;
