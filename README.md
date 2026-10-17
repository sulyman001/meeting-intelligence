# Meeting Intelligence

AI-powered meeting intelligence platform that converts recordings and transcripts into structured, reviewable Minutes of Meeting, decisions, action points, risks, open questions, and next steps.

## Locked MVP Stack

- Frontend: Next.js + React + TypeScript
- UI: Tailwind CSS + shadcn/ui
- Backend: FastAPI + Python
- Validation: Pydantic
- ORM/Migrations: SQLAlchemy + Alembic
- Database: PostgreSQL
- Queue/Workers: Celery + Redis
- Storage: AWS S3
- Authentication: Clerk
- Speech-to-Text: OpenAI Speech-to-Text API
- LLM: OpenAI Responses API with structured outputs
- Orchestration: deterministic Python state machine
- Monitoring: Sentry + structured logging
- CI/CD: GitHub Actions
- Containers: Docker
- Testing: Pytest, Vitest, React Testing Library, Playwright

## Repository Structure

```text
meeting-intelligence/
├── apps/
│   ├── web/
│   └── api/
├── services/
│   └── worker/
├── packages/
│   └── shared/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── ai-evaluation/
├── docs/
│   ├── product/
│   ├── architecture/
│   ├── api/
│   └── deployment/
├── scripts/
├── .github/workflows/
├── .env.example
├── docker-compose.yml
└── README.md
```

## Local Foundation Setup

1. Copy `.env.example` to `.env` and fill required values.
2. Start PostgreSQL and Redis: `docker compose up -d`.
3. Install API dependencies: `cd apps/api && pip install -r requirements.txt`.
4. Start API: `make api`.
5. Install web dependencies: `cd apps/web && npm install`.
6. Start web: `make web`.
7. Start worker when Celery tasks are introduced: `make worker`.

## Sprint 1 Goal

Establish a working foundation with repository structure, environment configuration, authentication integration points, database connectivity, processing-job scaffolding, logging, CI, and a basic frontend shell.
