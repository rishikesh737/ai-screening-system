from groq import Groq
from app.config import settings
import json

client = Groq(api_key=settings.GROQ_API_KEY)

def generate_session_report_dict(transcript: str, role: str) -> dict:
    try:
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": f"You are evaluating a technical interview transcript for a {role} candidate. Return only valid JSON."
                },
                {
                    "role": "user",
                    "content": f"Interview transcript:\n{transcript}\n\n"
                               "Provide a structured assessment as JSON:\n"
                               "{\n"
                               "  \"summary\": \"2-3 sentence overall performance summary\",\n"
                               "  \"strengths\": [\"topic or skill they showed strength in\"],\n"
                               "  \"areas_for_improvement\": [\"topic or skill to improve\"]\n"
                               "}"
                }
            ],
            temperature=0.3,
            max_tokens=600,
            response_format={"type": "json_object"}
        )
        parsed = json.loads(response.choices[0].message.content)
        return parsed
    except Exception as e:
        print(f"Error generating report: {e}")
        return {
            "summary": "Report generation failed due to an error.",
            "strengths": [],
            "areas_for_improvement": []
        }
