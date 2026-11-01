"""FixFlow AI and Machine Learning Engine
- Genuine NLP-based duplicate detection using TF-IDF Vectorization and Cosine Similarity (scikit-learn).
- Multi-factor location & category weighting.
- Rule-based transparent priority scoring with explicit reasoning breakdowns.
"""

import re
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# Common campus domain synonyms and contractions mapping for enhanced text normalization
SYNONYMS = {
    r"\blab\b": "laboratory",
    r"\bwashroom\b": "restroom",
    r"\btoilet\b": "restroom",
    r"\bbathroom\b": "restroom",
    r"\bac\b": "air conditioner",
    r"\ba/c\b": "air conditioner",
    r"\bfan\b": "ceiling fan",
    r"\bbroken\b": "not working damaged",
    r"\bstopped working\b": "not working defective",
    r"\bdoesn't work\b": "not working",
    r"\bleak\b": "leaking water leakage",
    r"\bleaking\b": "water leakage",
    r"\bprojector\b": "audio visual display projector",
    r"\bwifi\b": "internet network connection wi-fi",
    r"\bwi-fi\b": "internet network connection wi-fi",
}


def preprocess_text(text: str) -> str:
    """Preprocess text for TF-IDF: lowercasing, synonym normalization, and punctuation cleanup."""
    if not text:
        return ""
    text = text.lower().strip()
    for pattern, replacement in SYNONYMS.items():
        text = re.sub(pattern, replacement, text)
    # Remove excessive punctuation but keep alphanumerics
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def calculate_duplicate_similarity(
    new_title: str,
    new_desc: str,
    new_category: str,
    new_building: str,
    new_room: str,
    existing_reports: List[Dict[str, Any]],
    similarity_threshold: float = 0.45
) -> List[Dict[str, Any]]:
    """Compares a new report against existing active reports using TF-IDF + Cosine Similarity,

    augmented by category and location heuristics.
    Returns a list of match candidates with similarity percentages and explanations.
    """
    if not existing_reports:
        return []

    new_full_text = preprocess_text(f"{new_title} {new_desc}")
    candidates = []

    # Build corpus: [new_report_text, existing_report_1_text, ...]
    corpus = [new_full_text]
    valid_existing = []

    for rep in existing_reports:
        existing_text = preprocess_text(f"{rep.get('title', '')} {rep.get('description', '')}")
        if existing_text:
            corpus.append(existing_text)
            valid_existing.append(rep)

    if not valid_existing:
        return []

    # Fit TF-IDF Vectorizer
    try:
        vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words='english',
            min_df=1,
            sublinear_tf=True
        )
        tfidf_matrix = vectorizer.fit_transform(corpus)
        # Cosine similarity between new_report (index 0) and all existing reports (indices 1 to N)
        cosine_sims = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])[0]
    except Exception as e:
        # Fallback if vocabulary is trivial or single character
        cosine_sims = [0.0] * len(valid_existing)

    for idx, rep in enumerate(valid_existing):
        text_sim = float(cosine_sims[idx])

        # Category match
        same_category = (
            rep.get("category", "").strip().lower() == new_category.strip().lower()
        )

        # Location matches
        same_building = (
            rep.get("building", "").strip().lower() == new_building.strip().lower()
        )

        rep_room_clean = re.sub(r"\D", "", rep.get("room", "") or "")
        new_room_clean = re.sub(r"\D", "", new_room or "")
        same_room = False
        if rep_room_clean and new_room_clean and rep_room_clean == new_room_clean:
            same_room = True
        elif rep.get("room", "").strip().lower() == new_room.strip().lower() and rep.get("room"):
            same_room = True

        # Composite score weighting:
        # 60% text similarity + 20% category match + 20% location match (10% building + 10% room)
        location_score = 0.0
        if same_building:
            location_score += 0.5
        if same_room:
            location_score += 0.5

        category_score = 1.0 if same_category else 0.0

        # Composite similarity formula
        composite_score = (text_sim * 0.60) + (category_score * 0.20) + (location_score * 0.20)

        # Boost if text similarity is already very high (> 0.70)
        if text_sim > 0.70:
            composite_score = max(composite_score, text_sim)

        reasons = []
        if text_sim >= 0.40:
            reasons.append(f"{round(text_sim * 100)}% NLP text content correlation")
        if same_category:
            reasons.append(f"Matching category '{new_category}'")
        if same_building:
            reasons.append(f"Same campus building '{new_building}'")
        if same_room:
            reasons.append(f"Identical room/unit '{new_room}'")

        if composite_score >= similarity_threshold or (text_sim >= 0.50 and same_building):
            candidates.append({
                "matching_report_id": rep["id"],
                "matching_title": rep.get("title", ""),
                "matching_description": rep.get("description", ""),
                "matching_category": rep.get("category", ""),
                "matching_building": rep.get("building", ""),
                "matching_room": rep.get("room", ""),
                "matching_status": rep.get("status", ""),
                "similarity_score": round(composite_score * 100, 1),
                "text_similarity": round(text_sim * 100, 1),
                "location_match": same_building,
                "category_match": same_category,
                "match_reasons": reasons,
                "created_at": rep.get("created_at"),
            })

    # Sort descending by composite similarity score
    candidates.sort(key=lambda x: x["similarity_score"], reverse=True)
    return candidates


def calculate_priority_score(
    severity: str,
    is_urgent: bool,
    category: str,
    duplicate_count: int = 0,
    age_hours: float = 0.0
) -> Dict[str, Any]:
    """Transparent rule-based priority engine.

    Returns the calculated score, priority level, and an explicit breakdown of reasons.
    """
    score = 0
    reasons = []

    # 1. Severity points
    severity_lower = (severity or "Medium").lower()
    if severity_lower == "critical":
        score += 40
        reasons.append("Reported user severity is Critical (+40 pts)")
    elif severity_lower == "high":
        score += 25
        reasons.append("Reported user severity is High (+25 pts)")
    elif severity_lower == "medium":
        score += 15
        reasons.append("Reported user severity is Medium (+15 pts)")
    else:
        score += 5
        reasons.append("Reported user severity is Low (+5 pts)")

    # 2. Urgency flag
    if is_urgent:
        score += 20
        reasons.append("Marked urgent due to active safety or operational hindrance (+20 pts)")

    # 3. Category critical hazard weight
    hazard_categories = ["electrical", "plumbing", "laboratory equipment", "infrastructure"]
    if category.lower() in hazard_categories:
        score += 15
        reasons.append(f"High-impact campus domain '{category}' with potential safety or structural hazards (+15 pts)")

    # 4. Similar / duplicate reports corroboration
    if duplicate_count >= 3:
        score += 25
        reasons.append(f"Heavily corroborated: {duplicate_count} similar reports indicate a widespread institutional failure (+25 pts)")
    elif duplicate_count >= 1:
        score += 15
        reasons.append(f"Corroborated by {duplicate_count} other student report(s) (+15 pts)")

    # 5. Issue aging
    if age_hours >= 72:
        score += 20
        reasons.append(f"Unresolved aging: pending for {int(age_hours)}h (>72h SLA escalation threshold) (+20 pts)")
    elif age_hours >= 24:
        score += 10
        reasons.append(f"Unresolved aging: pending for {int(age_hours)}h (>24h SLA review threshold) (+10 pts)")

    # Map score to suggested priority level
    if score >= 65:
        priority = "Critical"
    elif score >= 45:
        priority = "High"
    elif score >= 25:
        priority = "Medium"
    else:
        priority = "Low"

    return {
        "score": score,
        "suggested_priority": priority,
        "reasons": reasons
    }

