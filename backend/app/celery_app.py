from celery import Celery
from .config import settings

celery_app = Celery(
    "financial_forecast",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    result_expires=3600,      # keep results in Redis for 1 hour
    task_track_started=True,  # STARTED state is reported
)
