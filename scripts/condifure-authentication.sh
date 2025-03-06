#!/bin/bash

# To list all services:
# gcloud services list

echo "Selected project"
PROJECT_ID=$(gcloud config get project)

echo

echo "Enabling services..."
gcloud services enable run.googleapis.com \
    cloudbuild.googleapis.com \
    storage.googleapis.com \
    logging.googleapis.com \
    secretmanager.googleapis.com

echo

echo "Creating Service Account..."
AUTH_FUNCTION_SA_NAME="token-exchange-sa"
AUTH_FUNCTION_SA_DISPLAY_NAME="Token Exchange Service Account"
AUTH_FUNCTION_SA_EMAIL="${AUTH_FUNCTION_SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

echo "Providing Service Account with required roles..."
gcloud iam service-accounts create "$AUTH_FUNCTION_SA_NAME" \
    --description="Service account for token exchange with access to secrets and logs" \
    --display-name="$AUTH_FUNCTION_SA_DISPLAY_NAME"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${AUTH_FUNCTION_SA_EMAIL}" \
    --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${AUTH_FUNCTION_SA_EMAIL}" \
    --role="roles/logging.logWriter"

