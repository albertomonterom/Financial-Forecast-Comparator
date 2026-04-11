from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MONGODB_URL: str
    DB_NAME: str = "financial_forecast"
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 10080  # 7 days
    OPENAI_API_KEY: str = ""
    REDIS_URL: str = "redis://localhost:6379/0"

    class Config:
        env_file = ".env"
        extra = "ignore"  # ignore any extra env vars not defined here


settings = Settings()
