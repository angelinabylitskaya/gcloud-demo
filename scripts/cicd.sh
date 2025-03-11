#!/bin/bash

# Set project ID
PROJECT_ID="gcloud-demo-452713"

# Service account names
SA_VM_DEPLOY="cloudbuild-vm-deployer"
SA_CLOUDRUN_SERVICE="cloudbuild-run-deployer"
SA_CLOUDRUN_FUNCTION="cloudbuild-function-deployer"

# Create service account for VM deployment
echo "Creating service account: ${SA_VM_DEPLOY}"
gcloud iam service-accounts create ${SA_VM_DEPLOY} \
    --project=${PROJECT_ID} \
    --display-name="Cloud Build VM Deployer"

VM_DEPLOY_SA_EMAIL="${SA_VM_DEPLOY}@${PROJECT_ID}.iam.gserviceaccount.com"

# Grant permissions for VM deployment
echo "Granting permissions to ${SA_VM_DEPLOY}"
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${VM_DEPLOY_SA_EMAIL}" \
    --role="roles/artifactregistry.writer" # to save images

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${VM_DEPLOY_SA_EMAIL}" \
    --role="roles/compute.instanceAdmin.v1" # to deploy to VM

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${VM_DEPLOY_SA_EMAIL}" \
    --role="roles/iam.serviceAccountUser" # To act as VM service account

# Create service account for Cloud Run service deployment
echo "Creating service account: ${SA_CLOUDRUN_SERVICE}"
gcloud iam service-accounts create ${SA_CLOUDRUN_SERVICE} \
    --project=${PROJECT_ID} \
    --display-name="Cloud Build Cloud Run Service Deployer"

CLOUDRUN_SERVICE_SA_EMAIL="${SA_CLOUDRUN_SERVICE}@${PROJECT_ID}.iam.gserviceaccount.com"

# Grant permissions for Cloud Run service deployment
echo "Granting permissions to ${SA_CLOUDRUN_SERVICE}"
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${CLOUDRUN_SERVICE_SA_EMAIL}" \
    --role="roles/run.admin" # to deploy to Cloud Run

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${CLOUDRUN_SERVICE_SA_EMAIL}" \
    --role="roles/artifactregistry.reader" # To pull images from Artifact Registry

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${CLOUDRUN_SERVICE_SA_EMAIL}" \
    --role="roles/iam.serviceAccountUser" # To act as Cloud Run's service account

# Create service account for Cloud Run function deployment
echo "Creating service account: ${SA_CLOUDRUN_FUNCTION}"
gcloud iam service-accounts create ${SA_CLOUDRUN_FUNCTION} \
    --project=${PROJECT_ID} \
    --display-name="Cloud Build Cloud Run Function Deployer"

CLOUDRUN_FUNCTION_SA_EMAIL="${SA_CLOUDRUN_FUNCTION}@${PROJECT_ID}.iam.gserviceaccount.com"

# Grant permissions for Cloud Run function deployment
echo "Granting permissions to ${SA_CLOUDRUN_FUNCTION}"
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${CLOUDRUN_FUNCTION_SA_EMAIL}" \
    --role="roles/cloudfunctions.developer" # To deploy functions

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${CLOUDRUN_FUNCTION_SA_EMAIL}" \
    --role="roles/iam.serviceAccountUser" # To act as function's service account

# TODO: add steps to create connection and build triggers
