const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { OAuth2Client } = require('google-auth-library');

const CREDENTIALS_PATH = path.join(__dirname, 'google-oauth.json');
const TOKEN_PATH = path.join(__dirname, 'tokens.json');

// SCOPES required for Gemini API
const SCOPES = [
  'https://www.googleapis.com/auth/cloud-platform',
  'https://www.googleapis.com/auth/generative-language'
];

// Load client credentials
function loadClient() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_id, client_secret, redirect_uris } = credentials.installed;
  return new OAuth2Client(client_id, client_secret, redirect_uris[0]);
}

// Prompt user and get token
async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  });

  console.log('\n🔐 Authorize this app by visiting the following URL:\n\n', authUrl, '\n');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  rl.question('Paste the code here: ', async (code) => {
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
      console.log('\n✅ Tokens saved to tokens.json');
    } catch (err) {
      console.error('❌ Failed to exchange code for tokens:', err.message);
    } finally {
      rl.close();
    }
  });
}

// Main entrypoint
async function authorize() {
  const oAuth2Client = loadClient();

  // If tokens exist, reuse and set up auto-refresh
  if (fs.existsSync(TOKEN_PATH)) {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(tokens);

    // Refresh logic: update tokens.json on refresh
    oAuth2Client.on('tokens', (newTokens) => {
      const updated = { ...tokens, ...newTokens };
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(updated, null, 2));
      console.log('🔁 Token auto-refreshed and saved.');
    });

    return oAuth2Client;
  }

  // Else, get new token
  await getNewToken(oAuth2Client);
}

module.exports = { authorize };
