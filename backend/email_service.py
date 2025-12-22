import smtplib
from email.message import EmailMessage
import os
from typing import Optional

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", SMTP_USERNAME)

def send_task_email_sync(to_email: str, task_title: str, task_description: str, member_name: str):
    """Send email notification for task assignment"""
    
    if not SMTP_USERNAME or not SMTP_PASSWORD:
        print("SMTP credentials not configured. Skipping email.")
        return
    
    message = EmailMessage()
    message["From"] = SMTP_FROM_EMAIL
    message["To"] = to_email
    message["Subject"] = f"New Task Assigned: {task_title}"
    
    body = f"""
Hi {member_name},

You have been assigned a new task:

Task: {task_title}
Description: {task_description}

Please log in to the task management system to view and update your task status.

Best regards,
Task Management Team
    """
    
    message.set_content(body)
    
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(message)
        print(f"Email sent successfully to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
        # Don't raise the exception to avoid breaking the API response
