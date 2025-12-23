from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class GroupBase(BaseModel):
    name: str
    description: Optional[str] = None

class GroupCreate(GroupBase):
    pass

class GroupResponse(GroupBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class MemberBase(BaseModel):
    name: str
    email: EmailStr

class MemberCreate(MemberBase):
    pass

class MemberResponse(MemberBase):
    id: int
    group_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "pending"

class TaskCreate(TaskBase):
    assigned_to_id: Optional[int] = None
    assign_to_all: bool = False

class TaskResponse(TaskBase):
    id: int
    assigned_to_id: Optional[int]
    group_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
