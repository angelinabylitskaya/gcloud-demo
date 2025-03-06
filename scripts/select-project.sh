#!/bin/bash

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "Google Cloud SDK (gcloud) is not installed."
    exit 1
fi

# Check if a project is selected
check_project_selected() {
    CURRENT_PROJECT=$(gcloud config get project 2>/dev/null)
    if [ -z "$CURRENT_PROJECT" ]; then
        echo "No project is currently selected."
        return 1
    else
        echo "Current project is set to: $CURRENT_PROJECT"
        return 0
    fi
}

# List all projects and prompt for a project ID
select_project() {
    echo "Listing all projects..."
    echo
    gcloud projects list

    read -p "Enter the Project ID you want to select: " PROJECT_ID

    if [ -z "$PROJECT_ID" ]; then
        echo "No Project ID provided. Exiting."
        exit 1
    fi

    PROJECTS=$(gcloud projects list --format="value(projectId)")
    while true; do
        read -p "Enter the Project ID you want to select: " PROJECT_ID

        if [ -z "$PROJECT_ID" ]; then
            echo "No Project ID provided. Please try again."
            continue
        fi

        # Check if the entered project ID is valid
        if echo "$PROJECTS" | grep -wq "$PROJECT_ID"; then
            echo "Setting project to $PROJECT_ID..."
            gcloud config set project "$PROJECT_ID" > /dev/null 2>&1

            # Check if the project was set successfully
            if [ $? -eq 0 ]; then
                echo "Project successfully set to $PROJECT_ID."
                break
            else
                echo "Error: Failed to set project. Please check your permissions."
                exit 1
            fi
        else
            echo "Invalid Project ID. Please enter a valid Project ID from the list above."
        fi
    done
}


if ! check_project_selected; then
    select_project
fi
