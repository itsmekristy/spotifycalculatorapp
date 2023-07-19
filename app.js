// app.js

const express = require('express');
const app = express();

// Configure the Spotify credentials
const SPOTIFY_CLIENT_ID = '9f96898a3a7042dfa601d2f52452a612';
const SPOTIFY_CLIENT_SECRET = '9341fa554264469f9f5ceb3b90c5c28b';
const SPOTIFY_REDIRECT_URI = 'http://localhost:3000'
const SCOPES = 'user-read-recently-played';

// Initialize the Spotify access token variable
let accessToken = null;

// Use dynamic import() for 'node-fetch'
import('node-fetch').then((nodeFetch) => {
    const fetch = nodeFetch.default;
});
// Redirect users to Spotify login
app.get('/login', (req, res) => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
  res.redirect(authUrl);
});

// Callback route after successful login
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}`,
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token');
    }

    const tokenData = await tokenResponse.json();
    accessToken = tokenData.access_token;

    // Save the tokenData in your database for future API calls
    // You'll also need to associate the access token with the user in your database

    res.json(tokenData);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
