#!/bin/bash
# Script to deploy the Priori AI backend to Google Cloud Run

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Priori AI Backend - Google Cloud Run Deployment${NC}"
echo "=================================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed.${NC}"
    echo "Please install the Google Cloud SDK from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo -e "${YELLOW}You need to log in to Google Cloud.${NC}"
    gcloud auth login
fi

# Get current project
CURRENT_PROJECT=$(gcloud config get-value project)
echo -e "${GREEN}Current Google Cloud project:${NC} $CURRENT_PROJECT"

# Ask if user wants to use a different project
read -p "Do you want to use a different project? (y/N): " change_project
if [[ $change_project =~ ^[Yy]$ ]]; then
    read -p "Enter project ID: " project_id
    gcloud config set project $project_id
    CURRENT_PROJECT=$project_id
    echo -e "${GREEN}Project set to:${NC} $CURRENT_PROJECT"
fi

# Enable required APIs
echo -e "${YELLOW}Enabling required Google Cloud APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
echo -e "${GREEN}APIs enabled.${NC}"

# Ask for region
read -p "Enter region for deployment (default: us-west1): " region
region=${region:-us-west1}

# Ask for service name
read -p "Enter service name (default: priori-backend): " service_name
service_name=${service_name:-priori-backend}

# Ask for Ollama model
read -p "Enter default Ollama model (default: llama3.2): " ollama_model
ollama_model=${ollama_model:-llama3.2}

# Build and deploy
echo -e "${YELLOW}Building and deploying to Cloud Run...${NC}"
echo "This may take several minutes."

# Update cloudbuild.yaml with the correct region and service name
sed -i '' "s/priori-backend/$service_name/g" cloudbuild.yaml
sed -i '' "s/us-west1/$region/g" cloudbuild.yaml

# Submit build
gcloud builds submit --config=cloudbuild.yaml

# Get the service URL
SERVICE_URL=$(gcloud run services describe $service_name --region=$region --format="value(status.url)")

echo -e "${GREEN}Deployment complete!${NC}"
echo -e "Your backend is now available at: ${GREEN}$SERVICE_URL${NC}"

# Update the frontend config
echo -e "${YELLOW}Updating frontend configuration...${NC}"
CONFIG_FILE="../src/lib/config.ts"

# Extract the hostname from the service URL
SERVICE_HOSTNAME=$(echo $SERVICE_URL | sed 's/https:\/\///')

# Update the config.ts file with the actual service URL
sed -i '' "s|https://priori-backend-\[YOUR_CLOUD_RUN_URL\].a.run.app/api|$SERVICE_URL/api|g" $CONFIG_FILE

echo -e "${GREEN}Frontend configuration updated.${NC}"
echo -e "Remember to redeploy your frontend to Netlify for the changes to take effect."

echo -e "${YELLOW}Testing the deployment...${NC}"
curl -s "$SERVICE_URL/api/health" | grep -q "healthy" && \
  echo -e "${GREEN}Backend is healthy and responding!${NC}" || \
  echo -e "${RED}Backend health check failed. Please check the logs.${NC}"

echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Redeploy your frontend to Netlify"
echo "2. Monitor your backend using Google Cloud Console"
echo "3. Set up budget alerts to control costs"
echo ""
echo -e "${YELLOW}To view logs:${NC}"
echo "gcloud logging read \"resource.type=cloud_run_revision AND resource.labels.service_name=$service_name\" --limit=10"
