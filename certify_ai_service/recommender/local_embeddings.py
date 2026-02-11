from sentence_transformers import SentenceTransformer

# Lightweight, fast, widely used model
model = SentenceTransformer("all-MiniLM-L6-v2")

def get_embedding(text: str):
    return model.encode(text)