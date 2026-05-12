from sentence_transformers import SentenceTransformer
from app.config import settings

# Load model lazily to avoid loading at import time
_model = None

def get_embedding(text: str) -> list[float]:
    global _model
    if _model is None:
        _model = SentenceTransformer(settings.EMBEDDING_MODEL)
    embedding = _model.encode(text)
    return embedding.tolist()
