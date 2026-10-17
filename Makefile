.PHONY: help api web worker test lint

help:
	@echo "Targets: api web worker test lint"

api:
	cd apps/api && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

web:
	cd apps/web && npm run dev

worker:
	cd services/worker && celery -A app.celery_app worker --loglevel=INFO

test:
	pytest -q

lint:
	ruff check apps/api services/worker tests
