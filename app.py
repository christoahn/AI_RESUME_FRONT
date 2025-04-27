from flask import Flask, request, jsonify, send_from_directory, render_template_string
from flask_cors import CORS
import os
import sys
import json

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from resume_generator import ResumeGenerator
from config import DEBUG, HOST, PORT

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

@app.route('/api/generate-resume', methods=['POST'])
def generate_resume():
    try:
        data = request.json
        
        action = data.get('action')
        if action != 'generate_resume':
            return jsonify({"status": "error", "message": "Invalid action parameter. Expected 'generate_resume'."})
        
        name = data.get('name') or ''
        phone = data.get('phone') or ''
        email = data.get('email') or ''
        jobs = data.get('jobs') or {}
        projects = data.get('projects') or {}
        
        basic_info = {
            'name': name,
            'phone': phone,
            'email': email
        }
        
        html = ResumeGenerator.render_resume_html(
            basic_info, {}, jobs, projects, ''
        )
        
        return jsonify({"status": "success", "result": html})
    except Exception as e:
        print(f"Error generating resume: {str(e)}")
        return jsonify({"status": "error", "message": str(e)})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "up"})

@app.route('/pages/<path:path>')
def serve_pages(path):
    return send_from_directory('pages', path)

if __name__ == '__main__':
    app.run(debug=DEBUG, host=HOST, port=PORT)
