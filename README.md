# CampusKit

A token-driven, themeable React component system for campus equipment booking.

## Current milestone

SASS design tokens compile into Bootstrap and Material Design 3 CSS custom-property themes. The docs app is a visual harness for switching themes and light/dark modes.

## Prerequisites

- Node.js 20+
- pnpm 9+

## Start the project

```bash
corepack pnpm install
```

If `pnpm` is not available directly in your terminal, keep using the `corepack pnpm` form in every command below. To enable the shorter `pnpm` form globally, run PowerShell as Administrator once and use `corepack enable`.

Start the docs harness with:

```bash
corepack pnpm --filter @campuskit/docs dev
```

Open it at the URL Vite prints (normally `http://localhost:5174`).

## API

Copy `server/.env.example` to `server/.env` and replace `JWT_SECRET`. Then run:

```bash
corepack pnpm --filter @campuskit/server dev
```

The API starts at `http://localhost:3001`. Demo accounts are `student@test.edu` / `Test@1234` and `admin@test.edu` / `Test@1234`.

## Booking app

With the API running, start the web application:

```bash
corepack pnpm --filter @campuskit/web dev
```

It runs at `http://localhost:5173` and uses `http://localhost:3001` by default. Set `VITE_API_BASE_URL` when deploying it elsewhere.

## End-to-end test

Install Chromium once, then run the booking flow:

```bash
corepack pnpm exec playwright install chromium
corepack pnpm test:e2e
```

The test signs in as the seeded student, opens the 3D Printer, selects an available slot, submits a booking request, and verifies the success notification.
In CI, Playwright starts an API backed by a fresh in-memory SQLite database, so it never mutates production or developer demo data. If servers are already running locally, Playwright reuses them.

## API tests

Run the lightweight API smoke tests independently of the browser flow:

```bash
corepack pnpm --filter @campuskit/server test
```

## Optional embeddable widget

The vanilla-JS availability widget is in [packages/widget](./packages/widget). It renders a read-only availability view for any equipment item outside a React application.

## Continuous integration

GitHub Actions runs linting, UI tests, and production builds on each push or pull request. A second workflow starts the API and booking app, then runs the Playwright booking flow in Chromium. Failed e2e runs upload the Playwright HTML report as an artifact.

## Deployment

Deployment settings for Render and the two Vercel projects are in [DEPLOYMENT.md](./DEPLOYMENT.md). The API Blueprint is defined in `render.yaml`.
