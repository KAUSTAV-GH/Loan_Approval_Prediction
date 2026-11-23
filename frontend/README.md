# LoanAI frontend

The LoanAI frontend is a responsive Next.js and React application for passwordless sign-in, loan application submission, explainable prediction results, and PDF report download. It connects to the project's FastAPI backend.

## Routes

- `/` — product overview and navigation
- `/about` — model and explainability overview
- `/login` — Supabase passwordless email Magic Link sign-in
- `/auth/callback` — exchanges the Supabase callback code for a session
- `/predict` — authenticated 11-field loan application form
- `/result` — current-session prediction, SHAP contributions, and PDF report

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set the Supabase project URL, publishable key, and backend URL:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

4. In Supabase Auth, enable the Email provider and allow the callback URL `http://localhost:3000/auth/callback`.
5. Start the FastAPI backend from the repository root (see the root README).
6. Start the frontend:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Application data flow

The browser sends the submitted application to FastAPI `POST /predict`. The returned prediction and submitted application snapshot are kept in this browser tab's `sessionStorage` for the result page. The PDF endpoint formats that same application and prediction; it does not run inference again.

The Next.js Proxy validates Supabase claims before serving `/predict` and `/result`. The FastAPI endpoints do not independently require a Supabase session. CORS is not API authentication; see the root README's security and deployment notes.

## Quality checks

```bash
npm run lint
npm run build
```

Run `npm run start` to serve the production build locally.
