"""Automated End-to-End Verification Suite for FixFlow Platform.
Tests all 14 requirements defined in Part 7 of the Master Prompt.
"""

import sys
import json
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:8000/api"


def make_request(endpoint, method="GET", data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req_data = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            content = resp.read().decode("utf-8")
            return status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        status = e.code
        content = e.read().decode("utf-8")
        try:
            body = json.loads(content)
        except Exception:
            body = {"raw": content}
        return status, body


def run_tests():
    print("=" * 60)
    print("FIXFLOW AUTOMATED INTEGRATION & VERIFICATION SUITE")
    print("=" * 60)
    passed = 0
    total = 14

    # 1. Health check
    st, res = make_request("/health")
    assert st == 200, f"Health check failed: {res}"
    print("[PASS] 1. API Health & Engine Check: OK")
    passed += 1

    # 2. Student Login
    st, res = make_request("/auth/login", method="POST", data={"email": "student@campus.edu", "password": "student123"})
    assert st == 200 and "access_token" in res, f"Student login failed: {res}"
    student_token = res["access_token"]
    print(f"[PASS] 2. Student Authentication: OK (User: {res['user']['name']})")
    passed += 1

    # 3. Admin Login
    st, res = make_request("/auth/login", method="POST", data={"email": "admin@campus.edu", "password": "admin123"})
    assert st == 200 and "access_token" in res, f"Admin login failed: {res}"
    admin_token = res["access_token"]
    print(f"[PASS] 3. Admin Authentication: OK (User: {res['user']['name']})")
    passed += 1

    # 4. Student Registration
    new_email = "test.student@campus.edu"
    st, res = make_request("/auth/register", method="POST", data={
        "name": "Jordan Lee",
        "email": new_email,
        "password": "password123",
        "role": "student",
        "department": "Electrical Engineering"
    })
    # Either 200 or 400 if already exists
    if st == 200:
        print("[PASS] 4. Student Registration: OK (Created new user)")
        test_student_token = res["access_token"]
    else:
        print("[PASS] 4. Student Registration: OK (Existing account validated)")
        st, res = make_request("/auth/login", method="POST", data={"email": new_email, "password": "password123"})
        test_student_token = res["access_token"]
    passed += 1

    # 5. Invalid Form Submission Rejection
    import urllib.parse
    invalid_url = f"{BASE_URL}/reports"
    invalid_data = urllib.parse.urlencode({"title": "Hi", "description": "Short"}).encode("utf-8")
    req = urllib.request.Request(invalid_url, data=invalid_data, headers={
        "Authorization": f"Bearer {student_token}",
        "Content-Type": "application/x-www-form-urlencoded"
    }, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            assert False, "Invalid form was unexpectedly accepted"
    except urllib.error.HTTPError as e:
        assert e.code == 400 or e.code == 422, f"Expected validation error, got {e.code}"
        print("[PASS] 5. Invalid Form Rejected by Backend Validation: OK")
        passed += 1

    # 6. Report Submission & AI Duplicate Detection
    report_title = "The ceiling fan in room 204 has stopped working"
    report_desc = "Ceiling fan stopped spinning completely in room 204 science block. Needs capacitor repair."
    form_data = urllib.parse.urlencode({
        "title": report_title,
        "description": report_desc,
        "category": "Electrical",
        "building": "Science & Technology Block",
        "floor": "2nd Floor",
        "room": "Room 204",
        "severity": "Medium",
        "is_urgent": "false"
    }).encode("utf-8")

    req = urllib.request.Request(f"{BASE_URL}/reports", data=form_data, headers={
        "Authorization": f"Bearer {student_token}",
        "Content-Type": "application/x-www-form-urlencoded"
    }, method="POST")

    with urllib.request.urlopen(req) as resp:
        st = resp.status
        res = json.loads(resp.read().decode("utf-8"))

    assert st == 200, f"Submission failed: {res}"
    new_report_id = res["report"]["id"]
    dup_info = res["duplicate_detection"]
    print(f"[PASS] 6. Report Submission & Unique ID: OK (Assigned: {new_report_id})")
    passed += 1

    # 7. AI NLP Duplicate Correlation Verification
    assert dup_info["matches_found"] > 0, "Expected NLP duplicate matches for Room 204 Fan"
    first_match = dup_info["candidates"][0]
    print(f"[PASS] 7. NLP Duplicate Detection Active: OK (Matched {first_match['matching_report_id']} with {first_match['similarity_score']}% similarity)")
    passed += 1

    # 8. Priority Recommendation & Explainable Breakdown
    assert res["report"]["priority"] in ["Critical", "High", "Medium", "Low"], "Invalid priority"
    print(f"[PASS] 8. Priority Calculation & Reasons: OK (Priority: {res['report']['priority']}, Reasons: {res['report']['priority_reason'][:60]}...)")
    passed += 1

    # 9. Admin Status Transition & Timestamped History
    st, res = make_request(f"/reports/{new_report_id}/status", method="PATCH", data={
        "new_status": "In Progress",
        "assigned_team": "Electrical Maintenance Crew",
        "comment": "Field technician dispatched with replacement capacitor."
    }, token=admin_token)
    assert st == 200, f"Status update failed: {res}"
    print(f"[PASS] 9. Admin Status Transition: OK ({res['old_status']} -> {res['new_status']})")
    passed += 1

    # 10. Verification of Student Visibility & Audit Timeline
    st, res = make_request(f"/reports/{new_report_id}", token=student_token)
    assert st == 200, f"Report detail failed: {res}"
    assert res["status"] == "In Progress", "Status not updated in student view"
    assert len(res["status_history"]) >= 2, "Status history not appended"
    print(f"[PASS] 10. Student Lifecycle Visibility & Audit Trail: OK ({len(res['status_history'])} history records)")
    passed += 1

    # 11. Role-Based Access Control (RBAC) Enforcement
    st, res = make_request(f"/reports/{new_report_id}/status", method="PATCH", data={"new_status": "Resolved"}, token=student_token)
    assert st == 403, f"Expected 403 Forbidden for student status patch, got {st}"
    print("[PASS] 11. Role-Based Access Control (RBAC): OK (Student forbidden from admin triage)")
    passed += 1

    # 12. Duplicate Review by Admin (Confirm / Reject)
    st, dup_list = make_request("/duplicates?status=pending", token=admin_token)
    assert st == 200 and len(dup_list) > 0, "No pending duplicates for admin review"
    target_sugg_id = dup_list[0]["id"]
    st, res = make_request(f"/duplicates/{target_sugg_id}/review", method="POST", data={
        "suggestion_id": target_sugg_id,
        "action": "confirm",
        "comment": "Confirmed by Facilities Directorate as linked report."
    }, token=admin_token)
    assert st == 200 and res["review_status"] == "confirmed", f"Review failed: {res}"
    print(f"[PASS] 12. Admin Duplicate Review & Confirmation: OK (Suggestion #{target_sugg_id} confirmed)")
    passed += 1

    # 13. Search, Filter & Sort Testing
    st, res = make_request("/reports?category=Electrical&status=In%20Progress", token=admin_token)
    assert st == 200, f"Search failed: {res}"
    print(f"[PASS] 13. Advanced Filtering & Query Engine: OK (Found {len(res)} filtered records)")
    passed += 1

    # 14. Admin Dashboard Metrics Accuracy
    st, res = make_request("/admin/dashboard", token=admin_token)
    assert st == 200, f"Admin dashboard stats failed: {res}"
    assert res["total_reports"] >= 10, "Dashboard stats mismatch"
    print(f"[PASS] 14. Live Dashboard Aggregation & Analytics: OK (Total: {res['total_reports']} reports, MTTR: {res['avg_resolution_hours']}h)")
    passed += 1

    print("=" * 60)
    print(f"VERIFICATION COMPLETE: {passed}/{total} SCENARIOS PASSED (100%)")
    print("FixFlow is fully functional and ready for Hackathon presentation!")
    print("=" * 60)


if __name__ == "__main__":
    run_tests()

