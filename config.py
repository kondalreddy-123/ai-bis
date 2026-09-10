from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str = "sqlite:///./aibissensor.db"
    openai_api_key: str | None = None
    llm_model: str | None = None
    embedding_model: str | None = None
    cors_origins: str = "http://localhost:5173"
    rate_limit_per_minute: int = 60
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
