---
description: Deploy the finalized app to Google Cloud Run (production)
---

When the user types `/deploy-cloud`, take the audited app in `app_build/` and deploy it to Google Cloud Run.

## Pre-Conditions
- Ensure Phase 4 (QA) is marked ✅ in `production_artifacts/context_ledger.md`.
- Ensure `gcloud` CLI is authenticated (`gcloud auth list`).

## Execution

### Act as @cloud (sub-agent of @devops):

1. **Verify**: Confirm `app_build/` has the correct files. Check it has a `Dockerfile` OR that `gcloud run deploy --source .` can auto-detect the stack.
2. **Containerize**: If no `Dockerfile` exists, generate an appropriate one for the detected stack:
   - **Node.js**: `FROM node:20-slim` base, `npm ci`, `EXPOSE 8080`, `CMD ["node", "server.js"]`
   - **Python**: `FROM python:3.12-slim` base, `pip install`, `EXPOSE 8080`, `CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]`
3. **Deploy**: Run from `app_build/`:
   ```bash
   gcloud run deploy --source . --region us-central1 --allow-unauthenticated
   ```
4. **Capture URL**: Extract the `.run.app` URL from the deployment output.
5. **Update Ledger**: Mark Deploy phase ✅. Record the live URL in `production_artifacts/context_ledger.md`.
6. **Report**: 
   > "☁️ **Cloud deployment complete!** Your app is live at: [URL]"
