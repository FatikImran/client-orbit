# Client Orbit Support AI

Production-style, zero-budget portfolio project for AI customer support automation.

## What this project demonstrates
- AI support assistant with safety guardrails and escalation logic
- Lead capture from natural chat (name, email, need, urgency)
- API input validation and rate limiting
- Free-tier deployment strategy for freelance delivery

## Stack
- Next.js (App Router, TypeScript)
- Gemini Flash (with fallback mode if no key)
- Supabase (optional, local JSON fallback included)
- Upstash Redis (optional, in-memory fallback included)

## Quick start
1. Install dependencies
   npm install
2. Copy env file
   copy .env.example .env.local
3. Run app
   npm run dev
4. Test structure
   npm run test

Open http://localhost:3000

## API routes
- GET /api/health
- POST /api/chat
- GET /api/leads (optionally protected by ADMIN_TOKEN)
- POST /api/leads

## Security notes
- Keep all keys in .env.local and hosting platform secret settings.
- Never expose service role keys to client-side code.
- Rotate keys if leaked.

## Free-tier behavior
- If Gemini key is missing, app uses deterministic fallback support behavior.
- If Supabase is missing, data is written to local JSON store for demo.
- If Upstash is missing, in-memory rate limit fallback is used.

## File map
- app/api/chat/route.ts: chat orchestration and persistence
- app/api/leads/route.ts: lead retrieval and manual insertion
- app/api/health/route.ts: health endpoint
- lib/ai/prompts.ts: system prompt and context
- lib/ai/provider.ts: Gemini integration and fallback logic
- lib/db/queries.ts: Supabase/local storage abstraction
- lib/rateLimit/upstash.ts: Upstash/local limiter

## Portfolio assets included
- MASTER_SYSTEM_PROMPT.txt
- PORTFOLIO_PROOF_PACK.txt
- THIRD_PARTY_SETUP_GUIDE.txt
- Plan of Attack.md

## Deployment
See THIRD_PARTY_SETUP_GUIDE.txt for account creation and deployment steps.
