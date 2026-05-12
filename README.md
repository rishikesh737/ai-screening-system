# PGAGI AI Screening System

## Overview
The PGAGI Screening System is an AI-powered autonomous interview platform designed to evaluate candidates for technical roles. It leverages RAG (Retrieval-Augmented Generation) to ask context-aware questions based on established technical literature and the candidate's parsed resume.

## System Architecture
```text
Frontend (Next.js 14)
   │
   ▼
Backend API (FastAPI)
   │
   ├── Core Pipeline
   │   ├── Resume Parser
   │   ├── Session Manager
   │   ├── RAG Orchestrator
   │   └── Answer Evaluator
   │
   ├── Database (PostgreSQL)  <-- Stores sessions, questions, answers, reports
   │
   ├── Vector Store (ChromaDB) <-- Stores document chunks for retrieval
   │
   └── LLM Engine (Groq API)   <-- llama-3.3-70b-versatile for parsing, generation, evaluation
```

## Tech Stack
| Layer        | Technology                        |
|--------------|-----------------------------------|
| Frontend     | Next.js 14, TypeScript, Tailwind  |
| Backend      | FastAPI, Python 3.11              |
| Database     | PostgreSQL 15 (SQLAlchemy ORM)    |
| Vector Store | ChromaDB                          |
| Embeddings   | sentence-transformers (local)     |
| LLM          | Groq API — llama-3.3-70b-versatile (free tier) |

## Setup Instructions

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Python 3.11

### Environment Variables
Copy `.env.example` to `.env` in the `backend/` directory. Fill in your `GROQ_API_KEY`.
Copy `.env.local.example` to `.env.local` in the `frontend/` directory.

### Running with Docker
Start the infrastructure (PostgreSQL and ChromaDB):
```bash
docker-compose up -d
```

### Running the Knowledge Base Ingestion Script
Before starting the backend, place any technical PDF books into `knowledge_base/books/`. Then run the ingestion script:
```bash
cd backend
source .venv/bin/activate
python scripts/ingest_knowledge_base.py
```

### Running the Backend
Set up the database schema:
```bash
cd backend
source .venv/bin/activate
alembic upgrade head
```
Start the server:
```bash
python main.py
```

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
Access the app at `http://localhost:3000`.

## Key Design Decisions
1. **Separation of Concerns**: The frontend acts solely as a UI layer, making no direct LLM or database calls. The FastAPI backend orchestrates all business logic, ensuring security and consistency.
2. **PostgreSQL for State Management**: We chose a relational database to maintain strict referential integrity between sessions, questions, answers, and reports, making the system highly traceable.
3. **Local Embeddings**: By using `sentence-transformers` locally, we eliminate the latency and cost of cloud embedding APIs while maintaining high retrieval accuracy.
4. **Groq API**: Utilizing Groq's extremely fast inference enables real-time dynamic questioning, which is critical for an interactive interview experience. JSON mode is heavily relied upon for structured data parsing.

## RAG Pipeline Explanation
The RAG pipeline operates by preprocessing technical literature into semantic chunks and indexing them in ChromaDB.
- **Chunking Strategy**: We use LangChain's RecursiveCharacterTextSplitter aiming for ~600-word chunks with 100-word overlaps. This maintains context continuity.
- **Embedding Model**: `all-MiniLM-L6-v2` offers an excellent balance between speed and semantic capture.
- **Retrieval Approach**: For each dynamically generated topic, we query ChromaDB for the top 4 most relevant chunks based on the candidate's skills and domains.
- **Prompt Design**: The system prompt forces the LLM to ground its question exclusively within the retrieved context, preventing hallucination and ensuring questions are evaluating factual knowledge.

## API Reference
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/v1/resume/upload` | Parses PDF resume, extracts skills, initializes session. |
| POST   | `/api/v1/interview/start` | Generates topics and returns the first question. |
| POST   | `/api/v1/interview/answer` | Saves answer, triggers next question or completes session. |
| GET    | `/api/v1/session/{id}` | Returns current progress and session status. |
| GET    | `/api/v1/report/{id}` | Generates or retrieves the final interview evaluation report. |
