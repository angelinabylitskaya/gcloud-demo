Web app project with GCloud

- [1. Create project and setup billing](#1-create-project-and-setup-billing)
- [2. Configure Authentication](#2-configure-authentication)
- [3. Implement Authentication](#3-implement-authentication)
  - [Create google service](#create-google-service)
  - [Create Cloud Function](#create-cloud-function)
    - [Create service account](#create-service-account)
    - [Create Secrets](#create-secrets)
    - [Create Function](#create-function)
    - [Function Code](#function-code)
    - [Client code](#client-code)
    - [Bonus](#bonus)


## 1. Create project and setup billing

On https://console.cloud.google.com/welcome find selected project button. Upon clicking - select project popup appears. Click NEW PROJECT.

![alt text](assets/image-1.png)

![alt text](assets/image-2.png)

![alt text](assets/image.png)

Navigate to Billing and create new billing account.

![alt text](assets/image-3.png)

Navigate to Budget & alerts and create new budget.

![alt text](assets/image-4.png)

Specify Budget

![alt text](assets/image-5.png)

![alt text](assets/image-6.png)

## 2. Configure Authentication

Navigate to API & Services > OAuth Consent Screen

Tpp start with auth, app should be created. Click GET STARTED

![alt text](assets/image-7.png)

![alt text](assets/image-8.png)

Enter contact email and finish by confirming last step.

Navigate to Audience, add test user.

![alt text](assets/image-9.png)

Navigate to Clients and create a web app client.

![alt text](assets/image-10.png)

Copy Client id and add to .env GCLOUD_CLIENT_ID
Add Authorized redirect URIs URI 1 to .env GCLOUD_REDIRECT_URL

## 3. Implement Authentication

### Create google service
```
ng g service core/services/google
```

<details>
<summary>Login with google</summary>

```typescript
  loginWithGoogle(): void {
    if (localStorage.getItem('access_token')) {
      this.navigateHome();
      return;
    }

    const url = `${environment.gcloud.authUrl}?response_type=code&client_id=${environment.gcloud.clientId}&redirect_uri=${environment.gcloud.redirectUri}&scope=${environment.gcloud.scope}&access_type=offline&prompt=consent`;
    window.location.href = url;
  }
```
</details>

### Create Cloud Function

Enable:
- Cloud Logging API https://console.cloud.google.com/marketplace/product/google/logging.googleapis.com
- Cloud Build API
- Cloud Run Admin API
- Secret Manager API

#### Create service account

![alt text](assets/image-11.png)

Service account should access have access to secrets (Service Account Secret Accessor) and write logs (Optional, required if using logs library).

![alt text](assets/image-14.png)

#### Create Secrets

Find Secret Manager.
Create 3 secret (CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)

![alt text](assets/image-15.png)

#### Create Function

Find Cloud Run Functions
Click WRITE A FUNCTION

1. Select "Use an inline editor"
1. Add "Service name". it affects the final URL
1. Select "Region". https://cloud.google.com/about/locations
1. Select runtime. If depends on the language you are using to write a function
1. Select "Allow unauthenticated". For this function only, since we need it obtain a token
1. Keep min number of instances as 0 for less expenses. Change max number of instances to 1
2. Select Ingress = "All" to allow traffic from internet. It can be changed later

![alt text](assets/image-16.png)

#### Function Code

<details>
<summary>index.js</summary>

```javascript
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

```
</details>

<details>
<summary>package.json</summary>

```json
{
  "dependencies": {
    "@google-cloud/functions-framework": "^3.4.6",
    "@google-cloud/secret-manager": "^5.6.0",
    "axios": "^1.8.1"
  }
}

```
</details>

SAVE AND DEPLOY

Next:
- observe logs
- observe usage
- change source code and deploy new revisions
- use tags to call specific revision, add revisions traffic splitting

Note: for tags use versions, like v1, v1.2, v2. revision tags creates a separate URL to use revision by tag.

#### Client code

<details>
<summary>Call created function</summary>

```typescript
  completeLogin(code: string): Observable<void> {
    if (!code) {
      throw throwError(() => new Error('Invalid Code'));
    }
    return this.http
      .post(
        'https://<service-name>.us-central1.run.app',
        { auth_code: code },
      )
      .pipe(
        take(1),
        map((response: any) => {
          this.token.next(response.access_token);
          localStorage.setItem('access_token', response.access_token);
          this.navigateHome();
        }),
        catchError((error) => {
          console.error('Token exchange failed', error);
          throw new Error('Token exchange failed');
        }),
      );
  }
```
</details>

#### Bonus

<details>
<summary>Get user Info</summary>

```typescript
const headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${token}`,
);
return this.http.get('https://www.googleapis.com/oauth2/v1/userinfo', {
    headers,
});
```
</details>

<!-- ## 4. Configure Database

## 5. Configure Storage

## 6. Configure EventArc

Enable Workflows API https://console.cloud.google.com/workflows
Eventarc API
Cloud Pub/Sub API -->




