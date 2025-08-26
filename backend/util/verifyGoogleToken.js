// Utility to verify Google ID token and extract user info
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return {
    email: payload.email,
    username: payload.name,
    provider: 'google',
    providerId: payload.sub,
    picture: payload.picture,
  };
}

module.exports = verifyGoogleToken;
