const express = require('express');
const axios = require('axios');
const { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET } = require('../appsecrets')

const router = express.Router();

const facebookScope = [
  'email',
]

router.get('/linkedin', async (req, res) => { 
  const authCode = req.query.authCode;

  const xFormEncoded = new URLSearchParams(
    {
      'code': authCode,
      'grant_type': "authorization_code", 
      'redirect_uri': "http://localhost:4200/linkedin-callback",  
      'client_id': LINKEDIN_CLIENT_ID,
      'client_secret': LINKEDIN_CLIENT_SECRET 
    }
  );

  try {
    const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', xFormEncoded)
    console.log("🚀 ~ file: main.js:18 ~ router.get ~ response:", response)

    res.status(200).json({ message: 'success', data: response.data });
  } catch (error) {
    console.log("🚀 ~ file: main.js:24 ~ router.get ~ error:", error)
    res.status(500).json({ message: 'error', error });
  }
});

router.get('/facebook/callback', async (req, res) => {
  const authCode = req.query.authCode;

  const tokenParams = {
    client_id: FACEBOOK_CLIENT_ID,
    client_secret: FACEBOOK_CLIENT_SECRET,
    redirect_uri: 'http://localhost:4200/facebook-callback',
    code: authCode,
  };

  try {
    const response = await axios.get('https://graph.facebook.com/v15.0/oauth/access_token', {
      params: tokenParams,
    });
    console.log("🚀 ~ file: main.js:60 ~ router.get ~ response:", response)

    const token = response.data.access_token;
    // Use the access token for further API requests or save it for later use

    res.send({
      message: 'success',
      data: {
        accessToken: token
      },
    });
  } catch (error) {
    console.error('Error during token exchange:', error.message);
    res.status(500).send('Authentication failed.');
  }
});


module.exports = router;
