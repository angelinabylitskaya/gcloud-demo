export const environment = {
  production: true,

  gcloud: {
    clientId: process.env['GCLOUD_CLIENT_ID'],
    redirectUri:
      process.env['GCLOUD_REDIRECT_URL'] ||
      'http://localhost:4200/auth-callback',
    scope: process.env['GCLOUD_AUTH_SCOPE'] || 'profile email openid',
    authUrl:
      process.env['GCLOUD_AUTH_URL'] ||
      'https://accounts.google.com/o/oauth2/v2/auth',
    profileUrl:
      process.env['GCLOUD_AUTH_URL'] ||
      'https://www.googleapis.com/oauth2/v1/userinfo',
  },

  firebase: {
    projectId: process.env['FIREBASE_PROJECT_ID'],
    appId: process.env['FIREBASE_APP_ID'],
    storageBucket: process.env['FIREBASE_STORAGE_BUCKET'],
    apiKey: process.env['FIREBASE_API_KEY'],
    authDomain: process.env['FIREBASE_AUTH_DOMAIN'],
    messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'],
  },
};
