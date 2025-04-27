import os
from dotenv import load_dotenv
from openai import OpenAI
import json
from config import OPENAI_API_KEY

load_dotenv()

def generate_resume_content(system_prompt, user_input):
    try:
        client = OpenAI(api_key=OPENAI_API_KEY)
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo", 
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ]
        )
        result = completion.choices[0].message.content
        return result
    except Exception as e:
        print(f"Error in model generation: {str(e)}")
        fallback_response = "Error generating content. Please try again."
        return fallback_response
