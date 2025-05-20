const express = require('express');
const { google } = require('googleapis');

const app = express();
const PORT = 5412;

// Initialize the OAuth2 client
const oauth2Client = new google.auth.OAuth2(
    'YOUR_CLIENT_ID',
    'YOUR_CLIENT_SECRET',
    'YOUR_REDIRECT_URI'
);

// Index Route
app.get('/', (req, res) => {
    res.send("Welcome...");
});

/**
 * Auth Route
 * 
 * This route will redirect the user to Google's OAuth2 consent screen.
 * After the user grants permission, they will be redirected back to the callback route.
 */
app.get('/auth', (req, res) => {
    const scopes = ['https://www.googleapis.com/auth/drive'];

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: scopes,
    });

    res.redirect(authUrl);
});

/**
 * Callback Route
 *
 * This route is the callback URL specified in the Google OAuth2 consent screen.
 * It will handle the response from Google after the user grants permission.
 */
app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        console.log('Tokens:', tokens);

        res.send('Authentication successful!');
    } catch (error) {
        console.error(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})

