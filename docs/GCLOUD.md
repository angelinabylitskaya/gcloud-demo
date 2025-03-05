Web app project with GCloud

- [1. Create project and setup billing](#1-create-project-and-setup-billing)
- [2. Configure Authentication](#2-configure-authentication)
- [3. Implement Authentication](#3-implement-authentication)


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

Create google service
```
ng g service core/services/google
```

...

Create Cloud Function.

//Enable Workflows API https://console.cloud.google.com/workflows
Enable Cloud Logging API https://console.cloud.google.com/marketplace/product/google/logging.googleapis.com
//Eventarc API
//Cloud Pub/Sub API
Cloud Build API
Cloud Run Admin API

Secret Manager API


Create service account

![alt text](assets/image-11.png)

![alt text](assets/image-14.png)







