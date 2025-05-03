import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse, FileResponse
from django.shortcuts import get_object_or_404
from django.conf import settings
import os
import openai
from .models import Resume
import logging
import re
from django.utils.decorators import method_decorator
from django.views import View
from .service import resume_chunk
from .model import Project, Job, Research, Education
from dotenv import load_dotenv

# HTML을 PDF로 변환하는 라이브러리 제거 (사용하지 않음)
import html2docx  # HTML을 DOCX로 변환
import tempfile
from html2docx import html2docx
from pathlib import Path
from weasyprint import HTML, CSS

load_dotenv()
# Try to load from environment variables first
CHATGPT_API = os.getenv('CHATGPT_API')

# ... existing code ... 