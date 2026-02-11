package com.certifyai.certify_ai_backend.dto;

import java.util.List;

public class RecommendationRequest {
    private List<String> skills;
    private int topK = 3; // optional default value

    // Constructors
    public RecommendationRequest() {}

    public RecommendationRequest(List<String> skills, int topK) {
        this.skills = skills;
        this.topK = topK;
    }

    // Getters & setters
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public int getTopK() { return topK; }
    public void setTopK(int topK) { this.topK = topK; }
}