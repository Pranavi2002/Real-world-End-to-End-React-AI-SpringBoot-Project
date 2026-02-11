from sklearn.metrics.pairwise import cosine_similarity

def compute_similarity(user_vector, item_vectors):
    return cosine_similarity([user_vector], item_vectors)[0]