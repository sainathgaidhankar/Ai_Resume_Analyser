# Resumind

Resumind is an AI-powered resume analysis system built as a final-year-project style web application. It uses Puter for authentication, file storage, KV storage, and AI inference, while the frontend is built with React, React Router, TypeScript, and Tailwind CSS.

## What It Does

Resumind lets a user:

- sign in with Puter
- upload a PDF resume
- choose an analysis mode such as `software`, `marketing`, `finance`, or `data-science`
- provide a target job title and job description
- receive structured AI feedback with ATS-style scoring
- review matched and missing keywords
- inspect section-wise resume analysis
- get rewrite suggestions and impact-focused bullet improvements
- view personalized recommendations for skills, certifications, and project ideas
- view likely interview questions based on the resume and target role
- export a print-ready PDF report
- store multiple resume versions and compare score changes over time

## Key Features

- Puter-based authentication, KV storage, and file storage
- ATS score, job-match score, and category-wise scoring
- explicit keyword extraction from the target job description
- role-specific analysis modes
- section detection for resume completeness
- AI rewrite suggestions and measurable-impact suggestions
- version history and side-by-side comparison
- trend charts for score progression
- admin analytics dashboard
- downloadable PDF analysis report

## Tech Stack

- React 19
- React Router 7
- TypeScript
- Tailwind CSS
- Zustand
- pdfjs-dist
- Puter.js
- Vitest

## Puter-Only Architecture

This project does not use a custom backend.

- `Puter Auth` handles login
- `Puter FS` stores uploaded resume PDFs and preview images
- `Puter KV` stores analysis records, version history metadata, and dashboard data sources
- `Puter AI` generates the structured resume analysis

## Main Modules

- `app/routes/upload.tsx`
  Handles resume upload, analysis-mode selection, keyword extraction, and AI analysis.

- `app/routes/resume.tsx`
  Displays the full review, recommendations, interview questions, and export action.

- `app/routes/compare.tsx`
  Compares two resume versions and shows score trends over time.

- `app/routes/admin.tsx`
  Shows admin analytics generated from stored Puter KV data.

- `app/lib/feedback.ts`
  Normalizes AI responses into a stable app schema.

- `app/lib/report.ts`
  Generates the printable report used for PDF export.

- `app/lib/analytics.ts`
  Builds dashboard analytics from stored analyses.

- `app/lib/resumeVersions.ts`
  Handles version grouping and version numbering.

## Getting Started

### Prerequisites

- Node.js
- npm
- internet access for Puter services

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Typecheck

```bash
npm run typecheck
```

### Run Tests

```bash
npm run test
```

## Current Project Status

Completed phases:

- Phase 1: core product upgrades
- Phase 2: smarter resume analysis
- Phase 3: resume history and comparison
- Phase 4: reporting and recommendations
- Phase 5: Puter-based roles and analytics
- Phase 6: tests, improved runtime states, and documentation

## Notes

- Admin access is controlled by the allowlist in `constants/admin.ts`.
- Stored analyses depend on Puter AI returning valid structured content, but the app now normalizes incomplete responses defensively.
- The PDF export uses a print-friendly browser window and the system print dialog.
