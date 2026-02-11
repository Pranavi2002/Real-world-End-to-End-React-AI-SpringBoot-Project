from recommender.recommender import recommend_courses

user_skills = [
    "Python",
    "Machine Learning",
    "Data Analysis"
]

results = recommend_courses(user_skills)

print("\nRecommended Courses:\n")
for course, score in results:
    print(f"{course['name']} → relevance: {round(score, 3)}")