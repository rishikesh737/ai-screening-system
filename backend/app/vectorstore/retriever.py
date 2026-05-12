from app.vectorstore.chroma_client import get_collection
from app.vectorstore.embedder import get_embedding

def retrieve_chunks(role: str, query: str, n_results: int = 4) -> list[dict]:
    collection = get_collection(role)
    query_embedding = get_embedding(query)
    
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
    )
    
    docs = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    
    chunks = []
    if docs:
        for doc, meta in zip(docs, metadatas):
            chunks.append({
                "text": doc,
                "metadata": meta
            })
    return chunks
