"""Seed script for FixFlow demonstration data.
Provides pre-configured demo users, diverse campus issues across all 8 categories,
activity logs, and realistic duplicate pairs to immediately demonstrate NLP detection.
"""

import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from database import engine, SessionLocal, Base
import models
from auth import hash_password
from ai_engine import calculate_priority_score, calculate_duplicate_similarity


def utcnow():
    return datetime.now(timezone.utc)


def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Check if users already exist
        if db.query(models.User).count() > 0:
            print("Database already contains data. Skipping re-seed.")
            return

        print("Seeding FixFlow database with demonstration records...")

        # 1. Create Demo Users
        admin_user = models.User(
            name="Dr. Robert Vance",
            email="admin@campus.edu",
            password_hash=hash_password("admin123"),
            role="admin",
            department="Campus Facilities Directorate",
            created_at=utcnow() - timedelta(days=60)
        )
        student_alex = models.User(
            name="Alex Chen",
            email="student@campus.edu",
            password_hash=hash_password("student123"),
            role="student",
            department="Computer Science & Engineering",
            created_at=utcnow() - timedelta(days=30)
        )
        student_priya = models.User(
            name="Priya Sharma",
            email="priya@campus.edu",
            password_hash=hash_password("student123"),
            role="student",
            department="Mechanical Engineering",
            created_at=utcnow() - timedelta(days=25)
        )
        student_marcus = models.User(
            name="Marcus Taylor",
            email="marcus@campus.edu",
            password_hash=hash_password("student123"),
            role="student",
            department="Biotechnology",
            created_at=utcnow() - timedelta(days=20)
        )

        db.add_all([admin_user, student_alex, student_priya, student_marcus])
        db.commit()
        db.refresh(admin_user)
        db.refresh(student_alex)
        db.refresh(student_priya)
        db.refresh(student_marcus)

        now = utcnow()

        # 2. Demonstration Reports
        reports_data = [
            {
                "id": "FIX-2026-1001",
                "user_id": student_alex.id,
                "title": "Fan is not working in Room 204",
                "description": "The ceiling fan in classroom 204 makes a buzzing noise when switched on and does not rotate at all. It is getting very hot during afternoon lectures.",
                "category": "Electrical",
                "building": "Science & Technology Block",
                "floor": "2nd Floor",
                "room": "Room 204",
                "severity": "Medium",
                "is_urgent": False,
                "status": "Under Review",
                "assigned_team": "Electrical Maintenance Crew",
                "created_at": now - timedelta(days=2, hours=4),
            },
            {
                "id": "FIX-2026-1002",
                "user_id": student_priya.id,
                "title": "The ceiling fan in classroom 204 has stopped working",
                "description": "Fan stopped spinning completely in room 204 science block. Needs urgent electrical inspection or capacitor replacement.",
                "category": "Electrical",
                "building": "Science & Technology Block",
                "floor": "2nd Floor",
                "room": "Room 204",
                "severity": "Medium",
                "is_urgent": False,
                "status": "Submitted",
                "assigned_team": None,
                "created_at": now - timedelta(hours=14),
            },
            {
                "id": "FIX-2026-1003",
                "user_id": student_alex.id,
                "title": "Major water pipe leak near 1st floor washroom",
                "description": "High pressure pipe leakage causing water to pool across the central hallway corridor. High slip hazard for students and professors.",
                "category": "Plumbing",
                "building": "Engineering Annex",
                "floor": "1st Floor",
                "room": "Restroom Corridor B",
                "severity": "Critical",
                "is_urgent": True,
                "status": "In Progress",
                "assigned_team": "Plumbing & Sanitation Team",
                "created_at": now - timedelta(hours=28),
            },
            {
                "id": "FIX-2026-1004",
                "user_id": student_marcus.id,
                "title": "Water pooling outside restroom floor 1 from leaking pipe",
                "description": "Water overflowing onto the floor near the engineering annex first floor restrooms. Looks like a ruptured joint in the main supply pipe.",
                "category": "Plumbing",
                "building": "Engineering Annex",
                "floor": "1st Floor",
                "room": "Restroom Corridor B",
                "severity": "High",
                "is_urgent": True,
                "status": "Under Review",
                "assigned_team": None,
                "created_at": now - timedelta(hours=18),
            },
            {
                "id": "FIX-2026-1005",
                "user_id": student_alex.id,
                "title": "Centrifuge rotor unbalanced and vibrating violently",
                "description": "The high-speed benchtop centrifuge in Bio-Lab 3 emits burning smell and vibrates violently when exceeding 3000 RPM. Risk of mechanical failure.",
                "category": "Laboratory Equipment",
                "building": "Life Sciences Research Complex",
                "floor": "Ground Floor",
                "room": "Lab 003",
                "severity": "Critical",
                "is_urgent": True,
                "status": "Assigned",
                "assigned_team": "Precision Lab Instrument Specialist",
                "created_at": now - timedelta(days=1, hours=6),
            },
            {
                "id": "FIX-2026-1006",
                "user_id": student_priya.id,
                "title": "Campus Wi-Fi AP dropping connection every 5 minutes",
                "description": "Students in Library Quiet Study Hall 2B cannot access online research journals. Signal drops repeatedly and prompts re-authentication.",
                "category": "Internet and Networking",
                "building": "Central Library",
                "floor": "2nd Floor",
                "room": "Hall 2B",
                "severity": "Medium",
                "is_urgent": False,
                "status": "In Progress",
                "assigned_team": "IT & Network Infrastructure Unit",
                "created_at": now - timedelta(days=3),
            },
            {
                "id": "FIX-2026-1007",
                "user_id": student_marcus.id,
                "title": "Broken wooden armrest on Lecture Hall Chair #42",
                "description": "Wooden armrest has cracked off leaving exposed sharp splintered edges that tore a student backpack.",
                "category": "Furniture",
                "building": "Humanities Auditorium",
                "floor": "Ground Floor",
                "room": "Audi A",
                "severity": "Low",
                "is_urgent": False,
                "status": "Resolved",
                "assigned_team": "Carpentry & Facilities Services",
                "created_at": now - timedelta(days=7),
            },
            {
                "id": "FIX-2026-1008",
                "user_id": student_alex.id,
                "title": "Exterior concrete staircase railing loose and wobbly",
                "description": "The safety handrail on the north staircase between Science Block and Student Cafeteria has detached from the mortar anchor.",
                "category": "Infrastructure",
                "building": "Science & Technology Block",
                "floor": "Exterior North",
                "room": "North Staircase",
                "severity": "High",
                "is_urgent": True,
                "status": "In Progress",
                "assigned_team": "Civil Maintenance & Masonry Unit",
                "created_at": now - timedelta(days=4),
            },
            {
                "id": "FIX-2026-1009",
                "user_id": student_priya.id,
                "title": "Trash bin overflowing and food waste outside cafeteria",
                "description": "Recycling and organic waste bins outside cafeteria entrance are overflowing attracting stray pests and unpleasant odor.",
                "category": "Cleaning and Hygiene",
                "building": "Student Center & Cafeteria",
                "floor": "Ground Floor",
                "room": "East Entrance Patio",
                "severity": "Medium",
                "is_urgent": False,
                "status": "Resolved",
                "assigned_team": "Campus Janitorial & Sanitation",
                "created_at": now - timedelta(days=5),
            },
            {
                "id": "FIX-2026-1010",
                "user_id": student_marcus.id,
                "title": "Flickering fluorescent tube light in Seminar Room 102",
                "description": "Tube light at the front board flickers continuously causing headache and eye strain during presentations.",
                "category": "Electrical",
                "building": "Management Institute",
                "floor": "1st Floor",
                "room": "Room 102",
                "severity": "Low",
                "is_urgent": False,
                "status": "Submitted",
                "assigned_team": None,
                "created_at": now - timedelta(hours=6),
            }
        ]

        created_reports = {}
        for r_data in reports_data:
            # Calculate priority via AI Engine
            p_calc = calculate_priority_score(
                severity=r_data["severity"],
                is_urgent=r_data["is_urgent"],
                category=r_data["category"],
                duplicate_count=1 if r_data["id"] in ["FIX-2026-1001", "FIX-2026-1002", "FIX-2026-1003", "FIX-2026-1004"] else 0,
                age_hours=(now - r_data["created_at"]).total_seconds() / 3600.0
            )

            report = models.Report(
                id=r_data["id"],
                user_id=r_data["user_id"],
                title=r_data["title"],
                description=r_data["description"],
                category=r_data["category"],
                building=r_data["building"],
                floor=r_data["floor"],
                room=r_data["room"],
                severity=r_data["severity"],
                priority=p_calc["suggested_priority"],
                suggested_priority=p_calc["suggested_priority"],
                priority_reason="; ".join(p_calc["reasons"]),
                is_priority_overridden=False,
                status=r_data["status"],
                assigned_team=r_data["assigned_team"],
                is_urgent=r_data["is_urgent"],
                created_at=r_data["created_at"],
                updated_at=r_data["created_at"] + timedelta(hours=1),
                resolved_at=(r_data["created_at"] + timedelta(days=2)) if r_data["status"] == "Resolved" else None
            )
            db.add(report)
            created_reports[r_data["id"]] = report

        db.commit()

        # 3. Add Status History
        histories = [
            models.StatusHistory(
                report_id="FIX-2026-1001",
                old_status="Submitted",
                new_status="Under Review",
                updated_by="Dr. Robert Vance (Admin)",
                comment="Assigned priority assessment. Contacted electrical technician crew.",
                created_at=now - timedelta(days=1, hours=18)
            ),
            models.StatusHistory(
                report_id="FIX-2026-1003",
                old_status="Submitted",
                new_status="Under Review",
                updated_by="Dr. Robert Vance (Admin)",
                comment="High risk flood notification received. Safety alert dispatched.",
                created_at=now - timedelta(hours=26)
            ),
            models.StatusHistory(
                report_id="FIX-2026-1003",
                old_status="Under Review",
                new_status="In Progress",
                updated_by="Dr. Robert Vance (Admin)",
                comment="Plumbing crew shut off isolation valve. Replacement pipe section arriving.",
                created_at=now - timedelta(hours=20)
            ),
            models.StatusHistory(
                report_id="FIX-2026-1005",
                old_status="Submitted",
                new_status="Assigned",
                updated_by="Dr. Robert Vance (Admin)",
                comment="Assigned to external precision lab instrument service partner.",
                created_at=now - timedelta(hours=22)
            ),
            models.StatusHistory(
                report_id="FIX-2026-1006",
                old_status="Submitted",
                new_status="In Progress",
                updated_by="Dr. Robert Vance (Admin)",
                comment="Network admin tracing faulty PoE injector on switch port 14.",
                created_at=now - timedelta(days=2)
            ),
            models.StatusHistory(
                report_id="FIX-2026-1007",
                old_status="Submitted",
                new_status="In Progress",
                updated_by="Dr. Robert Vance (Admin)",
                comment="Chair moved to carpentry workshop.",
                created_at=now - timedelta(days=6)
            ),
            models.StatusHistory(
                report_id="FIX-2026-1007",
                old_status="In Progress",
                new_status="Resolved",
                updated_by="Dr. Robert Vance (Admin)",
                comment="New solid oak armrest installed and sanded smooth. Re-installed in Audi A.",
                created_at=now - timedelta(days=5)
            ),
            models.StatusHistory(
                report_id="FIX-2026-1009",
                old_status="Submitted",
                new_status="Resolved",
                updated_by="Dr. Robert Vance (Admin)",
                comment="Bins emptied, disinfected, and additional 100L heavy-duty receptacle installed.",
                created_at=now - timedelta(days=4)
            )
        ]
        db.add_all(histories)
        db.commit()

        # 4. Pre-calculated Duplicate Suggestions for Judge Review
        dup1 = models.DuplicateSuggestion(
            report_id="FIX-2026-1002",
            matching_report_id="FIX-2026-1001",
            similarity_score=87.5,
            text_similarity=81.2,
            location_match=True,
            category_match=True,
            review_status="pending",
            created_at=now - timedelta(hours=14)
        )
        dup2 = models.DuplicateSuggestion(
            report_id="FIX-2026-1004",
            matching_report_id="FIX-2026-1003",
            similarity_score=83.0,
            text_similarity=76.8,
            location_match=True,
            category_match=True,
            review_status="pending",
            created_at=now - timedelta(hours=18)
        )
        db.add_all([dup1, dup2])
        db.commit()

        print("FixFlow demonstration data successfully seeded!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

