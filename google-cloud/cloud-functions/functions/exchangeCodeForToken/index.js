import axios from 'axios';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import functions from '@google-cloud/functions-framework';

const client = new SecretManagerServiceClient();
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

// Function to access secrets
async function accessSecret(secretName) {
  const [version] = await client.accessSecretVersion({
    name: `projects/gcloud-demo-452713/secrets/${secretName}/versions/latest`,
  });
  return version.payload?.data?.toString() || '';
}

// Cloud Function entry point
functions.http('exchange-code-for-token', async (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': '*', // Adjust for security (e.g., specific domain)
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Max-Age': '3600', // Cache for 1 hour
  });

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.status(204).send(''); // No content response
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { auth_code } = req.body;
  if (!auth_code) {
    console.error('Missing auth_code');
    return res.status(400).json({ error: 'Missing auth_code' });
  }

  console.log('Received auth code:', auth_code);

  try {
    // Load secrets securely
    const [client_id, client_secret, redirect_uri] = await Promise.all([
      accessSecret('CLIENT_ID'),
      accessSecret('CLIENT_SECRET'),
      accessSecret('REDIRECT_URI'),
    ]);

    const response = await axios.post(GOOGLE_TOKEN_URL, null, {
      params: {
        client_id,
        client_secret,
        redirect_uri,
        code: auth_code,
        grant_type: 'authorization_code',
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    console.log('Token response:', response.data);
    return res.json(response.data);
  } catch (error) {
    console.error('Token exchange failed:', error.message);
    return res
      .status(500)
      .json({ error: 'Token exchange failed', details: error.message });
  }
});
