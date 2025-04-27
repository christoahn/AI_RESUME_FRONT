import json
import os
from models import generate_resume_content

class ResumeGenerator:
    @staticmethod
    def generate(user_input):
        try:
            system_role = "You are an AI resume generator. " \
            "You will generate detailed professional descriptions based on the provided keywords using STAR methodology " \
            "(Situation, Task, Action, Result). Your output should be in JSON format with fields for position, " \
            "duration, and detailed descriptions that include quantifiable results whenever possible."
            
            result = generate_resume_content(system_role, user_input)
            
            try:
                if isinstance(result, str):
                    result = result.replace("```json", "").replace("```", "").strip()
                    json_start = result.find('{')
                    json_end = result.rfind('}') + 1
                    if json_start >= 0 and json_end > json_start:
                        json_str = result[json_start:json_end]
                        parsed_result = json.loads(json_str)
                        return {
                            "status": "success",
                            "result": parsed_result,
                        }
            except Exception as json_err:
                print(f"JSON parsing error: {str(json_err)}")
            
            return {
                "status": "success",
                "result": {
                    "title": "Project",
                    "position": "Team Member",
                    "duration": "Recent",
                    "description": [
                        "Contributed to project development and implementation.",
                        "Participated in team collaboration and coordination.",
                        "Applied skills to meet project objectives and goals."
                    ]
                }
            }
        except Exception as e:
            print(f"Error in resume generation: {str(e)}")
            return {
                "status": "error",
                "message": str(e)
            }
    
    @staticmethod
    def render_resume_html(basic_info, education_list, work_experience_list, project_list, skills):
        try:
            html = f"""
            <div class="resume-container" style="font-family: 'Roboto', Arial, sans-serif; max-width: 800px; margin: 0 auto; background-color: white; color: #333; line-height: 1.5;">
                <div class="header" style="text-align: center; margin-bottom: 20px; padding-top: 30px;">
                    <h1 style="margin-bottom: 5px; font-size: 28px; color: #333;">{basic_info.get('name', '')}</h1>
                    <p style="font-size: 14px; color: #666; margin-bottom: 5px;">
                        {basic_info.get('email', '')} | {basic_info.get('phone', '')}"""
            
            if basic_info.get('address'):
                html += f" | {basic_info.get('address', '')}"
            
            html += """
                    </p>
            """
            
            links_html = ""
            if basic_info.get('linkedin'):
                links_html += f"<a href='{basic_info.get('linkedin')}' style='color: #0066cc; text-decoration: none;'>{basic_info.get('linkedin')}</a>"
            
            if basic_info.get('portfolio'):
                if links_html:
                    links_html += f" | <a href='{basic_info.get('portfolio')}' style='color: #0066cc; text-decoration: none;'>{basic_info.get('portfolio')}</a>"
                else:
                    links_html += f"<a href='{basic_info.get('portfolio')}' style='color: #0066cc; text-decoration: none;'>{basic_info.get('portfolio')}</a>"
            
            if links_html:
                html += f"<p style='font-size: 14px; color: #666;'>{links_html}</p>"
            
            html += """
                </div>
            """
            
            if work_experience_list and len(work_experience_list) > 0:
                html += """
                <div class="section" style="margin-bottom: 20px;">
                    <h2 style="border-bottom: 1px solid #ddd; padding-bottom: 5px; color: #444; font-size: 18px;">WORK EXPERIENCE</h2>
                """
                
                for job_key, job in work_experience_list.items():
                    company = job.get('company_name', '')
                    position = job.get('position', '')
                    duration = job.get('duration', '')
                    keywords = job.get('keywords', '')
                    
                    if not company or company == 'null':
                        continue
                    
                    html += f"""
                    <div class="item" style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between;">
                            <h3 style="margin-bottom: 3px; font-size: 16px; color: #333;">{company}</h3>
                            <span style="color: #666;">{duration}</span>
                        </div>
                        <p style="margin-top: 0; font-weight: bold; font-style: italic; color: #555;">{position}</p>
                        <p style="margin-top: 5px; color: #777;">Keywords: {keywords}</p>
                    </div>
                    """
                
                html += """
                </div>
                """
            
            if project_list and len(project_list) > 0:
                html += """
                <div class="section" style="margin-bottom: 20px;">
                    <h2 style="border-bottom: 1px solid #ddd; padding-bottom: 5px; color: #444; font-size: 18px;">PROJECTS</h2>
                """
                
                for project_key, project in project_list.items():
                    title = project.get('project_name', '')
                    role = project.get('role', '')
                    duration = project.get('duration', '')
                    keywords = project.get('keywords', '')
                    
                    if not title or title == 'null':
                        continue
                    
                    html += f"""
                    <div class="item" style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between;">
                            <h3 style="margin-bottom: 3px; font-size: 16px; color: #333;">{title}</h3>
                            <span style="color: #666;">{duration}</span>
                        </div>
                        <p style="margin-top: 0; font-weight: bold; font-style: italic; color: #555;">{role}</p>
                        <p style="margin-top: 5px; color: #777;">Keywords: {keywords}</p>
                    </div>
                    """
                
                html += """
                </div>
                """
            
            if skills and skills.strip():
                html += f"""
                <div class="section" style="margin-bottom: 20px;">
                    <h2 style="border-bottom: 1px solid #ddd; padding-bottom: 5px; color: #444; font-size: 18px;">SKILLS</h2>
                    <p style="margin-top: 5px; color: #555;">{skills}</p>
                </div>
                """
            
            html += """
            </div>
            """
            
            return html
        except Exception as e:
            print(f"Error rendering resume HTML: {str(e)}")
            return f"<div>Error generating resume: {str(e)}</div>" 
