const express = require('express');
const querystring = require('querystring');
const axios = require('axios');
const { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET } = require('../appsecrets')

const router = express.Router();
const accessTokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';

router.get('', async (req, res) => { 
  const authCode = req.query.authCode;

  const xFormEncoded = new URLSearchParams(
    {
      'code': authCode,
      'grant_type': "authorization_code", 
      'redirect_uri': "http://localhost:4200/calendar",  
      'client_id': LINKEDIN_CLIENT_ID,
      'client_secret': LINKEDIN_CLIENT_SECRET 
    }
  );

  try {
    const response = await axios.post(accessTokenUrl, xFormEncoded)
    console.log("🚀 ~ file: main.js:18 ~ router.get ~ response:", response)

    res.status(200).json({ message: 'success', data: response.data });
  } catch (error) {
    console.log("🚀 ~ file: main.js:24 ~ router.get ~ error:", error)
    res.status(500).json({ message: 'error', error });
  }
});

module.exports = router;
