from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


# User Schemas
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=150)
    password: str = Field(..., min_length=6)
    role: str = "student"
    department: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    department: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# Status History Schema
class StatusHistoryOut(BaseModel):
    id: int
    report_id: str
    old_status: Optional[str]
    new_status: str
    updated_by: str
    comment: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Duplicate Suggestion Schema
class DuplicateSuggestionOut(BaseModel):
    id: int
    report_id: str
    matching_report_id: str
    similarity_score: float
    text_similarity: float
    location_match: bool
    category_match: bool
    review_status: str
    created_at: datetime
    # Matching report snapshot fields
    matching_title: Optional[str] = None
    matching_description: Optional[str] = None
    matching_category: Optional[str] = None
    matching_building: Optional[str] = None
    matching_room: Optional[str] = None
    matching_status: Optional[str] = None

    class Config:
        from_attributes = True


class DuplicateReviewAction(BaseModel):
    suggestion_id: int
    action: str  # 'confirm' or 'reject'
    comment: Optional[str] = None


# Report Schemas
class ReportCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=10)
    category: str
    building: str
    floor: str
    room: str
    severity: str = "Medium"  # Low, Medium, High, Critical
    is_urgent: bool = False


class ReportStatusUpdate(BaseModel):
    new_status: str
    comment: Optional[str] = None
    assigned_team: Optional[str] = None


class ReportPriorityOverride(BaseModel):
    priority: str
    comment: Optional[str] = None


class ReportOut(BaseModel):
    id: str
    user_id: int
    title: str
    description: str
    category: str
    building: str
    floor: str
    room: str
    image_path: Optional[str] = None
    severity: str
    priority: str
    suggested_priority: str
    priority_reason: Optional[str] = None
    is_priority_overridden: bool
    status: str
    assigned_team: Optional[str] = None
    is_urgent: bool
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    user_department: Optional[str] = None
    status_history: List[StatusHistoryOut] = []
    duplicate_count: int = 0
    potential_duplicates: List[Dict[str, Any]] = []

    class Config:
        from_attributes = True


# Analytics & Dashboard Schemas
class CategoryStat(BaseModel):
    category: str
    count: int
    resolved: int
    pending: int


class BuildingStat(BaseModel):
    building: str
    count: int
    critical_or_high: int


class PriorityStat(BaseModel):
    priority: str
    count: int


class AgingBucket(BaseModel):
    range: str
    count: int


class DashboardStats(BaseModel):
    total_reports: int
    pending_reports: int
    in_progress_reports: int
    resolved_reports: int
    critical_reports: int
    high_priority_reports: int
    avg_resolution_hours: float
    duplicate_suggestions_count: int
    category_stats: List[CategoryStat]
    building_stats: List[BuildingStat]
    priority_stats: List[PriorityStat]
    aging_buckets: List[AgingBucket]
