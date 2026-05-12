from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_ENV: str = "development"
    SECRET_KEY: str = "changeme"
    DATABASE_URL: str
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8001
    CHROMA_COLLECTION_AI_ML: str = "knowledge_aiml"
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    MAX_QUESTIONS: int = 8
    QUESTIONS_PER_TOPIC: int = 2

    class Config:
        env_file = ".env"

settings = Settings()
