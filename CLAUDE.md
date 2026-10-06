# CLAUDE.md

# Project Overview
# Project Context

This is a learning project.

The developer wants to understand every important concept instead of only receiving code.

When making changes:

- Explain the reasoning first.
- Then explain the implementation plan.
- Then write the code.
- Keep explanations beginner-friendly while using proper technical terminology.
- Never skip important concepts.

This project is a Loan Approval Prediction system built with Python.

The primary goal is to build a clean, production-quality machine learning application that follows industry best practices instead of simply achieving high accuracy.

Tech Stack:

- Python
- Pandas
- NumPy
- Scikit-learn
- SQLite
- Streamlit
- Matplotlib
- Git

---

# Development Philosophy

Always prioritize:

1. Readability
2. Maintainability
3. Simplicity
4. Correctness

Never sacrifice clean architecture for shorter code.

---

# Coding Rules

Always explain the implementation plan before writing code.

Break large tasks into smaller steps.

Never generate unnecessarily large files.

Keep functions short and focused.

Avoid duplicate code.

Use descriptive variable and function names.

Follow PEP 8.

Prefer built-in libraries whenever practical.

Use type hints where appropriate.

Write code that a beginner can understand.

---

# File Safety

Never delete files unless explicitly instructed.

Never overwrite existing code without explaining why.

If a major refactor is needed:

- Explain the reason
- Show the plan
- Then implement

---

# Project Structure

Keep responsibilities separated.

Recommended structure:

data/
models/
database/
utils/
streamlit_app/
main.py
requirements.txt

Do not mix UI code with machine learning logic.

---

# Machine Learning Rules

Always:

Explain preprocessing.

Explain feature engineering.

Explain why a model is selected.

Explain evaluation metrics.

Use train/test split unless instructed otherwise.

Prefer Scikit-learn APIs.

Whenever appropriate compare multiple models before selecting one.

Do not add unnecessary ML libraries.

---

# Database Rules

Use SQLite unless instructed otherwise.

Keep SQL queries readable.

Never hardcode database paths.

---

# Streamlit Rules

UI code should remain inside Streamlit files.

Keep business logic outside the UI.

Use clear labels.

Provide helpful error messages.

Keep the interface clean and simple.

---

# Error Handling

Handle exceptions gracefully.

Never silently ignore errors.

Explain the probable cause of failures.

Suggest fixes whenever possible.

---

# Documentation

Every important function should have a short docstring.

Avoid excessive comments.

Explain complex logic only.

---

# Git Rules

Suggest commit messages after meaningful changes.

Never rewrite git history.

Never delete branches.

---

# Communication Style

Before coding:

Explain the plan.

While coding:

Explain important decisions.

After coding:

Summarize:

- What changed
- Why it changed
- Possible improvements

---

# When Unsure

If requirements are unclear:

Ask questions before writing code.

Do not guess project requirements.

---

# Code Review

When reviewing code:

Identify bugs.

Identify performance improvements.

Identify readability improvements.

Suggest better architecture when appropriate.

---

# Goal

The objective is to create professional, production-quality software suitable for:

- GitHub Portfolio
- Resume Projects
- Technical Interviews
- Real-world deployment

Always think like a Senior Machine Learning Engineer.