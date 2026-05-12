from groq import Groq
from app.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)

def generate_question(
    role: str,
    topic: str,
    context: str,
    previous_qa: list[dict],
    experience_level: str
) -> str:
    system = (
        f"You are a senior technical interviewer for {role} positions.\n"
        f"You ask ONE precise, thoughtful interview question at a time.\n"
        f"The question must be directly grounded in the provided knowledge context.\n"
        f"Adjust depth for a {experience_level} candidate.\n"
        f"Do not give hints. Do not ask compound questions.\n"
        f"Return only the question text, no preamble, no numbering."
    )

    messages = [{"role": "system", "content": system}]
    
    for qa in previous_qa:
        messages.append({"role": "assistant", "content": qa["question"]})
        messages.append({"role": "user", "content": qa["answer"]})

    messages.append({
        "role": "user",
        "content": f"Knowledge context:\n{context}\n\nTopic to evaluate: {topic}\n\nAsk the next interview question."
    })

    try:
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=300
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error generating question: {e}")
        return f"Could you explain your understanding of {topic}?"
