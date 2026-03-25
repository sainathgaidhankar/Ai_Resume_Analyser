# AI Resume Analyzer

AI Resume Analyzer is a React and React Router application that lets users upload a PDF resume, store it with Puter.js, and receive AI-generated ATS-style feedback.

## Features

- Browser-based authentication with Puter.js
- Resume PDF upload and storage
- PDF-to-image conversion for previewing resumes
- AI-generated feedback with ATS scoring and improvement tips
- Resume history saved in Puter KV storage

## Tech Stack

- React 19
- React Router 7
- TypeScript
- Tailwind CSS
- Zustand
- pdfjs-dist
- Puter.js

## Getting Started

### Prerequisites

- Node.js
- npm

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

### Typecheck

```bash
npm run typecheck
```

## Project Structure

- `app/`: routes, components, and client-side logic
- `constants/`: prompt and sample data definitions
- `public/`: static assets
- `types/`: shared TypeScript declarations

## Notes

- Resume analysis depends on Puter.js being available in the browser.
- Uploaded resume metadata and feedback are stored through Puter KV APIs.
