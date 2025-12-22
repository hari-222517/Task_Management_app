from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Group, Member, Task
from schemas import GroupCreate, GroupResponse, MemberCreate, MemberResponse, TaskCreate, TaskResponse
from email_service import send_task_email_sync
import uvicorn

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Management API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Task Management API"}

# Group endpoints
@app.post("/groups/", response_model=GroupResponse)
def create_group(group: GroupCreate, db: Session = Depends(get_db)):
    db_group = Group(name=group.name, description=group.description)
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

@app.get("/groups/", response_model=list[GroupResponse])
def get_groups(db: Session = Depends(get_db)):
    return db.query(Group).all()

@app.get("/groups/{group_id}", response_model=GroupResponse)
def get_group(group_id: int, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return group

# Member endpoints
@app.post("/groups/{group_id}/members/", response_model=MemberResponse)
def add_member_to_group(group_id: int, member: MemberCreate, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    db_member = Member(name=member.name, email=member.email, group_id=group_id)
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

@app.get("/groups/{group_id}/members/", response_model=list[MemberResponse])
def get_group_members(group_id: int, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    return db.query(Member).filter(Member.group_id == group_id).all()

@app.delete("/members/{member_id}")
def remove_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    db.delete(member)
    db.commit()
    return {"message": "Member removed successfully"}

# Task endpoints
@app.post("/groups/{group_id}/tasks/", response_model=TaskResponse)
def create_task(group_id: int, task: TaskCreate, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    member = db.query(Member).filter(Member.id == task.assigned_to_id).first()
    if not member or member.group_id != group_id:
        raise HTTPException(status_code=404, detail="Member not found in this group")
    
    db_task = Task(
        title=task.title,
        description=task.description,
        assigned_to_id=task.assigned_to_id,
        group_id=group_id,
        status=task.status
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    # Send email notification
    try:
        send_task_email_sync(member.email, task.title, task.description, member.name)
    except Exception as e:
        print(f"Failed to send email: {e}")
    
    return db_task

@app.get("/groups/{group_id}/tasks/", response_model=list[TaskResponse])
def get_group_tasks(group_id: int, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    return db.query(Task).filter(Task.group_id == group_id).all()

@app.put("/tasks/{task_id}/status")
def update_task_status(task_id: int, status: str, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.status = status
    db.commit()
    return {"message": "Task status updated successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
