# Deploying Priori AI Backend to Google Cloud Run

This guide provides step-by-step instructions for deploying the Priori AI backend to Google Cloud Run using Docker containers.

## Prerequisites

1. Google Cloud account with billing enabled
2. Google Cloud SDK installed locally
3. Docker installed locally (for testing)

## Setup Steps

### 1. Install Google Cloud SDK

If you haven't already, install the Google Cloud SDK:
- Visit https://cloud.google.com/sdk/docs/install for installation instructions
- After installation, run `gcloud init` to authenticate and set up your project

### 2. Create a Google Cloud Project (if needed)

```bash
gcloud projects create priori-backend-project --name="Priori AI Backend"
gcloud config set project priori-backend-project
```

### 3. Enable Required APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 4. Build and Deploy

#### Option 1: Deploy using Cloud Build (Recommended)

Navigate to the backend directory and run:

```bash
cd /Users/varunmadan/CascadeProjects/8VC-hackathon/backend
gcloud builds submit --config=cloudbuild.yaml
```

This will:
1. Build the Docker container
2. Push it to Google Container Registry
3. Deploy it to Cloud Run

#### Option 2: Manual Deployment

Build the Docker image locally:

```bash
cd /Users/varunmadan/CascadeProjects/8VC-hackathon/backend
docker build -t gcr.io/[YOUR_PROJECT_ID]/priori-backend .
```

Push to Google Container Registry:

```bash
docker push gcr.io/[YOUR_PROJECT_ID]/priori-backend
```

Deploy to Cloud Run:

```bash
gcloud run deploy priori-backend \
  --image gcr.io/[YOUR_PROJECT_ID]/priori-backend \
  --platform managed \
  --region us-west1 \
  --allow-unauthenticated
```

### 5. Verify Deployment

After deployment, Cloud Run will provide a URL for your service. You can test it with:

```bash
curl https://[YOUR_SERVICE_URL]/api/health
```

## Connecting Frontend to Backend

After deploying your backend, you'll need to update your frontend to use the new backend URL:

1. Open `/Users/varunmadan/CascadeProjects/8VC-hackathon/src/lib/ollamaService.ts`
2. Update the API base URL to point to your Cloud Run service URL

## Important Notes

### Ollama in Container

The Dockerfile includes installation of Ollama, but there are some considerations:
- Cloud Run has resource constraints that might affect Ollama's performance
- For production, consider using a more cloud-friendly LLM API like OpenAI or Vertex AI
- If Ollama performance is critical, consider using Google Compute Engine instead

### Environment Variables

You can set environment variables in the Cloud Run deployment:

```bash
gcloud run services update priori-backend \
  --set-env-vars OLLAMA_MODEL=llama3.2
```

### Scaling and Costs

Cloud Run scales to zero when not in use, which helps control costs. However, be aware that:
- Cold starts may affect performance
- If your application receives heavy traffic, monitor your billing
- Set budget alerts in Google Cloud to avoid unexpected charges
