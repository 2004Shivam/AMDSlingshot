#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Evee → GCP Cloud Run Deploy Script
# Usage: ./deploy.sh [PROJECT_ID]
# ═══════════════════════════════════════════════════════════
set -e

GCLOUD="${GCLOUD:-gcloud}"
PROJECT_ID=${1:-evee-app-prod}
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
"$GCLOUD" services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  --project "$PROJECT_ID"

# Create Artifact Registry repo (idempotent)
echo "📦 Setting up Artifact Registry..."
"$GCLOUD" artifacts repositories create "$REPO_NAME" \
  --repository-format=docker \
  --location="$REGION" \
  --description="Evee app Docker images" \
  --project "$PROJECT_ID" 2>/dev/null || echo "   (repo already exists, skipping)"

# Build with Cloud Build
echo "🏗️  Building Docker image with Cloud Build..."
"$GCLOUD" builds submit . \
  --tag "$IMAGE" \
  --project "$PROJECT_ID"

# Read all env vars from .env.local (exclude NEXT_PUBLIC_ → those become build args)
# Build env vars string for Cloud Run (NEXT_PUBLIC vars need to be passed too for SSR)
ENV_VARS=$(grep -E "^(GEMINI_API_KEY|NEXT_PUBLIC_)" .env.local 2>/dev/null \
  | grep -v "^#" \
  | tr '\n' ',' \
  | sed 's/,$//')

if [ -z "$ENV_VARS" ]; then
  echo "⚠️  No env vars found in .env.local — set them manually in Cloud Run console."
fi

# Deploy to Cloud Run
echo "☁️  Deploying to Cloud Run..."
"$GCLOUD" run deploy "$SERVICE_NAME" \
  --image "$IMAGE" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3 \
  --port 8080 \
  --set-env-vars "$ENV_VARS,NODE_ENV=production" \
  --project "$PROJECT_ID"

echo ""
echo "✅ Deployed! Your app is live at:"
"$GCLOUD" run services describe "$SERVICE_NAME" \
  --platform managed \
  --region "$REGION" \
  --format 'value(status.url)' \
  --project "$PROJECT_ID"
