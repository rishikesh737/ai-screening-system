import chromadb
from app.config import settings

_client = None

def get_chroma_client():
    global _client
    if _client is None:
        _client = chromadb.HttpClient(host=settings.CHROMA_HOST, port=settings.CHROMA_PORT)
    return _client

def get_collection(role: str):
    client = get_chroma_client()
    safe_role = role.lower().replace("/", "_").replace(" ", "_")
    return client.get_or_create_collection(name=f"knowledge_{safe_role}")
