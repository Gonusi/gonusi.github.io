import "regenerator-runtime/runtime";
import axios from "axios";

async function OauthClient({ clientId, encryptionMethod = "S256", forceMetadataUpdate = false, metadataURL, redirectURI, storageKey }) {
  let metadata = JSON.parse(window.localStorage.getItem(storageKey));
  if (!metadata || forceMetadataUpdate) updateMetadata();

  async function updateMetadata() {
    const response = await axios.get(metadataURL);
    metadata = response.data;
    window.localStorage.setItem(storageKey, JSON.stringify(response.data));
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
      return btoa(String.fromCharCode.apply(null, new Uint8Array(a)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }

    async function PKCEChallengeFromVerifier(verifier) {
      const hashedVerifier = await sha256(verifier);
      const base64encodedVerifier = base64urlencode(hashedVerifier);
      return base64encodedVerifier;
    }

    const randomString = generateRandomString();
    const codeVerifier = randomString; // AKA plaintext
    const codeChallenge = await PKCEChallengeFromVerifier(codeVerifier);

    return { codeVerifier, codeChallenge };
  }

  async function signinRedirect({ scopes }) {
    const { codeChallenge, codeVerifier } = await generateCodeChallengeAndVerifier();
    window.localStorage.setItem(codeChallenge, codeVerifier);
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
    window.location.assign(authorizationURI);
  }

  async function exchangeCodeToToken({ code, state }) {
    const codeVerifier = window.localStorage.getItem(state);
    if (!codeVerifier) throw new Error("State mismatch");

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
    signinRedirect,
    exchangeCodeToToken,
  };
}

export default OauthClient;
