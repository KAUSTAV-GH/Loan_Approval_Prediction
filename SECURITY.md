# Security Policy

## Scope

LoanAI is an educational demonstration project. It is not designed or certified as a production banking, lending, or regulated credit-decision system.

## Reporting a vulnerability

Please do not publish credentials, private applicant information, or exploitable details in a public issue.

Report suspected vulnerabilities privately to the repository maintainer through the contact options available on the maintainer's GitHub profile. Include:

- A concise description of the issue.
- Reproduction steps and affected component.
- Potential impact.
- Any suggested mitigation.

Allow reasonable time for investigation before public disclosure.

## Security notes

- Never commit `.env.local`, access tokens, Supabase secret keys, or private keys.
- Use only the Supabase publishable key in the browser. Privileged service-role keys must never be exposed to the frontend.
- CORS is not authentication. The deployed FastAPI endpoints do not independently enforce Supabase authentication.
- Do not submit real identity, financial, or other sensitive applicant information to the public demonstration.
- Keep dependencies and deployment environment variables maintained.
