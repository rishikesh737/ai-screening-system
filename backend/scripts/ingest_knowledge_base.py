import os
import sys
from pypdf import PdfReader
import uuid
import re

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.vectorstore.embedder import get_embedding
from app.vectorstore.chroma_client import get_collection
from langchain_text_splitters import RecursiveCharacterTextSplitter

KNOWLEDGE_BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../knowledge_base/books"))

def clean_text(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def ingest():
    role = "AI/ML Engineer"
    collection = get_collection(role)
    
    if not os.path.exists(KNOWLEDGE_BASE_DIR):
        print(f"Directory {KNOWLEDGE_BASE_DIR} does not exist. Skipping.")
        return

    pdf_files = [f for f in os.listdir(KNOWLEDGE_BASE_DIR) if f.endswith('.pdf')]
    if not pdf_files:
        print("No PDF files found.")
        return

    word_splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=100,
        separators=["\n\n", "\n", ". ", " "],
        length_function=lambda x: len(x.split())
    )

    for filename in pdf_files:
        filepath = os.path.join(KNOWLEDGE_BASE_DIR, filename)
        print(f"Processing {filename}...")
        
        try:
            reader = PdfReader(filepath)
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if not text:
                    continue
                
                text = clean_text(text)
                chunks = word_splitter.split_text(text)
                
                valid_chunks = [c for c in chunks if len(c.split()) >= 100]
                
                if not valid_chunks:
                    continue
                
                ids = [str(uuid.uuid4()) for _ in valid_chunks]
                embeddings = [get_embedding(c) for c in valid_chunks]
                metadatas = [{"source": filename, "page": i + 1, "role": role} for _ in valid_chunks]
                
                collection.add(
                    documents=valid_chunks,
                    embeddings=embeddings,
                    metadatas=metadatas,
                    ids=ids
                )
            print(f"Finished {filename}.")
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            
    print(f"Ingestion complete. Collection {collection.name} count: {collection.count()}")

if __name__ == "__main__":
    ingest()
