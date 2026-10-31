from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Float,
    Boolean,
    DateTime,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="student")  # 'student' or 'admin'
    department = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=utcnow)

    reports = relationship("Report", back_populates="user", cascade="all, delete-orphan")


class Report(Base):
    __tablename__ = "reports"

    id = Column(String(30), primary_key=True, index=True)  # e.g., "FIX-2026-8492"
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)
    building = Column(String(100), nullable=False)
    floor = Column(String(50), nullable=False)
    room = Column(String(50), nullable=False)
    image_path = Column(String(255), nullable=True)
    severity = Column(String(20), nullable=False, default="Medium")  # Low, Medium, High, Critical
    priority = Column(String(20), nullable=False, default="Medium")  # Low, Medium, High, Critical
    suggested_priority = Column(String(20), nullable=False, default="Medium")
    priority_reason = Column(Text, nullable=True)  # JSON string or bullet points explaining scoring
    is_priority_overridden = Column(Boolean, default=False)
    status = Column(String(30), nullable=False, default="Submitted")
    # Submitted -> Under Review -> Assigned -> In Progress -> Resolved -> Closed
    assigned_team = Column(String(100), nullable=True)
    is_urgent = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)
    resolved_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="reports")
    status_history = relationship(
        "StatusHistory",
        back_populates="report",
        cascade="all, delete-orphan",
        order_by="desc(StatusHistory.created_at)"
    )
    duplicate_suggestions_as_source = relationship(
        "DuplicateSuggestion",
        foreign_keys="DuplicateSuggestion.report_id",
        back_populates="report",
        cascade="all, delete-orphan"
    )
    duplicate_suggestions_as_target = relationship(
        "DuplicateSuggestion",
        foreign_keys="DuplicateSuggestion.matching_report_id",
        back_populates="matching_report",
        cascade="all, delete-orphan"
    )


class DuplicateSuggestion(Base):
    __tablename__ = "duplicate_suggestions"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String(30), ForeignKey("reports.id"), nullable=False)
    matching_report_id = Column(String(30), ForeignKey("reports.id"), nullable=False)
    similarity_score = Column(Float, nullable=False)  # Composite score (0-100 or 0-1)
    text_similarity = Column(Float, nullable=False)
    location_match = Column(Boolean, default=False)
    category_match = Column(Boolean, default=False)
    review_status = Column(String(20), default="pending")  # 'pending', 'confirmed', 'rejected'
    created_at = Column(DateTime, default=utcnow)

    report = relationship("Report", foreign_keys=[report_id], back_populates="duplicate_suggestions_as_source")
    matching_report = relationship("Report", foreign_keys=[matching_report_id], back_populates="duplicate_suggestions_as_target")


class StatusHistory(Base):
    __tablename__ = "status_history"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String(30), ForeignKey("reports.id"), nullable=False)
    old_status = Column(String(30), nullable=True)
    new_status = Column(String(30), nullable=False)
    updated_by = Column(String(100), nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow)

    report = relationship("Report", back_populates="status_history")

