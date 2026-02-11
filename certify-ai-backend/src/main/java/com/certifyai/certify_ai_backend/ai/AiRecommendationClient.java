package com.certifyai.certify_ai_backend.ai;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class AiRecommendationClient {

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Integer> getRecommendations(List<String> skills, List<Map<String, Object>> courses, int topK) {
        Map<String, Object> payload = Map.of(
            "skills", skills,
            "courses", courses,
            "top_k", topK
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        ResponseEntity<List> response = restTemplate.exchange(
                "http://localhost:8000/recommend",  // AI service URL
                HttpMethod.POST,
                request,
                List.class
        );

        return response.getBody();
    }
}