import os
import random
import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, or_

from database import engine, Base, get_db
import models
import schemas
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    require_admin,
    require_student,
)
from ai_engine import calculate_duplicate_similarity, calculate_priority_score
from seed_data import seed_database

# Create tables and seed data if fresh
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title="FixFlow API",
    description="Backend API for FixFlow — AI-Powered Smart Campus Issue Reporting and Resolution Platform",
    version="1.0.0"
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Uploads directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")


def utcnow():
    return datetime.now(timezone.utc)


def generate_issue_id() -> str:
    """Generate a readable, unique campus issue ID: e.g. FIX-2026-8492"""
    random_digits = random.randint(1000, 9999)
    return f"FIX-2026-{random_digits}"


# ---------------------------------------------------------
# Health Check
# ---------------------------------------------------------
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "FixFlow Campus API",
        "timestamp": utcnow().isoformat(),
        "ai_engine": "TF-IDF + Cosine Similarity (Scikit-learn active)"
    }


# ---------------------------------------------------------
# Authentication Endpoints
# ---------------------------------------------------------
@app.post("/api/auth/register", response_model=schemas.Token)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    # Allow role 'admin' only if email has admin or explicitly registered
    role = user_in.role if user_in.role in ["student", "admin"] else "student"

    user = models.User(
        name=user_in.name.strip(),
        email=user_in.email.lower().strip(),
        password_hash=hash_password(user_in.password),
        role=role,
        department=user_in.department.strip() if user_in.department else "General Campus",
        created_at=utcnow()
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": user.email, "role": user.role, "id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


@app.post("/api/auth/login", response_model=schemas.Token)
def login(creds: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == creds.email.lower().strip()).first()
    if not user or not verify_password(creds.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token = create_access_token(data={"sub": user.email, "role": user.role, "id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


@app.get("/api/auth/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user


# ---------------------------------------------------------
# Report Submission & Management Endpoints
# ---------------------------------------------------------
@app.post("/api/reports")
async def create_report(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    building: str = Form(...),
    floor: str = Form(...),
    room: str = Form(...),
    severity: str = Form("Medium"),
    is_urgent: bool = Form(False),
    image: Optional[UploadFile] = File(None),
    current_user: models.User = Depends(require_student),
    db: Session = Depends(get_db)
):
    # Form validation
    if len(title.strip()) < 5:
        raise HTTPException(status_code=400, detail="Title must be at least 5 characters long.")
    if len(description.strip()) < 10:
        raise HTTPException(status_code=400, detail="Description must be at least 10 characters long.")

    valid_categories = [
        "Electrical", "Plumbing", "Infrastructure", "Furniture",
        "Cleaning and Hygiene", "Internet and Networking",
        "Laboratory Equipment", "Other"
    ]
    if category not in valid_categories:
        category = "Other"

    # Image upload handling
    image_rel_path = None
    if image and image.filename:
        # Validate mime type
        valid_mimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
        if image.content_type not in valid_mimes:
            raise HTTPException(
                status_code=400,
                detail="Invalid file format. Allowed formats: JPG, PNG, WEBP."
            )

        content = await image.read()
        if len(content) > 5 * 1024 * 1024:  # 5MB limit
            raise HTTPException(
                status_code=400,
                detail="Image file size exceeds the 5MB institutional limit."
            )

        file_ext = os.path.splitext(image.filename)[1].lower() or ".jpg"
        unique_filename = f"{uuid.uuid4().hex}{file_ext}"
        destination = os.path.join(UPLOADS_DIR, unique_filename)
        with open(destination, "wb") as f:
            f.write(content)
        image_rel_path = f"/uploads/{unique_filename}"

    # Generate unique Issue ID
    issue_id = generate_issue_id()
    while db.query(models.Report).filter(models.Report.id == issue_id).first():
        issue_id = generate_issue_id()

    # Query active/unresolved reports for NLP duplicate detection
    unresolved_reports = db.query(models.Report).filter(
        models.Report.status.notin_(["Resolved", "Closed"])
    ).all()

    existing_dicts = [
        {
            "id": r.id,
            "title": r.title,
            "description": r.description,
            "category": r.category,
            "building": r.building,
            "room": r.room,
            "status": r.status,
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in unresolved_reports
    ]

    # Run genuine NLP duplicate engine
    nlp_matches = calculate_duplicate_similarity(
        new_title=title,
        new_desc=description,
        new_category=category,
        new_building=building,
        new_room=room,
        existing_reports=existing_dicts,
        similarity_threshold=0.45
    )

    duplicate_count = len(nlp_matches)

    # Calculate transparent priority score
    priority_result = calculate_priority_score(
        severity=severity,
        is_urgent=is_urgent,
        category=category,
        duplicate_count=duplicate_count,
        age_hours=0.0
    )

    now = utcnow()
    report = models.Report(
        id=issue_id,
        user_id=current_user.id,
        title=title.strip(),
        description=description.strip(),
        category=category,
        building=building.strip(),
        floor=floor.strip(),
        room=room.strip(),
        image_path=image_rel_path,
        severity=severity,
        priority=priority_result["suggested_priority"],
        suggested_priority=priority_result["suggested_priority"],
        priority_reason="; ".join(priority_result["reasons"]),
        is_priority_overridden=False,
        status="Submitted",
        assigned_team=None,
        is_urgent=is_urgent,
        created_at=now,
        updated_at=now
    )
    db.add(report)
    db.commit()

    # Initial Status History entry
    history_entry = models.StatusHistory(
        report_id=issue_id,
        old_status=None,
        new_status="Submitted",
        updated_by=f"{current_user.name} ({current_user.role.capitalize()})",
        comment="Issue registered successfully via student portal.",
        created_at=now
    )
    db.add(history_entry)

    # Create DuplicateSuggestion records for admin review
    saved_suggestions = []
    for match in nlp_matches:
        dup = models.DuplicateSuggestion(
            report_id=issue_id,
            matching_report_id=match["matching_report_id"],
            similarity_score=match["similarity_score"],
            text_similarity=match["text_similarity"],
            location_match=match["location_match"],
            category_match=match["category_match"],
            review_status="pending",
            created_at=now
        )
        db.add(dup)
        saved_suggestions.append(dup)

    db.commit()
    db.refresh(report)

    return {
        "report": {
            "id": report.id,
            "title": report.title,
            "description": report.description,
            "category": report.category,
            "building": report.building,
            "floor": report.floor,
            "room": report.room,
            "severity": report.severity,
            "priority": report.priority,
            "suggested_priority": report.suggested_priority,
            "priority_reason": report.priority_reason,
            "status": report.status,
            "image_path": report.image_path,
            "created_at": report.created_at.isoformat(),
        },
        "duplicate_detection": {
            "matches_found": duplicate_count,
            "candidates": nlp_matches,
            "message": (
                f"FixFlow NLP Engine detected {duplicate_count} potentially related campus report(s). "
                "These have been queued for administrative review."
                if duplicate_count > 0
                else "No conflicting duplicates detected. Report queued for routine triage."
            )
        }
    }


@app.get("/api/reports")
def list_reports(
    category: Optional[str] = None,
    building: Optional[str] = None,
    priority: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = None,
    view: Optional[str] = None,  # 'mine' or 'all'
    sort_by: str = "created_at",
    sort_order: str = "desc",
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(models.Report)

    # Enforce role boundaries: Students can only view their own reports
    if current_user.role != "admin" or view == "mine":
        query = query.filter(models.Report.user_id == current_user.id)

    # Filters
    if category and category != "All":
        query = query.filter(models.Report.category == category)
    if building and building != "All":
        query = query.filter(models.Report.building == building)
    if priority and priority != "All":
        query = query.filter(models.Report.priority == priority)
    if status_filter and status_filter != "All":
        query = query.filter(models.Report.status == status_filter)
    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                models.Report.id.ilike(search_pattern),
                models.Report.title.ilike(search_pattern),
                models.Report.description.ilike(search_pattern),
                models.Report.room.ilike(search_pattern),
                models.Report.building.ilike(search_pattern),
            )
        )

    # Sorting
    sort_col = getattr(models.Report, sort_by, models.Report.created_at)
    if sort_order.lower() == "asc":
        query = query.order_by(sort_col.asc())
    else:
        query = query.order_by(sort_col.desc())

    reports = query.all()

    # Format result with user info & duplicate count
    results = []
    for r in reports:
        dup_count = db.query(models.DuplicateSuggestion).filter(
            or_(
                models.DuplicateSuggestion.report_id == r.id,
                models.DuplicateSuggestion.matching_report_id == r.id
            )
        ).count()

        results.append({
            "id": r.id,
            "user_id": r.user_id,
            "title": r.title,
            "description": r.description,
            "category": r.category,
            "building": r.building,
            "floor": r.floor,
            "room": r.room,
            "image_path": r.image_path,
            "severity": r.severity,
            "priority": r.priority,
            "suggested_priority": r.suggested_priority,
            "priority_reason": r.priority_reason,
            "is_priority_overridden": r.is_priority_overridden,
            "status": r.status,
            "assigned_team": r.assigned_team,
            "is_urgent": r.is_urgent,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "updated_at": r.updated_at.isoformat() if r.updated_at else None,
            "resolved_at": r.resolved_at.isoformat() if r.resolved_at else None,
            "user_name": r.user.name if r.user else "Anonymous Student",
            "user_email": r.user.email if r.user else "",
            "user_department": r.user.department if r.user else "",
            "duplicate_count": dup_count
        })

    return results


@app.get("/api/reports/{report_id}")
def get_report_detail(
    report_id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Issue report not found.")

    # Students can only view their own reports
    if current_user.role != "admin" and report.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You can only view your own submitted reports."
        )

    # Fetch status history
    history = [
        {
            "id": h.id,
            "report_id": h.report_id,
            "old_status": h.old_status,
            "new_status": h.new_status,
            "updated_by": h.updated_by,
            "comment": h.comment,
            "created_at": h.created_at.isoformat() if h.created_at else None
        }
        for h in report.status_history
    ]

    # Fetch duplicate suggestions
    dup_records = db.query(models.DuplicateSuggestion).filter(
        or_(
            models.DuplicateSuggestion.report_id == report_id,
            models.DuplicateSuggestion.matching_report_id == report_id
        )
    ).all()

    duplicates = []
    for d in dup_records:
        other_id = d.matching_report_id if d.report_id == report_id else d.report_id
        other_rep = db.query(models.Report).filter(models.Report.id == other_id).first()
        duplicates.append({
            "id": d.id,
            "report_id": d.report_id,
            "matching_report_id": other_id,
            "similarity_score": d.similarity_score,
            "text_similarity": d.text_similarity,
            "location_match": d.location_match,
            "category_match": d.category_match,
            "review_status": d.review_status,
            "created_at": d.created_at.isoformat() if d.created_at else None,
            "matching_title": other_rep.title if other_rep else "",
            "matching_description": other_rep.description if other_rep else "",
            "matching_building": other_rep.building if other_rep else "",
            "matching_room": other_rep.room if other_rep else "",
            "matching_category": other_rep.category if other_rep else "",
            "matching_status": other_rep.status if other_rep else ""
        })

    return {
        "id": report.id,
        "user_id": report.user_id,
        "title": report.title,
        "description": report.description,
        "category": report.category,
        "building": report.building,
        "floor": report.floor,
        "room": report.room,
        "image_path": report.image_path,
        "severity": report.severity,
        "priority": report.priority,
        "suggested_priority": report.suggested_priority,
        "priority_reason": report.priority_reason,
        "is_priority_overridden": report.is_priority_overridden,
        "status": report.status,
        "assigned_team": report.assigned_team,
        "is_urgent": report.is_urgent,
        "created_at": report.created_at.isoformat() if report.created_at else None,
        "updated_at": report.updated_at.isoformat() if report.updated_at else None,
        "resolved_at": report.resolved_at.isoformat() if report.resolved_at else None,
        "user_name": report.user.name if report.user else "Anonymous Student",
        "user_email": report.user.email if report.user else "",
        "user_department": report.user.department if report.user else "",
        "status_history": history,
        "duplicate_count": len(duplicates),
        "potential_duplicates": duplicates
    }


@app.patch("/api/reports/{report_id}/status")
def update_report_status(
    report_id: str,
    payload: schemas.ReportStatusUpdate,
    admin_user: models.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Issue report not found.")

    valid_statuses = ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved", "Closed"]
    if payload.new_status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )

    old_status = report.status
    report.status = payload.new_status
    report.updated_at = utcnow()

    if payload.assigned_team:
        report.assigned_team = payload.assigned_team.strip()

    if payload.new_status == "Resolved" and not report.resolved_at:
        report.resolved_at = utcnow()
    elif payload.new_status != "Resolved":
        report.resolved_at = None

    history = models.StatusHistory(
        report_id=report.id,
        old_status=old_status,
        new_status=payload.new_status,
        updated_by=f"{admin_user.name} (Admin)",
        comment=payload.comment or f"Status transitioned from {old_status} to {payload.new_status}.",
        created_at=utcnow()
    )
    db.add(history)
    db.commit()
    db.refresh(report)

    return {
        "message": "Status updated successfully.",
        "id": report.id,
        "old_status": old_status,
        "new_status": report.status,
        "assigned_team": report.assigned_team,
        "updated_at": report.updated_at.isoformat()
    }


@app.patch("/api/reports/{report_id}/priority")
def override_report_priority(
    report_id: str,
    payload: schemas.ReportPriorityOverride,
    admin_user: models.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Issue report not found.")

    valid_priorities = ["Low", "Medium", "High", "Critical"]
    if payload.priority not in valid_priorities:
        raise HTTPException(status_code=400, detail="Invalid priority level.")

    old_priority = report.priority
    report.priority = payload.priority
    report.is_priority_overridden = True
    report.updated_at = utcnow()

    history = models.StatusHistory(
        report_id=report.id,
        old_status=report.status,
        new_status=report.status,
        updated_by=f"{admin_user.name} (Admin)",
        comment=f"Priority manually changed from {old_priority} to {payload.priority}. Note: {payload.comment or 'Administrative override'}",
        created_at=utcnow()
    )
    db.add(history)
    db.commit()
    db.refresh(report)

    return {
        "message": "Priority updated successfully.",
        "id": report.id,
        "priority": report.priority,
        "suggested_priority": report.suggested_priority,
        "is_priority_overridden": report.is_priority_overridden
    }


# ---------------------------------------------------------
# Duplicate Suggestions Management
# ---------------------------------------------------------
@app.get("/api/duplicates")
def list_duplicate_suggestions(
    status_filter: Optional[str] = Query("pending", alias="status"),
    admin_user: models.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    query = db.query(models.DuplicateSuggestion)
    if status_filter and status_filter != "all":
        query = query.filter(models.DuplicateSuggestion.review_status == status_filter)

    suggestions = query.order_by(desc(models.DuplicateSuggestion.similarity_score)).all()

    results = []
    for s in suggestions:
        rep_source = db.query(models.Report).filter(models.Report.id == s.report_id).first()
        rep_target = db.query(models.Report).filter(models.Report.id == s.matching_report_id).first()

        results.append({
            "id": s.id,
            "report_id": s.report_id,
            "matching_report_id": s.matching_report_id,
            "similarity_score": s.similarity_score,
            "text_similarity": s.text_similarity,
            "location_match": s.location_match,
            "category_match": s.category_match,
            "review_status": s.review_status,
            "created_at": s.created_at.isoformat() if s.created_at else None,
            "source_title": rep_source.title if rep_source else "Deleted",
            "source_description": rep_source.description if rep_source else "",
            "source_building": rep_source.building if rep_source else "",
            "source_room": rep_source.room if rep_source else "",
            "source_category": rep_source.category if rep_source else "",
            "source_status": rep_source.status if rep_source else "",
            "source_severity": rep_source.severity if rep_source else "",
            "matching_title": rep_target.title if rep_target else "Deleted",
            "matching_description": rep_target.description if rep_target else "",
            "matching_building": rep_target.building if rep_target else "",
            "matching_room": rep_target.room if rep_target else "",
            "matching_category": rep_target.category if rep_target else "",
            "matching_status": rep_target.status if rep_target else "",
            "matching_severity": rep_target.severity if rep_target else "",
        })

    return results


@app.post("/api/duplicates/{suggestion_id}/review")
def review_duplicate_suggestion(
    suggestion_id: int,
    payload: schemas.DuplicateReviewAction,
    admin_user: models.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    suggestion = db.query(models.DuplicateSuggestion).filter(
        models.DuplicateSuggestion.id == suggestion_id
    ).first()
    if not suggestion:
        raise HTTPException(status_code=404, detail="Duplicate suggestion not found.")

    if payload.action not in ["confirm", "reject"]:
        raise HTTPException(status_code=400, detail="Action must be 'confirm' or 'reject'.")

    suggestion.review_status = "confirmed" if payload.action == "confirm" else "rejected"

    source_rep = db.query(models.Report).filter(models.Report.id == suggestion.report_id).first()
    target_rep = db.query(models.Report).filter(models.Report.id == suggestion.matching_report_id).first()

    # Log action to history
    comment_text = (
        f"Admin confirmed duplicate link with issue {suggestion.matching_report_id} ({suggestion.similarity_score}% similarity). {payload.comment or ''}".strip()
        if payload.action == "confirm"
        else f"Admin rejected duplicate suggestion with issue {suggestion.matching_report_id}. {payload.comment or ''}".strip()
    )

    if source_rep:
        hist = models.StatusHistory(
            report_id=source_rep.id,
            old_status=source_rep.status,
            new_status=source_rep.status,
            updated_by=f"{admin_user.name} (Admin)",
            comment=comment_text,
            created_at=utcnow()
        )
        db.add(hist)

    db.commit()

    return {
        "message": f"Duplicate suggestion marked as {suggestion.review_status}.",
        "suggestion_id": suggestion.id,
        "review_status": suggestion.review_status
    }


# ---------------------------------------------------------
# Dashboard Statistics Endpoints
# ---------------------------------------------------------
@app.get("/api/admin/dashboard", response_model=schemas.DashboardStats)
def get_admin_dashboard_stats(
    admin_user: models.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    reports = db.query(models.Report).all()
    total_count = len(reports)
    pending_count = sum(1 for r in reports if r.status in ["Submitted", "Under Review"])
    in_progress_count = sum(1 for r in reports if r.status in ["Assigned", "In Progress"])
    resolved_count = sum(1 for r in reports if r.status in ["Resolved", "Closed"])
    critical_count = sum(1 for r in reports if r.priority == "Critical" and r.status not in ["Resolved", "Closed"])
    high_priority_count = sum(1 for r in reports if r.priority == "High" and r.status not in ["Resolved", "Closed"])

    # Duplicate count
    dup_count = db.query(models.DuplicateSuggestion).filter(
        models.DuplicateSuggestion.review_status == "pending"
    ).count()

    # Calculate average resolution hours for resolved reports
    resolved_reports = [r for r in reports if r.resolved_at and r.created_at]
    if resolved_reports:
        total_hours = sum((r.resolved_at - r.created_at).total_seconds() / 3600.0 for r in resolved_reports)
        avg_res_hours = round(total_hours / len(resolved_reports), 1)
    else:
        avg_res_hours = 36.5  # reasonable baseline

    # Category stats
    cat_names = [
        "Electrical", "Plumbing", "Infrastructure", "Furniture",
        "Cleaning and Hygiene", "Internet and Networking",
        "Laboratory Equipment", "Other"
    ]
    category_stats = []
    for cat in cat_names:
        c_reps = [r for r in reports if r.category == cat]
        if c_reps:
            c_resolved = sum(1 for r in c_reps if r.status in ["Resolved", "Closed"])
            category_stats.append({
                "category": cat,
                "count": len(c_reps),
                "resolved": c_resolved,
                "pending": len(c_reps) - c_resolved
            })
    category_stats.sort(key=lambda x: x["count"], reverse=True)

    # Building stats
    building_dict = {}
    for r in reports:
        b = r.building or "Other"
        if b not in building_dict:
            building_dict[b] = {"building": b, "count": 0, "critical_or_high": 0}
        building_dict[b]["count"] += 1
        if r.priority in ["Critical", "High"] and r.status not in ["Resolved", "Closed"]:
            building_dict[b]["critical_or_high"] += 1

    building_stats = sorted(list(building_dict.values()), key=lambda x: x["count"], reverse=True)

    # Priority stats
    priority_order = ["Critical", "High", "Medium", "Low"]
    priority_stats = []
    for p in priority_order:
        p_reps = [r for r in reports if r.priority == p and r.status not in ["Resolved", "Closed"]]
        priority_stats.append({
            "priority": p,
            "count": len(p_reps)
        })

    # Aging buckets for unresolved issues
    now = utcnow()
    active_reps = [r for r in reports if r.status not in ["Resolved", "Closed"]]
    b_under_24 = 0
    b_24_48 = 0
    b_48_72 = 0
    b_over_72 = 0

    for r in active_reps:
        if r.created_at:
            # handle timezone naive vs aware
            created_tz = r.created_at if r.created_at.tzinfo else r.created_at.replace(tzinfo=timezone.utc)
            hours = (now - created_tz).total_seconds() / 3600.0
            if hours < 24:
                b_under_24 += 1
            elif hours < 48:
                b_24_48 += 1
            elif hours < 72:
                b_48_72 += 1
            else:
                b_over_72 += 1

    aging_buckets = [
        {"range": "< 24 Hours", "count": b_under_24},
        {"range": "24 - 48 Hours", "count": b_24_48},
        {"range": "48 - 72 Hours", "count": b_48_72},
        {"range": "> 72 Hours (Overdue)", "count": b_over_72},
    ]

    return {
        "total_reports": total_count,
        "pending_reports": pending_count,
        "in_progress_reports": in_progress_count,
        "resolved_reports": resolved_count,
        "critical_reports": critical_count,
        "high_priority_reports": high_priority_count,
        "avg_resolution_hours": avg_res_hours,
        "duplicate_suggestions_count": dup_count,
        "category_stats": category_stats,
        "building_stats": building_stats,
        "priority_stats": priority_stats,
        "aging_buckets": aging_buckets
    }


@app.get("/api/student/dashboard")
def get_student_dashboard_stats(
    current_user: models.User = Depends(require_student),
    db: Session = Depends(get_db)
):
    user_reports = db.query(models.Report).filter(
        models.Report.user_id == current_user.id
    ).order_by(desc(models.Report.created_at)).all()

    total_submitted = len(user_reports)
    pending = sum(1 for r in user_reports if r.status in ["Submitted", "Under Review"])
    in_progress = sum(1 for r in user_reports if r.status in ["Assigned", "In Progress"])
    resolved = sum(1 for r in user_reports if r.status in ["Resolved", "Closed"])

    recent = [
        {
            "id": r.id,
            "title": r.title,
            "category": r.category,
            "building": r.building,
            "room": r.room,
            "severity": r.severity,
            "priority": r.priority,
            "status": r.status,
            "assigned_team": r.assigned_team,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "updated_at": r.updated_at.isoformat() if r.updated_at else None
        }
        for r in user_reports[:6]
    ]

    return {
        "total_submitted": total_submitted,
        "pending": pending,
        "in_progress": in_progress,
        "resolved": resolved,
        "recent_submissions": recent
    }


# Reset demo data on-demand for hackathon live presentations
@app.post("/api/admin/reset-demo-data")
def reset_demo_data(
    admin_user: models.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    db.query(models.StatusHistory).delete()
    db.query(models.DuplicateSuggestion).delete()
    db.query(models.Report).delete()
    db.query(models.User).delete()
    db.commit()
    seed_database()
    return {"message": "Database reset to official demonstration state."}

