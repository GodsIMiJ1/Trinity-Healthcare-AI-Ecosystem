# AGA Companion (With Me Still)

Relational AGA companion for the Trinity Healthcare AI Ecosystem.  
Includes crisis escalation, longitudinal memory, and session persistence.

## Local Development

1. Install dependencies:
   `npm install`
2. Create a `.env.local` with:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Run:
   `npm run dev`

## Supabase Edge Functions

This app relies on the following functions:

- `companion-chat`
- `suggest-name`
- `aga-kernel`

Required function environment variables (set in Supabase):

- `AI_GATEWAY_URL`
- `AI_GATEWAY_API_KEY`

## Tech Stack

- Vite + React + TypeScript
- shadcn/ui + Tailwind CSS
- Supabase (auth, storage, edge functions)
