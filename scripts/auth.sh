#!/bin/bash

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "Google Cloud SDK (gcloud) is not installed."
    exit 1
fi

# Check if the user is logged in
ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")

if [ -z "$ACTIVE_ACCOUNT" ]; then
    echo "No active Google Cloud account found."
    gcloud auth login
else
    echo "Logged in as: $ACTIVE_ACCOUNT"
fi

