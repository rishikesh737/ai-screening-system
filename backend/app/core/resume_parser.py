from groq import Groq
from app.config import settings
import pypdf
import io
import json

client = Groq(api_key=settings.GROQ_API_KEY)

def parse_resume(pdf_bytes: bytes) -> dict:
    resume_text = ""
    try:
        reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
        for page in reader.pages:
            text = page.extract_text()
            if text:
                resume_text += text + "\n"

        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are a resume parser. Extract structured information from the resume text.\n"
                               "Return ONLY a valid JSON object with these exact keys:\n"
                               "{\n"
                               "  \"skills\": [list of technical skills],\n"
                               "  \"technologies\": [frameworks, tools, languages],\n"
                               "  \"experience_level\": \"junior\" | \"mid\" | \"senior\",\n"
                               "  \"domains\": [areas like \"NLP\", \"backend\", \"data engineering\"],\n"
                               "  \"education\": \"brief description\"\n"
                               "}\n"
                               "Return only the JSON object, no preamble, no markdown backticks."
                },
                {
                    "role": "user",
                    "content": f"Parse this resume:\n\n{resume_text}"
                }
            ],
            temperature=0.1,
            max_tokens=800,
            response_format={"type": "json_object"}
        )
        parsed = json.loads(response.choices[0].message.content)
        parsed["_raw_text"] = resume_text
        return parsed
    except Exception as e:
        print(f"Error parsing resume: {e}")
        return {
            "skills": [],
            "technologies": [],
            "experience_level": "junior",
            "domains": [],
            "education": "",
            "_raw_text": resume_text
        }
