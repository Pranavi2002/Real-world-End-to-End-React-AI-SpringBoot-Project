import requests
import numpy as np
from .local_embeddings import get_embedding

# Spring Boot backend endpoint to fetch live courses, with no user login required
BACKEND_URL = "http://localhost:8080/api/courses/public"

def fetch_courses():
    """
    Fetch courses from the Spring Boot backend.
    Returns a list of courses in the same format as courses.json
    """
    try:
        response = requests.get(BACKEND_URL)
        response.raise_for_status()
        # return response.json()  # Expecting a JSON array of courses
        courses = response.json()
        print(f"Fetched {len(courses)} courses from backend.")
        return courses
    except Exception as e:
        print(f"Error fetching courses from backend: {e}")
        return []

def recommend_courses(user_skills, top_k=3):
    courses = fetch_courses()  # fetch live courses from backend
    if not courses:
        print("No courses fetched from backend.")
        return []
    
    print("Courses fetched:", [c["title"] for c in courses])
    print("User skills:", user_skills)

    # Combine course title + description for embedding
    course_texts = [f"{c['title']} {c['description']}" for c in courses]
    course_embeddings = [get_embedding(text) for text in course_texts]

    # User embedding
    user_text = " ".join(user_skills)
    user_embedding = get_embedding(user_text)

    # Cosine similarity
    similarities = [
        float(np.dot(user_embedding, ce) / (np.linalg.norm(user_embedding) * np.linalg.norm(ce)))
        for ce in course_embeddings
    ]

    # Sort and get top_k recommendations
    top_indices = np.argsort(similarities)[::-1][:top_k]
    recommendations = [
        {"name": courses[i]["title"], "relevance": similarities[i]}
        for i in top_indices
    ]

    return recommendations