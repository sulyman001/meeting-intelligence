import os
from celery import Celery

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
celery_app = Celery("meeting_intelligence", broker=redis_url, backend=redis_url)
celery_app.conf.task_track_started = True
