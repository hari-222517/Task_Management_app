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

def send_member_welcome_email(to_email: str, member_name: str, group_name: str):
    """Send welcome email to new group member"""
    
    if not SMTP_USERNAME or not SMTP_PASSWORD:
        print("SMTP credentials not configured. Skipping email.")
        return
    
    message = EmailMessage()
    message["From"] = SMTP_FROM_EMAIL
    message["To"] = to_email
    message["Subject"] = f"Welcome to {group_name}"
    
    body = f"""
Hi {member_name},

You have been added to the group "{group_name}" in the Task Management system.

You can now:
- View and manage tasks assigned to you
- Communicate with team members
- Track project progress

Please log in to the task management system to get started.

Best regards,
Task Management Team
    """
    
    message.set_content(body)
    
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(message)
        print(f"Welcome email sent successfully to {to_email}")
    except Exception as e:
        print(f"Failed to send welcome email to {to_email}: {e}")
        # Don't raise the exception to avoid breaking the API response

def send_member_removal_email(to_email: str, member_name: str, group_name: str):
    """Send email notification when member is removed from group"""
    
    if not SMTP_USERNAME or not SMTP_PASSWORD:
        print("SMTP credentials not configured. Skipping email.")
        return
    
    message = EmailMessage()
    message["From"] = SMTP_FROM_EMAIL
    message["To"] = to_email
    message["Subject"] = f"Removed from {group_name}"
    
    body = f"""
Hi {member_name},

You have been removed from the group "{group_name}" in the Task Management system.

Your access to this group's tasks and member information has been revoked.

If you believe this was done in error, please contact the group administrator.

Best regards,
Task Management Team
    """
    
    message.set_content(body)
    
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(message)
        print(f"Removal email sent successfully to {to_email}")
    except Exception as e:
        print(f"Failed to send removal email to {to_email}: {e}")
        # Don't raise the exception to avoid breaking the API response
