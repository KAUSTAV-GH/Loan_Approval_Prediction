# LoanAI frontend

LoanAI is a responsive loan eligibility assessment interface built with Next.js and React. Tailwind CSS styles the UI, Framer Motion adds restrained transitions, and the frontend connects to the project's FastAPI service for prediction and PDF report generation.

## Main routes

- `/` - product overview and navigation
- `/about` - model and explainability overview
- `/login` - Supabase passwordless email OTP sign-in
- `/predict` - authenticated 11-field application form and FastAPI prediction request
- `/result` - authenticated current-session prediction, returned SHAP factors, and PDF report

## Local setup

1. Install frontend dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set the Supabase project URL and publishable key. Without those values, the login page explains the missing configuration and `/predict` and `/result` redirect to login.
3. In Supabase, enable email OTP, configure the email template to send the six-digit `{{ .Token }}` code, and add the frontend URL to the site's allowed redirect URLs.
4. Start the frontend with `npm run dev`.
5. From the project root, install `backend/requirements.txt` in the backend environment and start the API with `python -m uvicorn backend.main:app --reload` (or `.venv\Scripts\python.exe -m uvicorn backend.main:app --reload` on Windows). Set `FRONTEND_ORIGINS` there when the frontend origin differs from `http://localhost:3000`.

The browser sends the submitted application to FastAPI `/predict`. The actual response and submitted application snapshot are kept in `sessionStorage` for `/result`; the PDF endpoint formats that same data and does not rerun inference.

The Next.js Proxy validates Supabase claims before serving `/predict` and `/result`. The FastAPI endpoints retain their existing contract and do not independently require Supabase authentication, so deployments that expose the API publicly must enforce API access at their hosting or network layer.

Run `npm run build` to create the production frontend and `npm run start` to serve it.
