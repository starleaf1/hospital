# Multi-Tenant SIMRS Backend (Hospital Information System)

This is a modern, clean architecture, multi-tenant backend for a Hospital Information System (SIMRS).
Built with TypeScript, Express, Prisma ORM, and integrates with BPJS and SATUSEHAT Sandbox.

## Prerequisites
- Node.js >= 20
- PostgreSQL (e.g., Neon serverless Postgres)

## Setup Execution Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Copy `.env.example` to `.env` and fill in your connection details:
   ```bash
   cp .env.example .env
   ```
   Set your Neon PostgreSQL URL in the `DATABASE_URL` field.

3. **Database Migration (Prisma)**
   Push the schema to your Neon Postgres database and generate the Prisma Client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Seed Essential Data (Manual via Prisma Studio or SQL)**
   You need a Tenant and a ServicePoint to start testing.
   ```bash
   npx prisma studio
   ```
   - Create a Tenant and note its `id`.
   - Create a ServicePoint for that Tenant.

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Verification (cURL Examples)

Replace `YOUR_TENANT_ID` and `YOUR_SERVICE_POINT_ID` with real UUIDs from your database.

**1. Register a Patient**
```bash
curl -X POST http://localhost:8080/api/v1/patients \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: YOUR_TENANT_ID" \
  -d '{
    "nik": "3171234567890123",
    "name": "Budi Santoso",
    "birthDate": "1990-01-01T00:00:00Z",
    "gender": "M"
  }'
```

**2. Initialize an Encounter (with Mock BPJS)**
Replace `YOUR_PATIENT_ID` with the ID from the previous request.
```bash
curl -X POST http://localhost:8080/api/v1/encounters \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: YOUR_TENANT_ID" \
  -d '{
    "patientId": "YOUR_PATIENT_ID",
    "servicePointId": "YOUR_SERVICE_POINT_ID",
    "bpjsNumber": "0001234567890"
  }'
```

**3. Sync Encounter with SATUSEHAT Sandbox**
Replace `YOUR_ENCOUNTER_ID` with the ID from the previous request.
```bash
curl -X POST http://localhost:8080/api/v1/encounters/YOUR_ENCOUNTER_ID/sync-satusehat \
  -H "x-tenant-id: YOUR_TENANT_ID"
```

## Deployment to GCP Cloud Run
This project includes an optimized, multi-stage `Dockerfile` ready for Cloud Run.

```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/simrs-backend
gcloud run deploy simrs-backend --image gcr.io/YOUR_PROJECT_ID/simrs-backend --port 8080 --set-env-vars="DATABASE_URL=your_database_url" --allow-unauthenticated
```
