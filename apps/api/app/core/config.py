from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[4]
ENV_FILE = BASE_DIR / ".env"

class Settings(BaseSettings):
    app_env: str = "development"
    app_name: str = "meeting-intelligence"
    database_url: str
    redis_url: str
    log_level: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )

# @lru_cache
# def get_settings() -> Settings:
#     return Settings()

settings = Settings()
