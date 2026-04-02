import os
from openai import OpenAI
from dotenv import load_dotenv
import json

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_prompt(data):
    return f"""
You are a productivity assistant.

Your task is to break a given task into clear, actionable subtasks.

Main Task:
"{data}"

Instructions:
- Generate 3 to 5 meaningful subtasks
- Each subtask should be specific and actionable
- Avoid vague steps like "Do it" or "Work on it"
- Keep each subtask title short (1 line)
- Subtasks should logically help complete the main task
- Do NOT repeat the main task
- If the task is too vague, try to assume a meaningful interpretation and generate useful subtasks.

Return ONLY a JSON array of strings (no extra text):

RETURN FORMAT:
  {{
    "subTasks": [
    {{title : subtask 1,
    isChecked: false}},
    {{title : subtask 2,
    isChecked: false}},
    {{title : subtask 3,
    isChecked: false}}, etc..],
  }}


Example:
[
  "Research key concepts",
  "Prepare notes",
  "Practice related problems",
  "Review and revise"
]
"""


async def generate_subtasks(data):
    print(data)
    prompt = generate_prompt(data)

    response = client.chat.completions.create(
       model = "gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a productivity assistant."},
            {"role": "user", "content": prompt},
        ],
        response_format={"type": "json_object"}
    )
    content = response.choices[0].message.content
    return json.loads(content)