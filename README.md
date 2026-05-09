# Sonbol Salon Public Website

Next.js public website for Sonbol Salon.

## Deployment

Deploy this repo to Vercel as the public website. This is the only app that should receive the real public domain.

Required Vercel environment variable:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend.up.railway.app/api
```

Build settings:

```text
Framework: Next.js
Build command: npm run build
Output: Next.js default
```

## Local Development

```bash
npm install
npm run dev
```

Local API environment:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## Checks

```bash
npm run lint
npm run build
```
