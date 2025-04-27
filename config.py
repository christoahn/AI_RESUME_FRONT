import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY') or os.getenv('CHATGPT_API')

if not OPENAI_API_KEY:
    print("Warning: OPENAI_API_KEY is not set in environment variables")
else:
    os.environ['OPENAI_API_KEY'] = OPENAI_API_KEY

DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
HOST = os.getenv('HOST', '0.0.0.0')
PORT = int(os.getenv('PORT', '5000'))

DEFAULT_MODEL = os.getenv('DEFAULT_MODEL', 'deepseek-chat') 
