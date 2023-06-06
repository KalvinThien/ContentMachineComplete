const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('', async (req, res) => { 
  const authCode = req.query;

  try {
    const response = await axios.post(this.accessTokenUrl, {
      grant_type: "authorization_code", 
      code: authCode,
      redirect_uri: "http://localhost:4200",  
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET 
    })
    res.status(200).json({ message: 'Success', data: response.data });
  } catch (error) {
    res.status(500).json({ message: 'Error', error });
  }
});
