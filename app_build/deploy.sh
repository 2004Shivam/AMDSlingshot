#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Evee → GCP Cloud Run Deploy Script
# Usage: ./deploy.sh [PROJECT_ID]
# ═══════════════════════════════════════════════════════════
set -e

PROJECT_ID=${1:-$(gcloud config get-value project)}
REGION="asia-south1"
SERVICE_NAME="evee-app"
REPO_NAME="evee-docker"
IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$SERVICE_NAME"

echo "🚀 Deploying Evee to GCP Cloud Run"
echo "   Project : $PROJECT_ID"
echo "   Region  : $REGION"
echo "   Image   : $IMAGE"
echo ""

# Ensure APIs are enabled
echo "📡 Enabling required GCP APIs..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  --project "$PROJECT_ID"

# Create Artifact Registry repo (idempotent)
echo "📦 Setting up Artifact Registry..."
gcloud artifacts repositories create "$REPO_NAME" \
  --repository-format=docker \
  --location="$REGION" \
  --description="Evee app Docker images" \
  --project "$PROJECT_ID" 2>/dev/null || echo "   (repo already exists, skipping)"

# Build with Cloud Build
echo "🏗️  Building Docker image with Cloud Build..."
gcloud builds submit . \
  --tag "$IMAGE" \
  --project "$PROJECT_ID"

# Read GEMINI key from .env.local
GEMINI_KEY=$(grep GEMINI_API_KEY .env.local 2>/dev/null | cut -d= -f2 || echo "")
if [ -z "$GEMINI_KEY" ]; then
  echo "⚠️  GEMINI_API_KEY not found in .env.local — you'll need to set it manually."
fi

# Deploy to Cloud Run
echo "☁️  Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3 \
  --port 8080 \
  --set-env-vars "GEMINI_API_KEY=$GEMINI_KEY,NODE_ENV=production" \
  --project "$PROJECT_ID"

echo ""
echo "✅ Deployed! Your app is live at:"
gcloud run services describe "$SERVICE_NAME" \
  --platform managed \
  --region "$REGION" \
  --format 'value(status.url)' \
  --project "$PROJECT_ID"
