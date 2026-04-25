# Client Orbit Support AI

AI-powered production-style, zero-budget Support Assistant with automated replies and lead extraction.

## Live Demo
- Public demo: https://client-orbit-kohl.vercel.app/

## Overview
This application provides:
- Policy-aware support responses with escalation behavior.
- Lead capture from user conversations (name, email, need, urgency).
- API validation and request rate limiting.
- Persistent storage for conversations and leads.

## Tech Stack
- Next.js (App Router, TypeScript)
- Google Gemini API
- Supabase (Postgres)
- Upstash Redis (rate limiting)

## Project Structure
- app/api/chat/route.ts: Chat endpoint and request orchestration
- app/api/health/route.ts: Health check endpoint
- app/api/leads/route.ts: Lead listing and manual lead insert endpoint
- lib/ai/provider.ts: Gemini integration and fallback logic
- lib/ai/prompts.ts: System and extraction prompts
- lib/db/queries.ts: Persistence layer for leads and conversations
- lib/rateLimit/upstash.ts: Rate limiter implementation
- lib/utils/validation.ts: Input validation schemas

## Getting Started
1. Install dependencies:
   npm install
2. Configure environment variables:
   copy .env.example .env.local
3. Start the development server:
   npm run dev
4. Run checks:
   npm run lint
   npm run test

## Environment Variables
Use these variables in local and deployment environments:
- GEMINI_API_KEY
- GEMINI_MODEL
- SUPABASE_URL
- SUPABASE_SECRET_API_KEY (preferred) or SUPABASE_SERVICE_ROLE_KEY (fallback)
- UPSTASH_REDIS_REST_URL
- UPSTASH_REDIS_REST_TOKEN
- ADMIN_TOKEN

## API Endpoints
- GET /api/health
- GET /api/chat (usage helper)
- POST /api/chat
- GET /api/leads (requires x-admin-token)
- POST /api/leads

## Deployment
Deploy to Vercel and set all required environment variables in project settings.

## Test Case Screenshots

### 1. Design Overview
![Design Overview](media/1%20design_overview.png)

### 2. Simple Hi Test
![Simple Hi Test](media/2%20simple_hi_test.png)

### 3. Hardcoded Test
![Hardcoded Test](media/3%20hardcoded_test.png)

### 4. Confusing Realistic Prompt
![Confusing Realistic Prompt](media/4%20confusing_realistic_prompt.png)

### 5. Lead Extraction Test
![Lead Extraction Test](media/5%20lead_extraction_test.png)

### 6. Ambiguous Prompt
![Ambiguous Prompt](media/6%20ambiguous_prompt.png)
