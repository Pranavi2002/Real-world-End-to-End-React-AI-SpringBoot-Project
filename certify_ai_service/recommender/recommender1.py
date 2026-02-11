import json
from .local_embeddings import get_embedding
from .similarity import compute_similarity

def load_courses():
    with open("data/courses.json", "r") as f:
        return json.load(f)

def recommend_courses(user_skills, top_k=3):
    courses = load_courses()

    user_text = " ".join(user_skills)
    user_vector = get_embedding(user_text)

    course_vectors = [
        get_embedding(course["description"])
        for course in courses
    ]

    scores = compute_similarity(user_vector, course_vectors)

    ranked = sorted(
        zip(courses, scores),
        key=lambda x: x[1],
        reverse=True
    )

    return ranked[:top_k]