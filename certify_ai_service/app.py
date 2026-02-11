from fastapi import FastAPI
from pydantic import BaseModel
from recommender.recommender import recommend_courses

app = FastAPI(title="Certify AI Service")

class Course(BaseModel):
    courseId: int
    title: str
    description: str

class RecommendRequest(BaseModel):
    skills: list[str]
    courses: list[Course]
    top_k: int = 3

# Health check
@app.get("/health")
def health_check():
    return {"status": "ok"}

# Recommendation endpoint
@app.post("/recommend")
def recommend(req: RecommendRequest):
    return recommend_courses(
        user_skills=req.skills,
        courses=req.courses,
        top_k=req.top_k
    )