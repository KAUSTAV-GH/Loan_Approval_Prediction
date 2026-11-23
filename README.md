<div align="center">

# LoanAI

### Explainable Loan Eligibility Prediction

A full-stack machine learning application that estimates loan eligibility from applicant information and explains the model output with SHAP.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/API-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.x-3776AB?logo=python)](https://www.python.org/)
[![scikit--learn](https://img.shields.io/badge/ML-scikit--learn-F7931E?logo=scikitlearn)](https://scikit-learn.org/)
[![Deployment](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com/)
[![Deployment](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://render.com/)

**[Live Application](https://loan-approval-prediction-woad.vercel.app/)** · **[Backend API](https://loan-approval-prediction-q95j.onrender.com/health)** · **[API Documentation](https://loan-approval-prediction-q95j.onrender.com/docs)**

</div>

---

## Overview

LoanAI is an end-to-end web application for exploring machine-learning-based loan eligibility assessment. Applicants submit demographic and financial information through a responsive Next.js interface. A FastAPI service runs a trained Logistic Regression pipeline, returns an approval estimate, and provides feature-level explanations generated with SHAP.

The application also creates a downloadable PDF report from the prediction already returned by the API. Generating the report does **not** run a second prediction.

> **Important:** LoanAI is an educational and decision-support project. Its output is a model-generated estimate, not a loan offer, financial advice, or a guarantee of approval. Real lending decisions must be made by the relevant financial institution.

## Live deployment

| Component | Deployment |
| --- | --- |
| Frontend | [Vercel application](https://loan-approval-prediction-woad.vercel.app/) |
| Backend | [Render API](https://loan-approval-prediction-q95j.onrender.com/) |
| Health check | [API health](https://loan-approval-prediction-q95j.onrender.com/health) |
| Interactive API docs | [FastAPI Swagger UI](https://loan-approval-prediction-q95j.onrender.com/docs) |

The backend is hosted on Render's free instance. After periods of inactivity, the service may spin down; the first request can take noticeably longer while the instance starts. This is a hosting cold start, not necessarily a model failure.

## Key features

- **Loan eligibility estimate:** submits an 11-field application to the trained model.
- **Explainable output:** returns SHAP contributions grouped by the original applicant features.
- **Probability and threshold:** displays the model probability and configured decision threshold.
- **PDF assessment report:** downloads a one-page report containing the submitted application, returned prediction, probability, threshold, and explanation.
- **Passwordless authentication:** Supabase email Magic Link sign-in.
- **Responsive interface:** Next.js App Router UI designed for desktop and mobile.
- **Separated services:** independently deployed frontend and prediction API.

## Application workflow

1. The user signs in using a Supabase email Magic Link.
2. The user completes the loan application form.
3. The Next.js frontend sends the application to the FastAPI `POST /predict` endpoint.
4. The backend loads the serialized scikit-learn pipeline and calculates the approval probability.
5. The configured threshold is applied to produce the model decision.
6. SHAP explains the returned prediction; the API sends the decision, probability, threshold, and feature contributions to the frontend.
7. The result page displays the response and can request a PDF from `POST /report/pdf`. The PDF endpoint formats the supplied result and application snapshot; it does not rerun inference.

## Machine learning

### Dataset

The project uses the Loan Prediction dataset stored at `data/train.csv`.

- 614 records
- 13 columns in the source CSV, including `Loan_ID` and target `Loan_Status`
- `Loan_ID` is removed because it is an identifier, not a predictive input.
- Target mapping: `Y = 1` (approved), `N = 0` (not approved).

### Preprocessing

The scikit-learn pipeline performs preprocessing within the model:

- Numerical features: median imputation and standard scaling.
- Categorical features: most-frequent imputation and one-hot encoding.
- Unknown categorical values are handled with `handle_unknown="ignore"`.
- The `Dependents` value `3+` is normalized to `3`.

### Final model

The selected model is **Logistic Regression**, serialized as `models/loan_model.pkl`. Its decision threshold is configured as **0.32**.

| Evaluation metric | Recorded result |
| --- | ---: |
| Accuracy | 86.18% |
| Precision | 84.00% |
| Recall | 98.82% |
| F1-score | 90.81% |
| ROC-AUC | 85.23% |

These values are the recorded evaluation results in `model_metadata.json`; they are not a guarantee of performance on new populations or future lending data. The dataset is relatively small, and its class distribution and evaluation split should be considered when interpreting the metrics.

### Explainability

SHAP (`shap.LinearExplainer`) is used to calculate feature contributions for the Logistic Regression model. Encoded categorical contributions are grouped back into their original feature names so the result is easier to interpret.

A SHAP contribution describes how a feature moves this model's output relative to its baseline. It does not establish causation and should not be interpreted as a universal lending rule.

## Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | Next.js 16, React 19, JavaScript |
| Styling and interaction | Tailwind CSS 4, Framer Motion, Lucide |
| Forms and validation | React Hook Form, Zod |
| Authentication | Supabase Auth, `@supabase/ssr` |
| Backend API | FastAPI, Pydantic, Uvicorn |
| Machine learning | Python, pandas, NumPy, scikit-learn |
| Explainability | SHAP |
| PDF generation | ReportLab |
| Frontend hosting | Vercel |
| Backend hosting | Render |

## Architecture

```text
                  Applicant
                      |
                      v
          Next.js / React Frontend
                (Vercel)
                      |
             HTTPS REST request
                      |
                      v
              FastAPI Backend
                 (Render)
                      |
             Prediction Service
                      |
          Scikit-learn Pipeline
          /                 \
   Probability           SHAP values
          \                 /
           \\               /
             API response
                  |
                  v
       Result page + PDF report
```

Supabase is used for passwordless authentication. The current application and prediction response are retained in the browser tab's `sessionStorage` for the result flow; this project does not configure a database for storing applicant profiles.

## Repository structure

```text
Loan_Approval_Prediction/
├── backend/
│   ├── __init__.py
│   ├── main.py                  # FastAPI routes and PDF report endpoint
│   └── requirements.txt         # Backend dependencies
├── data/
│   └── train.csv                # Training dataset
├── frontend/
│   ├── app/                     # Next.js App Router pages and auth callback
│   ├── components/              # Reusable UI, layout and form components
│   ├── hooks/                   # Authentication and API hooks
│   ├── lib/                     # API, validation, constants and Supabase clients
│   ├── public/
│   ├── .env.example
│   └── package.json
├── models/
│   └── loan_model.pkl           # Serialized trained pipeline
├── preprocessing.py
├── split_data.py
├── train_model.py
├── model_factory.py
├── model_comparison.py
├── prediction_service.py
├── shap_explain.py
├── threshold_optimization.py
├── threshold_selection.py
├── calibration.py
├── final_threshold_evaluation.py
├── probability_analysis.py
├── predict.py
├── test_prediction.py
├── model_metadata.json          # Model type, threshold and evaluation metrics
├── .gitignore
└── README.md
```

## Run locally

### Prerequisites

- Python 3.x
- Node.js (compatible with the installed Next.js version)
- npm
- A Supabase project for authentication

### 1. Clone the repository

```bash
git clone https://github.com/KAUSTAV-GH/Loan_Approval_Prediction.git
cd Loan_Approval_Prediction
```

### 2. Set up the Python backend

Create and activate a virtual environment from the repository root:

**Windows PowerShell**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**macOS / Linux**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install backend dependencies and start the API:

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

The API is available at:

- Health: `http://127.0.0.1:8000/health`
- Swagger docs: `http://127.0.0.1:8000/docs`

### 3. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env.local` and set the values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Use the Supabase project URL and publishable key from your own Supabase project. Do not commit `.env.local` or any secret key.

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:3000`.

### 4. Supabase authentication configuration

In the Supabase dashboard:

1. Enable the Email provider under Authentication providers.
2. Keep the project's passwordless Magic Link flow enabled.
3. Add the local callback URL `http://localhost:3000/auth/callback` to the allowed redirect URLs.
4. For production, add the deployed frontend callback URL: `https://loan-approval-prediction-woad.vercel.app/auth/callback`.
5. Set the production Site URL to the deployed frontend origin.

The exact email delivery limits depend on the Supabase project's configured email provider.

## Deployment configuration

### Vercel — frontend

Set the Vercel project root directory to `frontend` and configure these **Production** environment variables:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://loan-approval-prediction-q95j.onrender.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |

After changing environment variables, redeploy the Vercel project so the new values are included in the frontend build.

### Render — backend

The backend is deployed from the repository root with the following configuration:

- Root Directory: leave blank.
- Build Command: `pip install -r backend/requirements.txt`
- Start Command:

```bash
cd /opt/render/project/src && PYTHONPATH=backend uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

Set `FRONTEND_ORIGINS` to the comma-separated frontend origins that should be allowed by the API's CORS policy, for example:

```text
https://loan-approval-prediction-woad.vercel.app
```

If using additional Vercel preview domains, add only the specific origins that need access. Redeploy the Render service after changing environment variables.

**Deployment note:** CORS controls which browser origins can read API responses; it is not API authentication. The FastAPI prediction and PDF endpoints do not independently verify Supabase sessions. Do not treat the public API as protected by the frontend login.

## API reference

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Backend health check |
| `POST` | `/predict` | Predict loan eligibility and return SHAP contributions |
| `POST` | `/report/pdf` | Generate a PDF from the supplied application and prediction result |
| `GET` | `/docs` | Interactive Swagger documentation |

### Prediction input fields

The `POST /predict` endpoint expects the following fields:

`Gender`, `Married`, `Dependents`, `Education`, `Self_Employed`, `ApplicantIncome`, `CoapplicantIncome`, `LoanAmount`, `Loan_Amount_Term`, `Credit_History`, and `Property_Area`.

Refer to the interactive API documentation for the current request schema and response model.

## Quality checks

Frontend checks:

```bash
cd frontend
npm run lint
npm run build
```

Backend smoke checks:

```bash
# With the backend running
curl http://127.0.0.1:8000/health
```

Use the Swagger UI at `/docs` to submit a sample request to `POST /predict` and verify the response. Test PDF generation separately through the documented `POST /report/pdf` request schema.

## Limitations and responsible use

- This project is a demonstration and is not a regulated credit-scoring product.
- Historical training data may not represent current applicants, lending policies, or economic conditions.
- The evaluation dataset is small; performance metrics may vary across samples and populations.
- A model prediction is not a lender's final decision.
- SHAP values explain model behavior, not causal relationships.
- The API is publicly reachable when deployed; CORS alone does not restrict non-browser clients.
- Render free instances may experience cold-start latency after inactivity.
- Applicant data is sent to the configured backend for inference. Do not submit real sensitive financial or identity information to a demonstration deployment.

## Contributing

Contributions, bug reports, and suggestions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Use the issue templates to report reproducible problems or propose improvements.

## Author

**Kaustav Ghosh Hazra**

- GitHub: [@KAUSTAV-GH](https://github.com/KAUSTAV-GH)
- LinkedIn: [Profile](https://www.linkedin.com/in/kaustav-ghosh-hazra-27876037b/)

---

<div align="center">

Built as an end-to-end machine learning and full-stack deployment project.

</div>
