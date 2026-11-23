# Contributing to LoanAI

Thank you for considering a contribution.

## Before you start

- Check existing issues and pull requests to avoid duplicate work.
- For substantial changes, open an issue first to discuss the proposed approach.
- Keep changes focused and avoid unrelated refactoring.
- Never commit credentials, environment files, private applicant data, or generated secrets.

## Development setup

Follow the local setup instructions in [README.md](README.md). The frontend and backend run as separate services.

## Branch and commit conventions

Create a focused branch from `main`, for example:

```text
docs/improve-api-guide
fix/prediction-error-handling
feat/accessibility-improvements
```

Use clear commit messages, such as:

- `docs: clarify local setup`
- `fix: handle API timeout`
- `feat: improve form accessibility`

## Before opening a pull request

Run the checks relevant to your changes.

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend:

- Start the API locally.
- Verify `GET /health`.
- Exercise any changed endpoint through `/docs`.
- Confirm that prediction request and response contracts remain compatible.

## Pull request expectations

A pull request should include:

1. A concise description of the problem and solution.
2. The relevant issue number, if applicable.
3. Screenshots for user-interface changes.
4. Test commands and their results.
5. Any required environment-variable or deployment changes.

Do not include real applicant records or secrets in screenshots, logs, or test fixtures.
