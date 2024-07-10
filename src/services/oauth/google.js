// oauth.js
const { OAuth2Client } = require("google-auth-library")
const { google } = require("../../config/oAuthConfig")

let OAuthGoogleClient

const initGoogleOAuth = async () => {
  if (!OAuthGoogleClient) {
    OAuthGoogleClient = new OAuth2Client(google.clientId, google.clientSecret)
  }

  return OAuthGoogleClient
}

module.exports = initGoogleOAuth
