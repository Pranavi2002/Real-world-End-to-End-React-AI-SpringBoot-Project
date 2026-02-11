import numpy as np
from .local_embeddings import get_embedding

def recommend_courses(user_skills, courses, top_k=3):
    user_text = " ".join(user_skills)
    user_embedding = get_embedding(user_text)

    course_texts = [
        f"{c.title} {c.description}" for c in courses
    ]
    course_embeddings = [get_embedding(t) for t in course_texts]

    similarities = [
        float(np.dot(user_embedding, ce) /
              (np.linalg.norm(user_embedding) * np.linalg.norm(ce)))
        for ce in course_embeddings
    ]

    top_indices = np.argsort(similarities)[::-1][:top_k]

    return [
        {
            "courseId": courses[i].courseId,
            "name": courses[i].title,
            "relevance": similarities[i]
        }
        for i in top_indices
    ]