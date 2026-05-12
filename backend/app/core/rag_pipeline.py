from app.vectorstore.retriever import retrieve_chunks
from app.config import settings
from groq import Groq
import json

client = Groq(api_key=settings.GROQ_API_KEY)

def retrieve_context(role: str, skills: list, domains: list, topic_hint: str) -> str:
    query = f"Explain {topic_hint} concepts relevant to {role}. Focus on practical application. Skills context: {', '.join(skills[:5])}"
    chunks = retrieve_chunks(role, query, n_results=4)
    
    context_parts = []
    for c in chunks:
        source = c['metadata'].get('source', 'Unknown')
        page = c['metadata'].get('page', '?')
        context_parts.append(f"[Source: {source}, Page: {page}]\n{c['text']}")
    
    context_str = "\n\n".join(context_parts)
    return context_str

def get_topic_list(role: str, domains: list, skills: list) -> list[str]:
    try:
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are a technical interview planner. Return only valid JSON."
                },
                {
                    "role": "user",
                    "content": f"Given a candidate for {role} with skills {skills} and domain exposure {domains}, generate exactly 8 distinct technical topics to evaluate in an interview. Topics should range from foundational to advanced. Return ONLY a JSON object: {{\"topics\": [list of 8 strings]}}"
                }
            ],
            temperature=0.4,
            max_tokens=400,
            response_format={"type": "json_object"}
        )
        parsed = json.loads(response.choices[0].message.content)
        return parsed.get("topics", [])[:8]
    except Exception as e:
        print(f"Error generating topics: {e}")
        return [f"General {role} Topic {i}" for i in range(1, 9)]
