# fetch recommended courses with no user login required

from fastapi import FastAPI
from pydantic import BaseModel
from recommender.recommender import recommend_courses

app = FastAPI(title="Certify AI Service")

# Request body model
class SkillsRequest(BaseModel):
    skills: list[str]
    top_k: int = 3  # default top 3 recommendations

# Health check
@app.get("/health")
def health_check():
    return {"status": "ok"}

# Recommendation endpoint
@app.post("/recommend")
def recommend(data: SkillsRequest):
    user_skills = data.skills
    top_k = data.top_k
    results = recommend_courses(user_skills, top_k=top_k)

    # Return results directly (already in correct format)
    return results