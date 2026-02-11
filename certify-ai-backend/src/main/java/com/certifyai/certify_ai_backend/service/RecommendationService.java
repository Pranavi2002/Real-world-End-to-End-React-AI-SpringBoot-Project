package com.certifyai.certify_ai_backend.service;

import com.certifyai.certify_ai_backend.entity.Course;
import com.certifyai.certify_ai_backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private CourseRepository courseRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    // URL of your AI service - the below line works when testing locally
//    private final String AI_SERVICE_URL = "http://localhost:8000/recommend";
    
    // when testing with docker, and with different port
    // this can also be used locally, if you don't want to expose the port
    @Value("${ai.service.url}")
    private String AI_SERVICE_URL;

    public List<Map<String, Object>> getRecommendations(List<String> userSkills) {

        // 1️⃣ Fetch all courses from DB
        List<Course> allCourses = courseRepository.findAll();

        // 2️⃣ Convert courses to List<Map<String,Object>> for AI service
        List<Map<String, Object>> coursesForAI = allCourses.stream()
                .map(c -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("courseId", c.getCourseId());
                    map.put("title", c.getTitle());
                    map.put("description", c.getDescription());
                    map.put("category", c.getCategory());
                    return map;
                })
                .collect(Collectors.toList());

        // 3️⃣ Prepare payload for AI service
        Map<String, Object> payload = new HashMap<>();
        payload.put("skills", userSkills);
        payload.put("courses", coursesForAI);
        payload.put("top_k", 3); // example: top 3 recommended courses

        // 4️⃣ Build HTTP request
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);

        try {
            // 5️⃣ Call AI service
            ResponseEntity<List> response = restTemplate.exchange(
                    AI_SERVICE_URL,
                    HttpMethod.POST,
                    requestEntity,
                    List.class
            );

            // 6️⃣ Return AI recommendations
            return response.getBody();

        } catch (Exception e) {
            e.printStackTrace();
            // In case of error, return empty list
            return Collections.emptyList();
        }
    }
}