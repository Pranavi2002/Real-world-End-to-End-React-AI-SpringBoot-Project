package com.certifyai.certify_ai_backend.controller;

import com.certifyai.certify_ai_backend.service.RecommendationService;
import com.certifyai.certify_ai_backend.service.UserActivityService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommend")
@CrossOrigin(origins = "http://localhost:3000") // allow frontend calls
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;
    
    @Autowired
    private UserActivityService userActivityService; // 🔹 Inject UserActivityService

    /**
     * POST /api/recommend
     * Requires logged-in user (JWT) in Authorization header
     * Body: { "skills": ["skill1", "skill2", ...] }
     */
    @PostMapping
    public ResponseEntity<List<Map<String, Object>>> recommendCourses(
            @RequestBody Map<String, Object> request,
            Authentication authentication // Spring injects the logged-in user
    ) {
        // Optional: You can log who requested recommendations
        String userEmail = authentication.getName(); // email from JWT
        System.out.println("Recommendation requested by: " + userEmail);
        
     // 🔹 Log AI recommendation interaction
        userActivityService
                .logActivityFromEmail(userEmail, "AI_RECOMMENDATION");

        // Extract skills from request
        List<String> skills = (List<String>) request.get("skills");

        // Call service to get AI recommendations
        List<Map<String, Object>> recommendations = recommendationService.getRecommendations(skills);

        return ResponseEntity.ok(recommendations);
    }
}