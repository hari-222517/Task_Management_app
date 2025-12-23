from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Group(Base):
    __tablename__ = "groups"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    members = relationship("Member", back_populates="group", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="group", cascade="all, delete-orphan")

class Member(Base):
    __tablename__ = "members"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    group_id = Column(Integer, ForeignKey("groups.id", ondelete="CASCADE"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    group = relationship("Group", back_populates="members")
    assigned_tasks = relationship("Task", back_populates="assigned_to", cascade="all, delete-orphan")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    status = Column(String(50), default="pending")
    assigned_to_id = Column(Integer, ForeignKey("members.id", ondelete="SET NULL"))
    group_id = Column(Integer, ForeignKey("groups.id", ondelete="CASCADE"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    group = relationship("Group", back_populates="tasks")
    assigned_to = relationship("Member", back_populates="assigned_tasks")
